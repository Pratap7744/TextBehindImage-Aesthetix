import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";
import EditorNavbar from "./EditorNavbar";
import { Loader2, Upload, Download } from "lucide-react";

const TextBorderSubject = ({ session }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("NEYMAR");
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Arial Black");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 800, height: 600 });
  const [subjectMask, setSubjectMask] = useState(null);
  const [segmentationThreshold, setSegmentationThreshold] = useState(0.7);
  const [textSpacing, setTextSpacing] = useState(15);
  const [spaceFromSubject, setSpaceFromSubject] = useState(20); // Increased default to ensure text is outside
  const [textRotation, setTextRotation] = useState(true);
  const [outlineThickness, setOutlineThickness] = useState(1);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const fontFamilies = [
    "Arial", "Arial Black", "Verdana", "Tahoma", "Times New Roman",
    "Georgia", "Garamond", "Courier New", "Monaco", "Comic Sans MS", "Trebuchet MS",
    "Helvetica", "Palatino", "Bookman", "Futura", "Gill Sans", "Optima",
    "Baskerville", "Calibri", "Candara", "Consolas", "Corbel", "Segoe UI",
    "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Raleway",
    "Oswald", "Lobster", "Pacifico", "Dancing Script", "Playfair Display",
    "Merriweather", "Source Sans Pro", "Ubuntu", "Noto Sans", "Bebas Neue",
    "Arial Narrow", "Century Gothic", "Franklin Gothic Medium", "Lucida Sans",
    "Perpetua", "Rockwell", "Sylfaen", "Tempus Sans ITC",
  ];

  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        await tf.setBackend("webgl");
        const net = await bodyPix.load({
          architecture: "MobileNetV1",
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2,
        });
        setModel(net);
        setModelLoading(false);
      } catch (err) {
        console.error("Failed to load BodyPix model:", err);
        setError("Failed to load segmentation model. Using fallback.");
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imgDataUrl = e.target.result;
        setImageUrl(imgDataUrl);

        const img = new Image();
        img.onload = async () => {
          const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
          setImageSize(dimensions);

          const mask = await detectSubjectMask(img);
          setSubjectMask(mask);

          updatePreview(imgDataUrl, dimensions);
          setLoading(false);
        };
        img.src = imgDataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const detectSubjectMask = async (imgElement) => {
    if (!model) {
      console.log("No model loaded, returning empty mask");
      return new Uint8ClampedArray(imgElement.width * imgElement.height);
    }
    try {
      const segmentation = await model.segmentPerson(imgElement, {
        internalResolution: "medium",
        segmentationThreshold: segmentationThreshold,
        maxDetections: 1,
        scoreThreshold: 0.7,
      });

      const mask = new Uint8ClampedArray(imgElement.width * imgElement.height);
      for (let i = 0; i < segmentation.data.length; i++) {
        mask[i] = segmentation.data[i] ? 255 : 0;
      }

      const refinedMask = refineMask(mask, imgElement.width, imgElement.height);
      return refinedMask;
    } catch (err) {
      console.error("BodyPix segmentation error:", err);
      return new Uint8ClampedArray(imgElement.width * imgElement.height);
    }
  };

  const refineMask = (mask, width, height) => {
    const refinedMask = new Uint8ClampedArray(width * height);
    for (let i = 0; i < mask.length; i++) {
      refinedMask[i] = mask[i];
    }
    
    const dilatedMask = new Uint8ClampedArray(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        dilatedMask[idx] = refinedMask[idx];
        
        if (refinedMask[idx] === 0) {
          let neighborCount = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                if (refinedMask[ny * width + nx] === 255) {
                  neighborCount++;
                }
              }
            }
          }
          if (neighborCount >= 3) {
            dilatedMask[idx] = 255;
          }
        }
      }
    }
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (dilatedMask[idx] === 255) {
          let backgroundNeighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                if (dilatedMask[ny * width + nx] === 0) {
                  backgroundNeighbors++;
                }
              }
            }
          }
          if (backgroundNeighbors >= 5) {
            refinedMask[idx] = 0;
          } else {
            refinedMask[idx] = 255;
          }
        } else {
          refinedMask[idx] = 0;
        }
      }
    }
    
    return refinedMask;
  };

  const getSubjectOutline = (mask, width, height) => {
    const outline = [];
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        if (mask[i] === 255) {
          const hasBackgroundNeighbor = 
            mask[(y - 1) * width + x] === 0 ||
            mask[(y + 1) * width + x] === 0 ||
            mask[y * width + (x - 1)] === 0 ||
            mask[y * width + (x + 1)] === 0;
          
          if (hasBackgroundNeighbor) {
            outline.push({ x, y });
          }
        }
      }
    }
    
    if (outline.length > 0) {
      const sortedOutline = [outline[0]];
      const visited = new Set([`${outline[0].x},${outline[0].y}`]);
      
      while (sortedOutline.length < outline.length) {
        const current = sortedOutline[sortedOutline.length - 1];
        let closestIdx = -1;
        let closestDist = Infinity;
        
        for (let i = 0; i < outline.length; i++) {
          const point = outline[i];
          const key = `${point.x},${point.y}`;
          if (!visited.has(key)) {
            const dist = Math.sqrt(
              Math.pow(point.x - current.x, 2) + 
              Math.pow(point.y - current.y, 2)
            );
            if (dist < closestDist) {
              closestDist = dist;
              closestIdx = i;
            }
          }
        }
        
        if (closestIdx !== -1) {
          const nextPoint = outline[closestIdx];
          sortedOutline.push(nextPoint);
          visited.add(`${nextPoint.x},${nextPoint.y}`);
        } else {
          break;
        }
      }
      
      const smoothedOutline = [];
      const smoothingWindow = 10;
      for (let i = 0; i < sortedOutline.length; i++) {
        let avgX = 0;
        let avgY = 0;
        let count = 0;
        
        for (let j = -smoothingWindow; j <= smoothingWindow; j++) {
          const idx = (i + j + sortedOutline.length) % sortedOutline.length;
          avgX += sortedOutline[idx].x;
          avgY += sortedOutline[idx].y;
          count++;
        }
        
        smoothedOutline.push({
          x: avgX / count,
          y: avgY / count,
        });
      }
      
      return smoothedOutline;
    }
    
    return outline;
  };

  const updatePreview = async (imgUrl, imgSize) => {
    if (!imgUrl || !text || !subjectMask) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
  
    try {
      canvas.width = imgSize.width;
      canvas.height = imgSize.height;
      const ctx = canvas.getContext("2d");
  
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
        
        const outline = getSubjectOutline(subjectMask, canvas.width, canvas.height);
        
        if (outline.length === 0) {
          setError("Could not detect person. Ensure the image contains a clear human figure.");
          return;
        }
        
        if (outline.length < 5) {
          setError("Detected outline too small. Try a clearer image of a person.");
          return;
        }
        
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.textBaseline = "middle";
        
        let perimeter = 0;
        for (let i = 0; i < outline.length - 1; i++) {
          const dx = outline[i + 1].x - outline[i].x;
          const dy = outline[i + 1].y - outline[i].y;
          perimeter += Math.sqrt(dx * dx + dy * dy);
        }
        const dx = outline[0].x - outline[outline.length - 1].x;
        const dy = outline[0].y - outline[outline.length - 1].y;
        perimeter += Math.sqrt(dx * dx + dy * dy);
        
        const singleTextMetrics = ctx.measureText(text);
        const singleTextWidth = singleTextMetrics.width;
        const charWidth = singleTextWidth / text.length;
        
        const adjustedSpacing = textSpacing;
        const charsPerText = text.length;
        const totalCharWidth = charWidth + adjustedSpacing;
        const totalChars = Math.floor(perimeter / totalCharWidth);
        const repeatCount = Math.ceil(totalChars / charsPerText);
        const fullText = text.repeat(repeatCount).slice(0, totalChars);
        
        const step = outline.length / totalChars;
        
        for (let i = 0; i < fullText.length; i++) {
          const pointIndex = Math.floor(i * step) % outline.length;
          const point = outline[pointIndex];
          const nextIndex = (pointIndex + 1) % outline.length;
          const nextPoint = outline[nextIndex];
          
          const char = fullText[i];
          
          let angle = 0;
          if (textRotation) {
            angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
          }
          
          // Calculate normal vector to ensure text is outside the subject
          const normalAngle = angle + Math.PI / 2;
          const baseOffset = spaceFromSubject + fontSize / 2; // Ensure text is fully outside
          let offsetX = Math.cos(normalAngle) * baseOffset;
          let offsetY = Math.sin(normalAngle) * baseOffset;

          // Check if the offset direction is inside the subject; if so, flip it
          const testX = Math.round(point.x + offsetX);
          const testY = Math.round(point.y + offsetY);
          const testIdx = testY * canvas.width + testX;
          if (
            testX >= 0 && testX < canvas.width &&
            testY >= 0 && testY < canvas.height &&
            subjectMask[testIdx] === 255
          ) {
            // Flip the offset to the opposite side
            offsetX = -offsetX;
            offsetY = -offsetY;
          }

          ctx.save();
          ctx.translate(point.x + offsetX, point.y + offsetY);
          if (textRotation) {
            ctx.rotate(angle);
          }
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
        
        const resultUrl = canvas.toDataURL("image/png");
        setResult(resultUrl);
      };
      image.src = imgUrl;
    } catch (err) {
      console.error("Processing error:", err);
      setError("Failed to process image. Try a different image.");
    }
  };

  useEffect(() => {
    if (imageUrl && !loading) {
      updatePreview(imageUrl, imageSize);
    }
  }, [text, fontSize, fontColor, fontFamily, subjectMask, textSpacing, spaceFromSubject, textRotation, outlineThickness]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match("image.*")) {
        const input = fileInputRef.current;
        if (input) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;
          handleImageUpload({ target: { files: [file] } });
        }
      }
    }
  };

  const handleReset = () => {
    setImageUrl("");
    setResult(null);
    setError(null);
    setSubjectMask(null);
    setText("NEYMAR");
    setFontSize(24);
    setFontColor("#ffffff");
    setFontFamily("Arial Black");
    setTextSpacing(15);
    setSpaceFromSubject(20); // Reset to a safer default
    setTextRotation(true);
    setOutlineThickness(1);
    setSegmentationThreshold(0.7);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderInitialUploadUI = () => (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: !imageUrl && !loading ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-[calc(90vh-72px)]"
    >
      {(!imageUrl && !loading) && (
        <div
          className="relative w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100 p-10 shadow-xl rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-2xl border border-indigo-200/50 overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-200/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-300/30 rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative flex flex-col items-center justify-center h-full text-center">
            <motion.div
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mb-6"
            >
              <Upload className="w-24 h-24 text-indigo-500 drop-shadow-lg" />
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 mb-3 tracking-tight"
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              Create a Text Border!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-gray-600 text-lg max-w-md mb-6"
            >
              Drop your image here or click to upload and add a text border around a person
            </motion.p>
            <motion.button
              className="relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-full font-semibold text-lg shadow-lg hover:from-indigo-600 hover:to-indigo-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(99, 102, 241, 0.5)",
                  "0 0 0 20px rgba(99, 102, 241, 0)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="relative z-10">Upload Image</span>
            </motion.button>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-500 text-sm mt-6"
            >
              Supports JPG, PNG, GIF, and more
            </motion.p>
            {modelLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center gap-2 mt-4"
              >
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                <span className="text-indigo-500 text-sm">Preparing AI for optimal results...</span>
              </motion.div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={modelLoading}
          />
        </div>
      )}
    </motion.div>
  );

  const renderProcessingUI = () => (
    <div
      className="relative w-full h-[calc(100vh-72px)] flex justify-center items-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-10 shadow-xl rounded-2xl border border-indigo-200/50 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-200/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-300/30 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>
      <div className="relative flex flex-col items-center gap-4">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-500 drop-shadow-md" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl text-gray-700 font-semibold"
        >
          Processing your image...
        </motion.p>
      </div>
    </div>
  );

  const renderEditorUI = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl flex flex-col lg:flex-row justify-center gap-6"
    >
      <div className="w-full lg:w-3/5 mx-auto flex justify-center">
        <div className="flex flex-col items-center w-auto">
          <div className="relative flex justify-center items-center rounded-xl overflow-hidden shadow-lg">
            <canvas
              ref={previewCanvasRef}
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
          {result && !loading && (
            <motion.a
              href={result}
              download="text-border-subject.png"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
            >
              <Download className="h-5 w-5" />
              Download Edited Image
            </motion.a>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-2/5 mx-auto rounded-2xl bg-white p-6 shadow-lg overflow-y-auto max-h-[calc(100vh-150px)] border border-gray-200"
      >
        <div className="space-y-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-300 text-gray-700"
          >
            <Upload className="h-5 w-5" />
            Upload New Image
          </motion.button>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
            <h3 className="font-medium text-gray-800 flex items-center gap-2 text-lg mb-4">
              Text Border Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Border Text</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value.toUpperCase())}
                  className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800 transition-all duration-300"
                  placeholder="Enter border text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800 transition-all duration-300"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>10px</span>
                  <span>40px</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Font Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="h-10 w-12 rounded-lg border border-gray-300 cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-indigo-300"
                  />
                  <input
                    type="text"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="flex-1 p-3 bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Text Spacing: {textSpacing}px
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={textSpacing}
                  onChange={(e) => setTextSpacing(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Dense</span>
                  <span>Sparse</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Space from Subject: {spaceFromSubject}px
                </label>
                <input
                  type="range"
                  min="10" // Increased min to prevent overlap
                  max="50"
                  value={spaceFromSubject}
                  onChange={(e) => setSpaceFromSubject(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Close</span>
                  <span>Far</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="rotate-text"
                  type="checkbox"
                  checked={textRotation}
                  onChange={(e) => setTextRotation(e.target.checked)}
                  className="h-4 w-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="rotate-text" className="ml-2 text-sm font-medium text-gray-700">
                  Rotate text along border
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Person Detection Sensitivity: {Math.round(segmentationThreshold * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={segmentationThreshold}
                  onChange={(e) => setSegmentationThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Less strict</span>
                  <span>More strict</span>
                </div>
                <button
                  onClick={async () => {
                    if (imageUrl) {
                      setLoading(true);
                      const img = new Image();
                      img.onload = async () => {
                        const mask = await detectSubjectMask(img);
                        setSubjectMask(mask);
                        updatePreview(imageUrl, imageSize);
                        setLoading(false);
                      };
                      img.src = imageUrl;
                    }
                  }}
                  className="mt-2 w-full py-2 px-3 text-sm bg-indigo-100 hover:bg-indigo-200 rounded-lg text-indigo-700 transition-all duration-300"
                >
                  Redetect Person
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <EditorNavbar session={session} />
      <section
        id="editor"
        className="w-full min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-gray-50 to-indigo-100/30"
      >
        <div className="w-full max-w-7xl flex flex-col items-center h-[calc(100vh-72px)]">
          {!imageUrl && !loading && (
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 mb-6 tracking-tight"
            >
              Text Border Subject
            </motion.h1>
          )}
          <div className="w-full h-full flex items-center justify-center">
            {loading ? (
              renderProcessingUI()
            ) : imageUrl ? (
              renderEditorUI()
            ) : (
              renderInitialUploadUI()
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TextBorderSubject;