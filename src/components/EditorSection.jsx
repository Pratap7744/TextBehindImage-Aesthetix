import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HelpCircle, UploadCloud, Loader2 } from "lucide-react";
import { debounce } from "lodash";
import PreviewBox from "./PreviewBox";
import ControlPanel from "./ControlPanel";
import EditorNavbar from "./EditorNavbar";

const EditorSection = ({ session }) => {
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

  const [texts, setTexts] = useState([
    {
      id: 1,
      content: "edit",
      color: "rgba(255, 255, 255, 1)",
      size: 40,
      rotation: 0,
      position: { x: 50, y: 50 },
      fontFamily: "sans-serif",
      textAlign: "center",
      isBold: false,
      isItalic: false,
      isUnderlined: false,
      opacity: 1,
      textShadow: {
        enabled: false,
        color: "rgba(0, 0, 0, 0.8)",
        blur: 4,
        offsetX: 2,
        offsetY: 2,
      },
      gradient: {
        enabled: false,
        color1: "#ff0000",
        color2: "#0000ff",
      },
    },
  ]);
  const [selectedTextId, setSelectedTextId] = useState(1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("Text");
  const [showControls, setShowControls] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const previewRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedText = texts.find((text) => text.id === selectedTextId) || {
    id: 1,
    content: "",
    color: "rgba(255, 255, 255, 1)",
    size: 40,
    rotation: 0,
    position: { x: 50, y: 50 },
    fontFamily: "sans-serif",
    textAlign: "center",
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    opacity: 1,
    textShadow: {
      enabled: false,
      color: "rgba(0, 0, 0, 0.8)",
      blur: 4,
      offsetX: 2,
      offsetY: 2,
    },
    gradient: {
      enabled: false,
      color1: "#ff0000",
      color2: "#0000ff",
    },
  };

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


  const aspectRatios = [
    { value: "1:1", label: "1:1", ratio: 1 },
    { value: "4:3", label: "4:3", ratio: 4 / 3 },
    { value: "16:9", label: "16:9", ratio: 16 / 9 },
    { value: "3:2", label: "3:2", ratio: 3 / 2 },
  ];

  useEffect(() => {
    if (containerRef.current && imgRef.current) {
      const updatePreviewDimensions = () => {
        const selectedRatio = aspectRatios.find((ar) => ar.value === aspectRatio).ratio;
        const containerWidth = containerRef.current.clientWidth;
        const newHeight = containerWidth / selectedRatio;
        setPreviewDimensions({
          width: containerWidth,
          height: newHeight,
        });
      };

      updatePreviewDimensions();
      const resizeObserver = new ResizeObserver(updatePreviewDimensions);
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [image, aspectRatio]);

  useEffect(() => {
    if (texts.length === 0) {
      setSelectedTextId(1);
    } else if (!texts.some((text) => text.id === selectedTextId)) {
      setSelectedTextId(texts[0].id);
    }
  }, [texts, selectedTextId]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const imgUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = imgUrl;
      setImage(imgUrl);

      const { removeBackground } = await import("@imgly/background-removal");
      const result = await removeBackground(file);
      setForeground(URL.createObjectURL(result));
    } catch (error) {
      console.error("Background removal failed:", error);
      setError("Failed to process image. Please try again.");
      setForeground(imgUrl);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const updateTextPropertyWithHistory = useCallback(
    (property, value) => {
      const newTexts =
        property === "texts"
          ? value
          : texts.map((text) =>
              text.id === selectedTextId
                ? { ...text, [property]: property === "position" ? { ...text.position, ...value } : value }
                : text
            );
      const newHistory = [...history.slice(0, historyIndex + 1), texts];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setTexts(newTexts);
    },
    [texts, selectedTextId, history, historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTexts(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTexts(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  const handleDuplicateText = () => {
    if (!selectedText) return;
    const newText = {
      ...selectedText,
      id: Math.max(...texts.map((t) => t.id), 0) + 1,
      content: selectedText.content + " (Copy)",
      position: { x: selectedText.position.x + 5, y: selectedText.position.y + 5 },
      opacity: selectedText.opacity,
      gradient: { ...selectedText.gradient },
    };
    const newTexts = [...texts, newText];
    updateTextPropertyWithHistory("texts", newTexts);
    setSelectedTextId(newText.id);
  };

  const handleDeleteText = () => {
    if (texts.length === 0) return;
    const updatedTexts = texts.filter((text) => text.id !== selectedTextId);
    updateTextPropertyWithHistory("texts", updatedTexts);
    setSelectedTextId(updatedTexts.length > 0 ? updatedTexts[0].id : 1);
  };

  const updateTextGradientProperty = useCallback(
    debounce((property, value) => {
      setTexts(
        texts.map((text) =>
          text.id === selectedTextId
            ? { ...text, gradient: { ...text.gradient, [property]: value } }
            : text
        )
      );
    }, 100),
    [texts, selectedTextId]
  );

  const handleToggleGradient = () => {
    setTexts((prevTexts) =>
      prevTexts.map((text) =>
        text.id === selectedTextId
          ? { ...text, gradient: { ...text.gradient, enabled: !text.gradient.enabled } }
          : text
      )
    );
  };

  const handleUpdateGradientColor = (property, value) => {
    setTexts((prevTexts) =>
      prevTexts.map((text) =>
        text.id === selectedTextId
          ? { ...text, gradient: { ...text.gradient, [property]: value } }
          : text
      )
    );
  };

  const updateTextProperty = useCallback(
    debounce((property, value) => {
      updateTextPropertyWithHistory(property, value);
    }, 100),
    [updateTextPropertyWithHistory]
  );

  const updateTextShadowProperty = useCallback(
    debounce((property, value) => {
      setTexts(
        texts.map((text) =>
          text.id === selectedTextId
            ? { ...text, textShadow: { ...text.textShadow, [property]: value } }
            : text
        )
      );
    }, 100),
    [texts, selectedTextId]
  );

  const handleColorChange = (color) => {
    const { r, g, b, a } = color.rgb;
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    updateTextProperty("color", rgbaColor);
  };

  const previewFont = useCallback(
    (fontFamily) => {
      setTexts((prevTexts) =>
        prevTexts.map((text) =>
          text.id === selectedTextId ? { ...text, fontFamily } : text
        )
      );
    },
    [selectedTextId]
  );

  const handleDownload = async () => {
    if (!previewRef.current || !imgRef.current) return;

    setDownloading(true);
    try {
      const previewBox = previewRef.current;
      const offscreenCanvas = document.createElement("canvas");
      const ctx = offscreenCanvas.getContext("2d");

      offscreenCanvas.width = originalDimensions.width;
      offscreenCanvas.height = originalDimensions.height;

      const scaleX = originalDimensions.width / previewDimensions.width;
      const scaleY = originalDimensions.height / previewDimensions.height;

      if (image) {
        const bgImage = new Image();
        bgImage.crossOrigin = "Anonymous";
        bgImage.src = image;

        await new Promise((resolve) => {
          bgImage.onload = resolve;
        });

        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) blur(${(100 - sharpness) / 50}px)`;
        ctx.drawImage(bgImage, 0, 0, originalDimensions.width, originalDimensions.height);
      }

      texts.forEach((text) => {
        const textX = (text.position.x / 100) * originalDimensions.width;
        const textY = (text.position.y / 100) * originalDimensions.height;

        const scaleFactor = Math.max(scaleX, scaleY);
        const scaledFontSize = text.size * scaleFactor;

        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate((text.rotation * Math.PI) / 180);

        const fontStyle = [
          text.isItalic ? "italic" : "",
          text.isBold ? "bold" : "",
          `${scaledFontSize}px`,
          text.fontFamily,
        ]
          .filter(Boolean)
          .join(" ");

        ctx.font = fontStyle;

        if (text.gradient.enabled) {
          const gradient = ctx.createLinearGradient(0, -scaledFontSize / 2, 0, scaledFontSize / 2);
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
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
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

        await new Promise((resolve) => {
          fgImage.onload = resolve;
        });

        ctx.filter = "none";
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(fgImage, 0, 0, originalDimensions.width, originalDimensions.height);
      }

      const dataUrl = offscreenCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "edited-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download the image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const getTextShadowCSS = useCallback((textShadow) => {
    if (!textShadow.enabled) return "none";
    return `${textShadow.offsetX}px ${textShadow.offsetY}px ${textShadow.blur}px ${textShadow.color}`;
  }, []);

  const getTransform = useCallback((text) => {
    switch (text.textAlign) {
      case "left":
        return `translate(0, -50%) rotate(${text.rotation}deg)`;
      case "center":
        return `translate(-50%, -50%) rotate(${text.rotation}deg)`;
      case "right":
        return `translate(-100%, -50%) rotate(${text.rotation}deg)`;
      default:
        return `translate(-50%, -50%) rotate(${text.rotation}deg)`;
    }
  }, []);

  const renderInitialUploadUI = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-indigo-200/50 overflow-hidden"
      onClick={triggerFileInput}
    >
      <UploadCloud className="w-16 h-16 text-indigo-500 mb-4 animate-bounce" />
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
      >
        Upload Image
      </motion.button>
      <p className="text-gray-500 text-sm mt-4">Supports JPG, PNG, GIF</p>
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
          key={`control-panel-${selectedTextId}`}
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
          handleDuplicateText={handleDuplicateText}
          handleDeleteText={handleDeleteText}
          undo={undo}
          redo={redo}
          historyIndex={historyIndex}
          history={history}
          brightness={brightness}
          setBrightness={setBrightness}
          contrast={contrast}
          setContrast={setContrast}
          sharpness={sharpness}
          setSharpness={setSharpness}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          previewFont={previewFont}
        />
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
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        {!image && !loading && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600 my-4 text-center"
          >
            Text Behind Image
          </motion.h1>
        )}
        <div className="w-full flex-1 flex items-center justify-center">
          {!image && !loading && renderInitialUploadUI()}
          {loading && renderProcessingUI()}
          {image && !loading && renderEditorUI()}
        </div>
        <button
          onClick={() => setShowOnboarding(true)}
          className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50"
          aria-label="Show help"
        >
          <HelpCircle className="h-6 w-6" />
        </button>
      </section>
    </div>
  );
};

export default EditorSection;