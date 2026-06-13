import { useState, useRef } from "react";
import { useRecipe } from "../context/RecipeContext";

function ImageUploader() {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { analyzeImage, loading } = useRecipe();

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("⚠️ Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    analyzeImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);
  const handleInputChange = (e) => handleFile(e.target.files[0]);
  const handleClick = () => fileInputRef.current?.click();

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="image-uploader">
      <h2>📸 Upload Food Photo</h2>
      <p className="uploader-subtitle">
        Take a photo of ingredients in your fridge or a dish you want to recreate
      </p>

      <div
        className={`drop-zone ${dragActive ? "drag-active" : ""} ${preview ? "has-preview" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {preview ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={preview} alt="Uploaded food" className="preview-image" />
            {!loading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(255, 82, 82, 0.9)",
                  border: "none",
                  color: "#fff",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 82, 82, 1)";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 82, 82, 0.9)";
                  e.target.style.transform = "scale(1)";
                }}
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <div className="drop-zone-content">
            <span className="upload-icon">🖼️</span>
            <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>Drag & drop your food photo here</p>
            <p className="or-text">or click to browse</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="file-input"
          aria-label="Upload image"
        />
      </div>

      {loading && (
        <div className="analyzing-indicator">
          <div className="spinner"></div>
          <p>🤖 AI is analyzing your image...</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;