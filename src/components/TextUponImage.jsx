import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";
import EditorNavbar from "./EditorNavbar";
import { Loader2, Upload, Download } from "lucide-react";

const TextUponImage = ({ session }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("TEXT");
  const [fontSize, setFontSize] = useState(100);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Impact");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [imageSize, setImageSize] = useState({ width: 800, height: 600 });
  const [outlineWidth, setOutlineWidth] = useState(4);
  const [subjectMask, setSubjectMask] = useState(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const fontFamilies = [
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Helvetica, sans-serif", label: "Helvetica" },
    { value: "Verdana, sans-serif", label: "Verdana" },
    { value: "Tahoma, sans-serif", label: "Tahoma" },
    { value: "Trebuchet MS, sans-serif", label: "Trebuchet MS" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Garamond, serif", label: "Garamond" },
    { value: "Courier New, monospace", label: "Courier New" },
    { value: "Monaco, monospace", label: "Monaco" },
    { value: "Brush Script MT, cursive", label: "Brush Script" },
    { value: "Lucida Sans, sans-serif", label: "Lucida Sans" },
    { value: "Palatino Linotype, serif", label: "Palatino" },
    { value: "Book Antiqua, serif", label: "Book Antiqua" },
    { value: "Impact, sans-serif", label: "Impact" },
    { value: "Comic Sans MS, cursive", label: "Comic Sans" },
    { value: "Futura, sans-serif", label: "Futura" },
    { value: "Roboto, sans-serif", label: "Roboto" },
    { value: "Open Sans, sans-serif", label: "Open Sans" },
    { value: "Lato, sans-serif", label: "Lato" },
    { value: "Montserrat, sans-serif", label: "Montserrat" },
    { value: "Poppins, sans-serif", label: "Poppins" },
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
        console.error("Failed to load model:", err);
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
      return new Uint8ClampedArray(imgElement.width * imgElement.height);
    }
    try {
      const segmentation = await model.segmentPerson(imgElement, {
        flipHorizontal: false,
        internalResolution: "medium",
        segmentationThreshold: 0.7,
      });
      const mask = new Uint8ClampedArray(imgElement.width * imgElement.height);
      for (let i = 0; i < segmentation.data.length; i++) {
        mask[i] = segmentation.data[i] ? 255 : 0;
      }
      return mask;
    } catch (err) {
      console.error("Segmentation error:", err);
      return new Uint8ClampedArray(imgElement.width * imgElement.height);
    }
  };

  useEffect(() => {
    if (imageUrl && !loading) {
      updatePreview(imageUrl, imageSize);
    }
  }, [text, fontSize, fontColor, fontFamily, textPosition, outlineWidth, subjectMask]);

  const updatePreview = async (imgUrl, imgSize) => {
    if (!imgUrl || !text) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    try {
      canvas.width = imgSize.width;
      canvas.height = imgSize.height;
      const ctx = canvas.getContext("2d");

      const image = new Image();
      image.onload = async () => {
        ctx.drawImage(image, 0, 0);
        const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const mask = subjectMask || new Uint8ClampedArray(canvas.width * canvas.height);

        const textCanvas = document.createElement("canvas");
        textCanvas.width = canvas.width;
        textCanvas.height = canvas.height;
        const textCtx = textCanvas.getContext("2d");
        textCtx.font = `bold ${fontSize}px ${fontFamily}`;
        textCtx.textAlign = "center";
        textCtx.textBaseline = "middle";

        const textX = Math.round((canvas.width * textPosition.x) / 100);
        const textY = Math.round((canvas.height * textPosition.y) / 100);

        textCtx.fillStyle = fontColor;
        textCtx.fillText(text, textX, textY);
        const textData = textCtx.getImageData(0, 0, canvas.width, canvas.height);

        const outlineCanvas = document.createElement("canvas");
        outlineCanvas.width = canvas.width;
        outlineCanvas.height = canvas.height;
        const outlineCtx = outlineCanvas.getContext("2d");
        outlineCtx.font = `bold ${fontSize}px ${fontFamily}`;
        outlineCtx.textAlign = "center";
        outlineCtx.textBaseline = "middle";
        outlineCtx.strokeStyle = fontColor;
        outlineCtx.lineWidth = outlineWidth;
        outlineCtx.strokeText(text, textX, textY);
        const outlineData = outlineCtx.getImageData(0, 0, canvas.width, canvas.height);

        const resultData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < canvas.width * canvas.height; i++) {
          const inSubject = mask[i] === 255;
          const inSolidText = textData.data[i * 4 + 3] > 0;
          const inOutline = outlineData.data[i * 4 + 3] > 0;

          if (inSubject && (inSolidText || inOutline)) {
            if (inOutline) {
              resultData.data[i * 4] = outlineData.data[i * 4];
              resultData.data[i * 4 + 1] = outlineData.data[i * 4 + 1];
              resultData.data[i * 4 + 2] = outlineData.data[i * 4 + 2];
              resultData.data[i * 4 + 3] = 255;
            } else {
              resultData.data[i * 4] = originalData.data[i * 4];
              resultData.data[i * 4 + 1] = originalData.data[i * 4 + 1];
              resultData.data[i * 4 + 2] = originalData.data[i * 4 + 2];
              resultData.data[i * 4 + 3] = 255;
            }
          } else if (inSolidText) {
            resultData.data[i * 4] = textData.data[i * 4];
            resultData.data[i * 4 + 1] = textData.data[i * 4 + 1];
            resultData.data[i * 4 + 2] = textData.data[i * 4 + 2];
            resultData.data[i * 4 + 3] = 255;
          } else {
            resultData.data[i * 4] = originalData.data[i * 4];
            resultData.data[i * 4 + 1] = originalData.data[i * 4 + 1];
            resultData.data[i * 4 + 2] = originalData.data[i * 4 + 2];
            resultData.data[i * 4 + 3] = 255;
          }
        }

        ctx.putImageData(resultData, 0, 0);
        const resultUrl = canvas.toDataURL("image/png");
        setResult(resultUrl);
      };
      image.src = imgUrl;
    } catch (err) {
      console.error("Processing error:", err);
      setError("Failed to process image. Try a different image.");
    }
  };

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
    setText("TEXT");
    setFontSize(100);
    setFontColor("#ffffff");
    setFontFamily("Impact");
    setTextPosition({ x: 50, y: 50 });
    setOutlineWidth(4);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderInitialUploadUI = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-indigo-200/50 overflow-hidden"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload className="w-16 h-16 text-indigo-500 mb-4 animate-bounce" />
      <h2 className="text-2xl font-bold text-indigo-600 mb-2 text-center">
        Let’s Create Something Amazing!
      </h2>
      <p className="text-gray-600 text-center mb-4">
        Drop your image here or click to upload
      </p>
      <motion.button
        className="px-6 py-2 bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={modelLoading}
      >
        Upload Image
      </motion.button>
      <p className="text-gray-500 text-sm mt-4">Supports JPG, PNG, GIF</p>
      {modelLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center gap-2 mt-4"
        >
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span className="text-indigo-500 text-sm">Preparing AI...</span>
        </motion.div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={modelLoading}
      />
    </motion.div>
  );

  const renderProcessingUI = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-indigo-200/50 overflow-hidden"
    >
      <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
      <p className="text-lg text-gray-700 font-semibold">Processing your image...</p>
    </motion.div>
  );

  const renderEditorUI = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl flex flex-col lg:flex-row gap-4"
    >
      {/* Preview Box */}
      <div className="w-full lg:w-3/5">
        <div className="flex flex-col items-center">
          <div className="relative flex justify-center items-center rounded-xl overflow-hidden shadow-lg">
            <canvas
              ref={previewCanvasRef}
              className="max-h-[70vh] max-w-full object-contain"
            />
          </div>
          {result && !loading && (
            <motion.a
              href={result}
              download="text-upon-image.png"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 w-full max-w-xs flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
            >
              <Download className="h-5 w-5" />
              Download Image
            </motion.a>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-2/5">
        <div className="rounded-2xl bg-white p-6 shadow-lg overflow-y-auto max-h-[calc(100vh-150px)] border border-gray-200">
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
              <h3 className="font-medium text-gray-800 text-lg mb-4">Text Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Text Content</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800 transition-all duration-300"
                    placeholder="Enter your text"
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
                      <option
                        key={font.value}
                        value={font.value}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
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
                    min="20"
                    max="600"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>20px</span>
                    <span>600px</span>
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
                    Position X: {textPosition.x}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={textPosition.x}
                    onChange={(e) => setTextPosition({ ...textPosition, x: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Left</span>
                    <span>Right</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position Y: {textPosition.y}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={textPosition.y}
                    onChange={(e) => setTextPosition({ ...textPosition, y: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Top</span>
                    <span>Bottom</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Outline Width: {outlineWidth}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={outlineWidth}
                    onChange={(e) => setOutlineWidth(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0px</span>
                    <span>20px</span>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <EditorNavbar session={session} />
      <section
        id="editor"
        className="flex-1 w-full flex flex-col items-center justify-start pt-16 px-4 pb-20 bg-gradient-to-br from-gray-50 to-indigo-100/30 overflow-y-auto"
      >
        {!imageUrl && !loading && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600 my-4 text-center"
          >
            Text On Image
          </motion.h1>
        )}
        <div className="w-full flex-1 flex items-center justify-center">
          {loading ? renderProcessingUI() : imageUrl ? renderEditorUI() : renderInitialUploadUI()}
        </div>
      </section>
    </div>
  );
};

export default TextUponImage;