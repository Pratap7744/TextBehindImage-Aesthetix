import React, { useState } from "react";
import { SketchPicker } from "react-color";
import {
  Move,
  Upload,
  Loader2,
  Type,
  Image as ImageIcon,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Copy,
  Trash2,
  Undo,
  Redo,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ControlPanel = ({
  image,
  loading,
  texts,
  setTexts,
  selectedTextId,
  setSelectedTextId,
  selectedText,
  fontFamilies,
  showColorPicker,
  setShowColorPicker,
  activeTab,
  setActiveTab,
  showControls,
  setShowControls,
  handleImageUpload,
  updateTextProperty,
  updateTextShadowProperty,
  updateTextGradientProperty,
  handleToggleGradient,
  handleUpdateGradientColor,
  handleColorChange,
  handleDuplicateText,
  handleDeleteText,
  undo,
  redo,
  historyIndex,
  history,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  sharpness,
  setSharpness,
  aspectRatio,
  setAspectRatio,
  previewFont, // New prop for font preview
}) => {
  const aspectRatios = [
    { value: "1:1", label: "1:1" },
    { value: "4:3", label: "4:3" },
    { value: "16:9", label: "16:9" },
    { value: "3:2", label: "3:2" },
  ];

  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleFontDropdown = () => {
    setIsFontDropdownOpen(!isFontDropdownOpen);
  };

  // Handle font selection (permanently updates the text)
  const handleFontSelect = (fontFamily) => {
    updateTextProperty("fontFamily", fontFamily);
    setIsFontDropdownOpen(false);
  };

  // Handle font preview on hover (temporary update)
  const handleFontPreview = (fontFamily) => {
    previewFont(fontFamily);
  };

  // Revert to the selected font when leaving the dropdown
  const handleFontPreviewEnd = () => {
    previewFont(selectedText.fontFamily);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto rounded-2xl bg-white p-6 shadow-lg overflow-y-auto max-h-[calc(100vh-150px)] border border-gray-200"
    >
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-full py-3 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-200 transition-all duration-300 shadow-sm"
          aria-expanded={showControls}
          aria-controls="control-panel"
        >
          {showControls ? "Hide Controls" : "Show Controls"}
          <motion.span
            animate={{ rotate: showControls ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </button>
      </div>

      <div
        id="control-panel"
        className={`space-y-6 ${showControls ? "block" : "hidden"} lg:block`}
      >
        <div>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={loading}
            />
            <label
              htmlFor="image-upload"
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-center cursor-pointer transition-all duration-300 shadow-md ${
                loading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white hover:shadow-lg"
              }`}
              aria-label="Upload image"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
              {loading ? "Processing..." : "Upload Image"}
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undo}
            disabled={historyIndex <= 0}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm transition-all duration-300 text-gray-700"
            aria-label="Undo last action"
          >
            <Undo className="h-5 w-5" />
            Undo
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm transition-all duration-300 text-gray-700"
            aria-label="Redo last action"
          >
            <Redo className="h-5 w-5" />
            Redo
          </motion.button>
        </div>

        <div className="flex justify-around mb-4 border-b border-gray-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("Text")}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl transition-all duration-300 ${
              activeTab === "Text"
                ? "bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            aria-label="Text settings"
          >
            <Type className="h-5 w-5" /> Text
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("Image")}
            disabled={!image}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl transition-all duration-300 ${
              activeTab === "Image"
                ? "bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500"
                : !image
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            aria-label="Image settings"
          >
            <ImageIcon className="h-5 w-5" /> Image
          </motion.button>
          
        </div>

        <AnimatePresence>
          {activeTab === "Text" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <details open className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2 text-lg">
                  <Type className="h-5 w-5 text-indigo-500" /> Text Content
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="text-content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <input
                      id="text-content"
                      type="text"
                      value={selectedText.content}
                      onChange={(e) => updateTextProperty("content", e.target.value)}
                      className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800 placeholder-gray-400 transition-all duration-300"
                      disabled={texts.length === 0}
                      aria-label="Text content"
                      placeholder="Enter your text here"
                    />
                  </div>
                  <div className="flex gap-2">
                  <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateTextProperty("textAlign", "right")}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        selectedText.textAlign === "right"
                          ? "bg-indigo-100 text-indigo-700 shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      aria-label="Align text right"
                      disabled={texts.length === 0}
                    >
                   
                      <AlignLeft className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateTextProperty("textAlign", "center")}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        selectedText.textAlign === "center"
                          ? "bg-indigo-100 text-indigo-700 shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      aria-label="Align text center"
                      disabled={texts.length === 0}
                    >
                      <AlignCenter className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateTextProperty("textAlign", "left")}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        selectedText.textAlign === "left"
                          ? "bg-indigo-100 text-indigo-700 shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      aria-label="Align text left"
                      disabled={texts.length === 0}
                    >
                      <AlignRight className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateTextProperty("isBold", !selectedText.isBold)}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        selectedText.isBold
                          ? "bg-indigo-100 text-indigo-700 shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      aria-label={selectedText.isBold ? "Remove bold" : "Make bold"}
                      disabled={texts.length === 0}
                    >
                      <Bold className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateTextProperty("isItalic", !selectedText.isItalic)}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        selectedText.isItalic
                          ? "bg-indigo-100 text-indigo-700 shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      aria-label={selectedText.isItalic ? "Remove italic" : "Make italic"}
                      disabled={texts.length === 0}
                    >
                      <Italic className="h-5 w-5" />
                    </motion.button>
                    
                  </div>
                </div>
              </details>

              <details className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2 text-lg">
                  <Type className="h-5 w-5 text-indigo-500" /> Font Settings
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="font-family" className="block text-sm font-medium text-gray-700">
                      Font Family
                    </label>
                    <div className="relative">
                      <button
                        onClick={toggleFontDropdown}
                        className="w-full p-3 bg-white rounded-lg border border-gray-300 text-gray-800 flex justify-between items-center focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={texts.length === 0}
                        aria-label="Select font family"
                        aria-expanded={isFontDropdownOpen}
                      >
                        <span style={{ fontFamily: selectedText.fontFamily }}>
                          {fontFamilies.find((f) => f.value === selectedText.fontFamily)?.label || "Select a font"}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-300 ${isFontDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {isFontDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            onMouseLeave={handleFontPreviewEnd}
                          >
                            {fontFamilies.map((font) => (
                              <div
                                key={font.value}
                                onClick={() => handleFontSelect(font.value)}
                                onMouseEnter={() => handleFontPreview(font.value)}
                                className={`p-2 cursor-pointer hover:bg-indigo-100 transition-all duration-200 ${
                                  selectedText.fontFamily === font.value ? "bg-indigo-50 text-indigo-700" : "text-gray-800"
                                }`}
                                style={{ fontFamily: font.value }}
                              >
                                {font.label}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="font-size" className="block text-sm font-medium text-gray-700">
                      Font Size: {selectedText.size}px
                    </label>
                    <input
                      id="font-size"
                      type="range"
                      min="10"
                      max="400"
                      value={selectedText.size}
                      onChange={(e) => updateTextProperty("size", parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                      disabled={texts.length === 0}
                      aria-label="Font size"
                      aria-valuenow={selectedText.size}
                      aria-valuemin="10"
                      aria-valuemax="200"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>10px</span>
                      <span>400px</span>
                    </div>
                  </div>
                </div>
              </details>

              <details className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2 text-lg">
                  <Move className="h-5 w-5 text-indigo-500" /> Position & Rotation
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="position-x" className="block text-sm font-medium text-gray-700">
                      Position X: {selectedText.position.x}%
                    </label>
                    <input
                      id="position-x"
                      type="range"
                      min="0"
                      max="100"
                      value={selectedText.position.x}
                      onChange={(e) =>
                        updateTextProperty("position", {
                          x: parseInt(e.target.value),
                          y: selectedText.position.y,
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                      disabled={texts.length === 0}
                      aria-label="Position X"
                      aria-valuenow={selectedText.position.x}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Left</span>
                      <span>Right</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="position-y" className="block text-sm font-medium text-gray-700">
                      Position Y: {selectedText.position.y}%
                    </label>
                    <input
                      id="position-y"
                      type="range"
                      min="0"
                      max="100"
                      value={selectedText.position.y}
                      onChange={(e) =>
                        updateTextProperty("position", {
                          x: selectedText.position.x,
                          y: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                      disabled={texts.length === 0}
                      aria-label="Position Y"
                      aria-valuenow={selectedText.position.y}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Top</span>
                      <span>Bottom</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="rotation" className="block text-sm font-medium text-gray-700">
                      Rotation: {selectedText.rotation}°
                    </label>
                    <input
                      id="rotation"
                      type="range"
                      min="-180"
                      max="180"
                      value={selectedText.rotation}
                      onChange={(e) =>
                        updateTextProperty("rotation", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                      disabled={texts.length === 0}
                      aria-label="Rotation"
                      aria-valuenow={selectedText.rotation}
                      aria-valuemin="-180"
                      aria-valuemax="180"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>-180°</span>
                      <span>0°</span>
                      <span>180°</span>
                    </div>
                  </div>
                </div>
              </details>

              <details className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-indigo-500" /> Appearance
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="text-color" className="block text-sm font-medium text-gray-700">
                      Color
                    </label>
                    <div className="relative">
                      <AnimatePresence>
                        {showColorPicker && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute bottom-12 left-0 z-10"
                          >
                            <SketchPicker
                              color={selectedText.color}
                              onChange={handleColorChange}
                              presetColors={[
                                "#000000",
                                "#FFFFFF",
                                "#FF6900",
                                "#FCB900",
                                "#7BDCB5",
                                "#00D084",
                                "#8ED1FC",
                                "#0693E3",
                                "#ABB8C3",
                                "#EB144C",
                                "#F78DA7",
                                "#9900EF",
                              ]}
                              width="200px"
                              disableAlpha={false}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div
                        id="text-color"
                        className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-indigo-300"
                        style={{ backgroundColor: selectedText.color }}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        disabled={texts.length === 0}
                        aria-label="Select text color"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="opacity" className="block text-sm font-medium text-gray-700">
                      Opacity: {Math.round(selectedText.opacity * 100)}%
                    </label>
                    <input
                      id="opacity"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedText.opacity}
                      onChange={(e) =>
                        updateTextProperty("opacity", parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                      disabled={texts.length === 0}
                      aria-label="Text opacity"
                      aria-valuenow={Math.round(selectedText.opacity * 100)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="toggle-gradient" className="text-sm font-medium text-gray-700">
                        Enable Gradient
                      </label>
                      <div className="relative inline-block w-12 align-middle">
                        <input
                          type="checkbox"
                          id="toggle-gradient"
                          checked={selectedText.gradient.enabled}
                          onChange={handleToggleGradient}
                          className="sr-only"
                          disabled={texts.length === 0}
                          aria-label="Toggle gradient"
                        />
                        <label
                          htmlFor="toggle-gradient"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                            selectedText.gradient.enabled ? "bg-indigo-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-300 shadow-sm ${
                              selectedText.gradient.enabled ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </label>
                      </div>
                    </div>
                    {selectedText.gradient.enabled && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label
                            htmlFor="gradient-color1"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Gradient Color 1
                          </label>
                          <input
                            id="gradient-color1"
                            type="color"
                            value={selectedText.gradient.color1}
                            onChange={(e) =>
                              handleUpdateGradientColor("color1", e.target.value)
                            }
                            className="w-full h-10 rounded-lg border border-gray-300 transition-all duration-300 hover:ring-2 hover:ring-indigo-300"
                            disabled={texts.length === 0}
                            aria-label="Gradient color 1"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="gradient-color2"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Gradient Color 2
                          </label>
                          <input
                            id="gradient-color2"
                            type="color"
                            value={selectedText.gradient.color2}
                            onChange={(e) =>
                              handleUpdateGradientColor("color2", e.target.value)
                            }
                            className="w-full h-10 rounded-lg border border-gray-300 transition-all duration-300 hover:ring-2 hover:ring-indigo-300"
                            disabled={texts.length === 0}
                            aria-label="Gradient color 2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </details>


              <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <label htmlFor="select-text" className="block text-sm font-medium text-gray-700">
                  Select Text
                </label>
                <select
                  id="select-text"
                  value={selectedTextId}
                  onChange={(e) => setSelectedTextId(parseInt(e.target.value))}
                  className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800 transition-all duration-300"
                  disabled={texts.length === 0}
                  aria-label="Select text element"
                >
                  {texts.length === 0 ? (
                    <option value={1} disabled>
                      No text available
                    </option>
                  ) : (
                    texts.map((text) => (
                      <option key={text.id} value={text.id}>
                        Text {text.id}: {text.content.slice(0, 20)}
                        {text.content.length > 20 ? "..." : ""}
                      </option>
                    ))
                  )}
                </select>
                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDuplicateText}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={texts.length === 0 && !selectedText}
                    aria-label="Add new text"
                  >
                    <Copy className="h-5 w-5" /> Add Text
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteText}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={texts.length === 0}
                    aria-label="Delete selected text"
                  >
                    <Trash2 className="h-5 w-5" /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Image" && image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <details open className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5 text-indigo-500" /> Image Adjustments
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="brightness" className="block text-sm font-medium text-gray-700">
                      Brightness: {brightness}%
                    </label>
                    <input
                      id="brightness"
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                      aria-label="Brightness"
                      aria-valuenow={brightness}
                      aria-valuemin="0"
                      aria-valuemax="200"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                    <span>-100%</span>
                      <span>0%</span>
                      <span>-100%</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contrast" className="block text-sm font-medium text-gray-700">
                      Contrast: {contrast}%
                    </label>
                    <input
                      id="contrast"
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                      aria-label="Contrast"
                      aria-valuenow={contrast}
                      aria-valuemin="0"
                      aria-valuemax="200"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                    <span>-100%</span>
                      <span>0%</span>
                      <span>-100%</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sharpness" className="block text-sm font-medium text-gray-700">
                      Sharpness: {sharpness}%
                    </label>
                    <input
                      id="sharpness"
                      type="range"
                      min="0"
                      max="200"
                      value={sharpness}
                      onChange={(e) => setSharpness(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
                      aria-label="Sharpness"
                      aria-valuenow={sharpness}
                      aria-valuemin="0"
                      aria-valuemax="200"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>-100%</span>
                      <span>0%</span>
                      <span>-100%</span>
                    </div>
                  </div>
                </div>
              </details>
            </motion.div>
          )}

         
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ControlPanel;