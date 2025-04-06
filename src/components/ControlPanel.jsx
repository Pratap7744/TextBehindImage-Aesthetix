import React, { useState, useCallback, memo } from "react";
import { SketchPicker } from "react-color";
import { Move, Upload, Loader2, Type, ImageIcon, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Copy, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ControlPanel = memo(({
  image, loading, texts, setTexts, selectedTextId, setSelectedTextId, selectedText,
  fontFamilies, showColorPicker, setShowColorPicker, activeTab, setActiveTab,
  showControls, setShowControls, handleImageUpload, updateTextProperty,
  updateTextShadowProperty, updateTextGradientProperty, handleToggleGradient,
  handleUpdateGradientColor, handleColorChange, brightness, setBrightness,
  contrast, setContrast, sharpness, setSharpness, aspectRatio, setAspectRatio
}) => {
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);

  const toggleFontDropdown = useCallback(() => setIsFontDropdownOpen((prev) => !prev), []);

  const handleFontSelect = useCallback((fontFamily) => {
    updateTextProperty("fontFamily", fontFamily);
    setIsFontDropdownOpen(false);
  }, [updateTextProperty]);

  const handleDuplicateText = useCallback(() => {
    const newText = { ...selectedText, id: Math.max(...texts.map(t => t.id)) + 1, content: selectedText.content + " (Copy)" };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
  }, [selectedText, texts, setTexts, setSelectedTextId]);

  const handleDeleteText = useCallback(() => {
    if (texts.length === 0) return;
    const updatedTexts = texts.filter(t => t.id !== selectedTextId);
    setTexts(updatedTexts);
    setSelectedTextId(updatedTexts.length > 0 ? updatedTexts[0].id : 1);
  }, [texts, selectedTextId, setTexts, setSelectedTextId]);

  return (
    <motion.div className="w-full mx-auto rounded-2xl bg-white p-6 shadow-lg overflow-y-auto max-h-[calc(100vh-150px)] border border-gray-200">
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-full py-3 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-200"
        >
          {showControls ? "Hide Controls" : "Show Controls"}
          <motion.span animate={{ rotate: showControls ? 180 : 0 }}>▼</motion.span>
        </button>
      </div>

      <div className={`space-y-6 ${showControls ? "block" : "hidden"} lg:block`}>
        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={loading} />
          <label
            htmlFor="image-upload"
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl cursor-pointer ${loading ? "bg-gray-200 text-gray-400" : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600"}`}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            {loading ? "Processing..." : "Upload Image"}
          </label>
        </div>

        <div className="flex justify-around mb-4 border-b border-gray-200">
          <motion.button
            onClick={() => setActiveTab("Text")}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl ${activeTab === "Text" ? "bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            <Type className="h-5 w-5" /> Text
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("Image")}
            disabled={!image}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl ${activeTab === "Image" ? "bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500" : !image ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            <ImageIcon className="h-5 w-5" /> Image
          </motion.button>
        </div>

        <AnimatePresence>
          {activeTab === "Text" && (
            <motion.div className="space-y-6">
              <details open className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2 text-lg">
                  <Type className="h-5 w-5 text-indigo-500" /> Text Content
                </summary>
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    value={selectedText.content}
                    onChange={(e) => updateTextProperty("content", e.target.value)}
                    className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:border-indigo-500"
                    disabled={texts.length === 0}
                  />
                  <div className="flex gap-2">
                    <motion.button onClick={() => updateTextProperty("textAlign", "left")} className={`p-3 rounded-lg ${selectedText.textAlign === "left" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      <AlignLeft className="h-5 w-5" />
                    </motion.button>
                    <motion.button onClick={() => updateTextProperty("textAlign", "center")} className={`p-3 rounded-lg ${selectedText.textAlign === "center" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      <AlignCenter className="h-5 w-5" />
                    </motion.button>
                    <motion.button onClick={() => updateTextProperty("textAlign", "right")} className={`p-3 rounded-lg ${selectedText.textAlign === "right" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      <AlignRight className="h-5 w-5" />
                    </motion.button>
                    <motion.button onClick={() => updateTextProperty("isBold", !selectedText.isBold)} className={`p-3 rounded-lg ${selectedText.isBold ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      <Bold className="h-5 w-5" />
                    </motion.button>
                    <motion.button onClick={() => updateTextProperty("isItalic", !selectedText.isItalic)} className={`p-3 rounded-lg ${selectedText.isItalic ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      <Italic className="h-5 w-5" />
                    </motion.button>
                    <motion.button onClick={() => updateTextProperty("isUnderlined", !selectedText.isUnderlined)} className={`p-3 rounded-lg ${selectedText.isUnderlined ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      <Underline className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </details>

              <details className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2 text-lg">
                  <Type className="h-5 w-5 text-indigo-500" /> Font Settings
                </summary>
                <div className="mt-4 space-y-4">
                  <div className="relative">
                    <button
                      onClick={toggleFontDropdown}
                      className="w-full p-3 bg-white rounded-lg border border-gray-300 text-gray-800 flex justify-between items-center"
                      disabled={texts.length === 0}
                    >
                      <span style={{ fontFamily: selectedText.fontFamily }}>
                        {fontFamilies.find((f) => f.value === selectedText.fontFamily)?.label || "Select a font"}
                      </span>
                      <ChevronDown className={`h-5 w-5 ${isFontDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isFontDropdownOpen && (
                      <motion.div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {fontFamilies.map((font) => (
                          <div
                            key={font.value}
                            onClick={() => handleFontSelect(font.value)}
                            className={`p-2 cursor-pointer hover:bg-indigo-100 ${selectedText.fontFamily === font.value ? "bg-indigo-50 text-indigo-700" : "text-gray-800"}`}
                            style={{ fontFamily: font.value }}
                          >
                            {font.label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Font Size: {selectedText.size}px</label>
                    <input
                      type="range"
                      min="10"
                      max="400"
                      value={selectedText.size}
                      onChange={(e) => updateTextProperty("size", parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                      disabled={texts.length === 0}
                    />
                  </div>
                </div>
              </details>

              <details className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2 text-lg">
                  <Move className="h-5 w-5 text-indigo-500" /> Position & Rotation
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position X: {selectedText.position.x}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedText.position.x}
                      onChange={(e) => updateTextProperty("position", { x: parseInt(e.target.value), y: selectedText.position.y })}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                      disabled={texts.length === 0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position Y: {selectedText.position.y}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedText.position.y}
                      onChange={(e) => updateTextProperty("position", { x: selectedText.position.x, y: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                      disabled={texts.length === 0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rotation: {selectedText.rotation}°</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={selectedText.rotation}
                      onChange={(e) => updateTextProperty("rotation", parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                      disabled={texts.length === 0}
                    />
                  </div>
                </div>
              </details>

              <details className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2 text-lg">
                  <Type className="h-5 w-5 text-indigo-500" /> Appearance
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <div className="relative">
                      {showColorPicker && (
                        <motion.div className="absolute bottom-12 left-0 z-10">
                          <SketchPicker
                            color={selectedText.color}
                            onChange={handleColorChange}
                            disableAlpha={false}
                          />
                        </motion.div>
                      )}
                      <div
                        className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                        style={{ backgroundColor: selectedText.color }}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        disabled={texts.length === 0}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Opacity: {Math.round(selectedText.opacity * 100)}%</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedText.opacity}
                      onChange={(e) => updateTextProperty("opacity", parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                      disabled={texts.length === 0}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Enable Gradient</label>
                      <input
                        type="checkbox"
                        checked={selectedText.gradient.enabled}
                        onChange={handleToggleGradient}
                        className="sr-only"
                        disabled={texts.length === 0}
                      />
                      <label
                        className={`block w-12 h-6 rounded-full cursor-pointer ${selectedText.gradient.enabled ? "bg-indigo-500" : "bg-gray-300"}`}
                        onClick={handleToggleGradient}
                      >
                        <span className={`block h-6 w-6 rounded-full bg-white transform ${selectedText.gradient.enabled ? "translate-x-6" : "translate-x-0"}`} />
                      </label>
                    </div>
                    {selectedText.gradient.enabled && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Gradient Color 1</label>
                          <input
                            type="color"
                            value={selectedText.gradient.color1}
                            onChange={(e) => handleUpdateGradientColor("color1", e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-300"
                            disabled={texts.length === 0}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Gradient Color 2</label>
                          <input
                            type="color"
                            value={selectedText.gradient.color2}
                            onChange={(e) => handleUpdateGradientColor("color2", e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-300"
                            disabled={texts.length === 0}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Enable Text Shadow</label>
                      <input
                        type="checkbox"
                        checked={selectedText.textShadow.enabled}
                        onChange={() => updateTextShadowProperty("enabled", !selectedText.textShadow.enabled)}
                        className="sr-only"
                        disabled={texts.length === 0}
                      />
                      <label
                        className={`block w-12 h-6 rounded-full cursor-pointer ${selectedText.textShadow.enabled ? "bg-indigo-500" : "bg-gray-300"}`}
                        onClick={() => updateTextShadowProperty("enabled", !selectedText.textShadow.enabled)}
                      >
                        <span className={`block h-6 w-6 rounded-full bg-white transform ${selectedText.textShadow.enabled ? "translate-x-6" : "translate-x-0"}`} />
                      </label>
                    </div>
                    {selectedText.textShadow.enabled && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Shadow Color</label>
                          <input
                            type="color"
                            value={selectedText.textShadow.color}
                            onChange={(e) => updateTextShadowProperty("color", e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-300"
                            disabled={texts.length === 0}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Blur: {selectedText.textShadow.blur}px</label>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={selectedText.textShadow.blur}
                            onChange={(e) => updateTextShadowProperty("blur", parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                            disabled={texts.length === 0}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Offset X: {selectedText.textShadow.offsetX}px</label>
                          <input
                            type="range"
                            min="-10"
                            max="10"
                            value={selectedText.textShadow.offsetX}
                            onChange={(e) => updateTextShadowProperty("offsetX", parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                            disabled={texts.length === 0}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Offset Y: {selectedText.textShadow.offsetY}px</label>
                          <input
                            type="range"
                            min="-10"
                            max="10"
                            value={selectedText.textShadow.offsetY}
                            onChange={(e) => updateTextShadowProperty("offsetY", parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                            disabled={texts.length === 0}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </details>

              <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <label className="block text-sm font-medium text-gray-700">Select Text</label>
                <select
                  value={selectedTextId}
                  onChange={(e) => setSelectedTextId(parseInt(e.target.value))}
                  className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:border-indigo-500"
                  disabled={texts.length === 0}
                >
                  {texts.map((text) => (
                    <option key={text.id} value={text.id}>
                      Text {text.id}: {text.content.slice(0, 20)}{text.content.length > 20 ? "..." : ""}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3 mt-4">
                  <motion.button
                    onClick={handleDuplicateText}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl"
                    disabled={texts.length === 0}
                  >
                    <Copy className="h-5 w-5" /> Add Text
                  </motion.button>
                  <motion.button
                    onClick={handleDeleteText}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl"
                    disabled={texts.length === 0}
                  >
                    <Trash2 className="h-5 w-5" /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "Image" && image && (
            <motion.div className="space-y-6">
              <details open className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5 text-indigo-500" /> Image Adjustments
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Brightness: {brightness}%</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contrast: {contrast}%</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sharpness: {sharpness}%</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={sharpness}
                      onChange={(e) => setSharpness(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              </details>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default ControlPanel;