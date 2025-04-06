import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { HelpCircle, UploadCloud, Loader2 } from "lucide-react";
import { debounce } from "lodash";
import PreviewBox from "./PreviewBox";
import ControlPanel from "./ControlPanel";
import EditorNavbar from "./EditorNavbar";

const EditorSection = memo(({ session }) => {
  const [image, setImage] = useState(null);
  const [foreground, setForeground] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sharpness, setSharpness] = useState(100);
  const [aspectRatio, setAspectRatio] = useState("1:1");

  const [texts, setTexts] = useState([{
    id: 1, content: "edit", color: "rgba(255, 255, 255, 1)", size: 150, rotation: 0,
    position: { x: 50, y: 50 }, fontFamily: "sans-serif", textAlign: "center",
    isBold: false, isItalic: false, isUnderlined: false, opacity: 1,
    textShadow: { enabled: false, color: "rgba(0, 0, 0, 0.8)", blur: 4, offsetX: 2, offsetY: 2 },
    gradient: { enabled: false, color1: "#ff0000", color2: "#0000ff" },
  }]);
  const [selectedTextId, setSelectedTextId] = useState(1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("Text");
  const [showControls, setShowControls] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const previewRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedText = texts.find((t) => t.id === selectedTextId) || texts[0];

  const fontFamilies = useRef([
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Helvetica, sans-serif", label: "Helvetica" },
    { value: "Verdana, sans-serif", label: "Verdana" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Courier New, monospace", label: "Courier New" },
    { value: "Brush Script MT, cursive", label: "Brush Script" },
    { value: "Impact, sans-serif", label: "Impact" },
    { value: "Comic Sans MS, cursive", label: "Comic Sans" },
    { value: "Futura, sans-serif", label: "Futura" },
    { value: "Roboto, sans-serif", label: "Roboto" },
    { value: "Open Sans, sans-serif", label: "Open Sans" },
    { value: "Lato, sans-serif", label: "Lato" },
    { value: "Montserrat, sans-serif", label: "Montserrat" },
    { value: "Poppins, sans-serif", label: "Poppins" },
  ]).current;

  const aspectRatios = useRef([
    { value: "1:1", label: "1:1", ratio: 1 },
    { value: "4:3", label: "4:3", ratio: 4 / 3 },
    { value: "16:9", label: "16:9", ratio: 16 / 9 },
    { value: "3:2", label: "3:2", ratio: 3 / 2 },
  ]).current;

  useEffect(() => {
    const updatePreview = () => {
      if (containerRef.current && imgRef.current) {
        const ratio = aspectRatios.find((ar) => ar.value === aspectRatio).ratio;
        const width = containerRef.current.clientWidth;
        const height = width / ratio;
        setPreviewDimensions({ width, height });
      }
    };
    updatePreview();
    const observer = new ResizeObserver(updatePreview);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [aspectRatio]);

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setLoading(true);
    const imgUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = imgUrl;
    setImage(imgUrl);

    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const result = await removeBackground(file);
      setForeground(URL.createObjectURL(result));
    } catch (err) {
      setError("Failed to process image.");
      setForeground(imgUrl);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTextPropertyWithHistory = useCallback((property, value) => {
    const newTexts = property === "texts"
      ? value
      : texts.map((t) => t.id === selectedTextId ? { ...t, [property]: property === "position" ? { ...t.position, ...value } : value } : t);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), texts]);
    setHistoryIndex((prev) => prev + 1);
    setTexts(newTexts);
  }, [texts, selectedTextId, historyIndex]);

  const updateTextProperty = useCallback(debounce((property, value) => {
    updateTextPropertyWithHistory(property, value);
  }, 100), [updateTextPropertyWithHistory]);

  const updateTextShadowProperty = useCallback(debounce((property, value) => {
    setTexts((prev) =>
      prev.map((t) => t.id === selectedTextId ? { ...t, textShadow: { ...t.textShadow, [property]: value } } : t)
    );
  }, 100), [selectedTextId]);

  const updateTextGradientProperty = useCallback(debounce((property, value) => {
    setTexts((prev) =>
      prev.map((t) => t.id === selectedTextId ? { ...t, gradient: { ...t.gradient, [property]: value } } : t)
    );
  }, 100), [selectedTextId]);

  const handleToggleGradient = useCallback(() => {
    setTexts((prev) =>
      prev.map((t) => t.id === selectedTextId ? { ...t, gradient: { ...t.gradient, enabled: !t.gradient.enabled } } : t)
    );
  }, [selectedTextId]);

  const handleUpdateGradientColor = useCallback((property, value) => {
    setTexts((prev) =>
      prev.map((t) => t.id === selectedTextId ? { ...t, gradient: { ...t.gradient, [property]: value } } : t)
    );
  }, [selectedTextId]);

  const handleColorChange = useCallback((color) => {
    const { r, g, b, a } = color.rgb;
    updateTextProperty("color", `rgba(${r}, ${g}, ${b}, ${a})`);
  }, [updateTextProperty]);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || !imgRef.current) return;
    setDownloading(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = originalDimensions.width;
    canvas.height = originalDimensions.height;

    const scaleX = previewDimensions.width > 0 ? originalDimensions.width / previewDimensions.width : 1;
    const scaleY = previewDimensions.height > 0 ? originalDimensions.height / previewDimensions.height : 1;

    if (image) {
      const bgImage = new Image();
      bgImage.crossOrigin = "Anonymous";
      bgImage.src = image;
      await new Promise((resolve) => (bgImage.onload = resolve));
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) blur(${(100 - sharpness) / 50}px)`;
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }

    ctx.filter = "none"; // Reset filter for text and foreground

    texts.forEach((text) => {
      const textX = (text.position.x / 100) * canvas.width;
      const textY = (text.position.y / 100) * canvas.height;
      const scaleFactor = Math.max(scaleX, scaleY);
      const scaledFontSize = text.size * scaleFactor || 40; // Fallback to 40 if NaN

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate((text.rotation * Math.PI) / 180);

      const fontStyle = [
        text.isItalic ? "italic" : "",
        text.isBold ? "bold" : "",
        `${scaledFontSize}px`,
        text.fontFamily,
      ].filter(Boolean).join(" ");
      ctx.font = fontStyle;

      if (text.gradient.enabled) {
        const gradientHeight = scaledFontSize > 0 ? scaledFontSize : 40;
        const gradient = ctx.createLinearGradient(
          0, -gradientHeight / 2, // x1, y1
          0, gradientHeight / 2   // x2, y2
        );
        gradient.addColorStop(0, text.gradient.color1);
        gradient.addColorStop(1, text.gradient.color2);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = text.color;
      }

      ctx.globalAlpha = text.opacity;
      ctx.textAlign = text.textAlign;
      ctx.textBaseline = "middle";

      if (text.textShadow.enabled) {
        ctx.shadowColor = text.textShadow.color;
        ctx.shadowBlur = text.textShadow.blur * scaleFactor;
        ctx.shadowOffsetX = text.textShadow.offsetX * scaleFactor;
        ctx.shadowOffsetY = text.textShadow.offsetY * scaleFactor;
      }

      ctx.fillText(text.content, 0, 0);

      if (text.isUnderlined) {
        const textMetrics = ctx.measureText(text.content);
        const underlineY = scaledFontSize * 0.1;
        ctx.beginPath();
        ctx.strokeStyle = text.gradient.enabled ? text.gradient.color1 : text.color;
        ctx.lineWidth = scaledFontSize * 0.05;
        if (text.textAlign === "left") {
          ctx.moveTo(0, underlineY);
          ctx.lineTo(textMetrics.width, underlineY);
        } else if (text.textAlign === "center") {
          ctx.moveTo(-textMetrics.width / 2, underlineY);
          ctx.lineTo(textMetrics.width / 2, underlineY);
        } else if (text.textAlign === "right") {
          ctx.moveTo(-textMetrics.width, underlineY);
          ctx.lineTo(0, underlineY);
        }
        ctx.stroke();
      }

      ctx.restore();
    });

    if (foreground) {
      const fgImage = new Image();
      fgImage.crossOrigin = "Anonymous";
      fgImage.src = foreground;
      await new Promise((resolve) => (fgImage.onload = resolve));
      ctx.drawImage(fgImage, 0, 0, canvas.width, canvas.height);
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "TextBehindImage-Aesthetix.png";
    link.click();
    setDownloading(false);
  }, [image, foreground, brightness, contrast, sharpness, texts, originalDimensions, previewDimensions]);

  const getTextShadowCSS = useCallback((shadow) => shadow.enabled
    ? `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color}`
    : "none", []);

  const getTransform = useCallback((text) => {
    switch (text.textAlign) {
      case "left": return `translate(0, -50%) rotate(${text.rotation}deg)`;
      case "center": return `translate(-50%, -50%) rotate(${text.rotation}deg)`;
      case "right": return `translate(-100%, -50%) rotate(${text.rotation}deg)`;
      default: return `translate(-50%, -50%) rotate(${text.rotation}deg)`;
    }
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <EditorNavbar session={session} />
      <section className="flex-1 w-full flex flex-col items-center pt-16 px-4 pb-20 bg-gradient-to-br from-gray-50 to-indigo-100/30 overflow-y-auto">
        {!image && !loading && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600 my-4 text-center"
          >
            Text Behind Image
          </motion.h1>
        )}
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        <div className="w-full flex-1 flex items-center justify-center">
          {!image && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md mx-auto flex flex-col items-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-indigo-200/50"
              onClick={() => fileInputRef.current.click()}
            >
              <UploadCloud className="w-16 h-16 text-indigo-500 mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-indigo-600 mb-2">Let’s Create Something Amazing!</h2>
              <p className="text-gray-600 mb-4">Drop your image here or click to upload</p>
              <motion.button className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600">
                Upload Image
              </motion.button>
            </motion.div>
          )}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md mx-auto flex flex-col items-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-indigo-200/50"
            >
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
              <p className="text-lg text-gray-700">Processing your image...</p>
            </motion.div>
          )}
          {image && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-6xl flex flex-col lg:flex-row gap-4"
            >
              <div className="w-full lg:w-3/5">
                <PreviewBox
                  image={image}
                  foreground={foreground}
                  loading={loading}
                  error={error}
                  originalDimensions={originalDimensions}
                  previewDimensions={previewDimensions}
                  setPreviewDimensions={setPreviewDimensions}
                  brightness={brightness}
                  contrast={contrast}
                  sharpness={sharpness}
                  texts={texts}
                  selectedTextId={selectedTextId}
                  getTransform={getTransform}
                  getTextShadowCSS={getTextShadowCSS}
                  imgRef={imgRef}
                  previewRef={previewRef}
                  containerRef={containerRef}
                  handleDownload={handleDownload}
                  downloading={downloading}
                  setError={setError}
                  aspectRatio={aspectRatio}
                />
              </div>
              <div className="w-full lg:w-2/5">
                <ControlPanel
                  image={image}
                  loading={loading}
                  texts={texts}
                  setTexts={setTexts}
                  selectedTextId={selectedTextId}
                  setSelectedTextId={setSelectedTextId}
                  selectedText={selectedText}
                  fontFamilies={fontFamilies}
                  showColorPicker={showColorPicker}
                  setShowColorPicker={setShowColorPicker}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  showControls={showControls}
                  setShowControls={setShowControls}
                  handleImageUpload={handleImageUpload}
                  updateTextProperty={updateTextProperty}
                  updateTextShadowProperty={updateTextShadowProperty}
                  updateTextGradientProperty={updateTextGradientProperty}
                  handleToggleGradient={handleToggleGradient}
                  handleUpdateGradientColor={handleUpdateGradientColor}
                  handleColorChange={handleColorChange}
                  brightness={brightness}
                  setBrightness={setBrightness}
                  contrast={contrast}
                  setContrast={setContrast}
                  sharpness={sharpness}
                  setSharpness={setSharpness}
                  aspectRatio={aspectRatio}
                  setAspectRatio={setAspectRatio}
                />
              </div>
            </motion.div>
          )}
        </div>
        <button className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700">
          <HelpCircle className="h-6 w-6" />
        </button>
      </section>
    </div>
  );
});

export default EditorSection;