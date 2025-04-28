import React from "react";

export default function PreviewModal({ url, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        {url.endsWith(".pdf") ? (
          <iframe src={url} width="100%" height="600px" title="Preview PDF"></iframe>
        ) : (
          <img src={url} alt="Preview" style={{ maxWidth: "100%", maxHeight: "80vh" }} />
        )}
      </div>
    </div>
  );
}
