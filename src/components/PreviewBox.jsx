import React, { useEffect, memo } from "react";
import { Loader2, Upload, Download } from "lucide-react";

const PreviewBox = memo(({
  image, foreground, loading, error, originalDimensions, previewDimensions,
  brightness, contrast, sharpness, texts, selectedTextId, getTransform, getTextShadowCSS,
  imgRef, previewRef, containerRef, handleDownload, downloading, setError, aspectRatio, setPreviewDimensions
}) => {
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (imgRef.current && containerRef.current) {
        const width = imgRef.current.clientWidth;
        const height = imgRef.current.clientHeight;
        containerRef.current.style.width = `${width}px`;
        containerRef.current.style.height = `${height}px`;
        setPreviewDimensions({ width, height });
      }
    });
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [image, imgRef, containerRef, setPreviewDimensions]);

  return (
    <div className="w-full mx-auto flex justify-center">
      {error ? (
        <div className="flex flex-col items-center justify-center text-red-600 rounded-xl overflow-hidden h-full">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="mt-2 text-indigo-600 underline">Try Again</button>
        </div>
      ) : loading ? (
        <div className="w-full h-full flex flex-col justify-center items-center gap-3 rounded-xl overflow-hidden relative">
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          <div className="absolute flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-gray-600 text-sm">Uploading image, please wait...</p>
          </div>
        </div>
      ) : !image ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 w-full rounded-xl overflow-hidden" style={{ height: "400px" }}>
          <Upload className="w-16 h-16 text-indigo-400 mb-4 animate-bounce" />
          <p className="text-gray-600">Upload an image to get started</p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-auto">
          <div ref={containerRef} className="relative flex justify-center items-center rounded-xl overflow-hidden">
            <div ref={previewRef} className="relative">
              <img
                ref={imgRef}
                src={image}
                alt="Background"
                className="object-contain"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) blur(${(100 - sharpness) / 50}px)`,
                  maxHeight: "80vh",
                  maxWidth: "100%",
                }}
              />
              {texts.map((text) => (
                <div
                  key={`${text.id}-${text.gradient.enabled}-${text.gradient.color1}-${text.gradient.color2}`}
                  className={`absolute cursor-move select-none ${text.id === selectedTextId ? "ring-2 ring-indigo-500" : ""}`}
                  style={{
                    left: `${text.position.x}%`,
                    top: `${text.position.y}%`,
                    transform: getTransform(text),
                    fontSize: `${text.size}px`,
                    fontFamily: text.fontFamily,
                    fontWeight: text.isBold ? "bold" : "normal",
                    fontStyle: text.isItalic ? "italic" : "normal",
                    textDecoration: text.isUnderlined ? "underline" : "none",
                    opacity: text.opacity,
                    textShadow: getTextShadowCSS(text.textShadow),
                    ...(text.gradient.enabled
                      ? {
                          background: `linear-gradient(180deg, ${text.gradient.color1}, ${text.gradient.color2})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          color: "transparent",
                        }
                      : { color: text.color }),
                  }}
                >
                  {text.content}
                </div>
              ))}
              {foreground && (
                <img
                  src={foreground}
                  alt="Subject"
                  className="absolute object-contain top-0 left-0 w-full h-full"
                  style={{ zIndex: 10 }}
                />
              )}
            </div>
          </div>
          <button
            onClick={handleDownload}
            disabled={!image || loading || downloading}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg ${!image || loading || downloading ? "bg-gray-300 text-gray-500" : "bg-gradient-to-r from-indigo-600 to-purple-500 text-white hover:from-indigo-700 hover:to-purple-600"}`}
          >
            {downloading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download Edited Image
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
});

export default PreviewBox;