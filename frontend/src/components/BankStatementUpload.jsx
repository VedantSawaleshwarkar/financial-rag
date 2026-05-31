import { useState } from "react";

const shellStyles = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(16,185,129,0.12), transparent 28%), radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 24%), #020817",
  color: "#e2e8f0",
  fontFamily: "'IBM Plex Mono','Courier New',monospace",
  padding: "28px",
};

function BankStatementUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
      setSuccess("");
    } else {
      setError("Please select a valid PDF file.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      setSuccess(
        `Bank statement uploaded successfully! Added ${data.chunks_added} chunks to the knowledge base. You can now ask questions about your financial data.`
      );
      setFile(null);
    } catch (err) {
      setError(err.message || "Failed to upload bank statement. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={shellStyles}>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px",
          borderRadius: "28px",
          border: "1px solid rgba(148,163,184,0.12)",
          background: "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(5,10,21,0.95))",
          boxShadow: "0 24px 60px rgba(2,6,23,0.42)",
        }}
      >
        <div style={{ color: "#10b981", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "14px" }}>
          Bank Statement Analysis
        </div>
        <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.05 }}>
          Upload Your Bank Statement
        </h1>
        <p style={{ margin: "0 0 32px", color: "#94a3b8", fontSize: "14px", lineHeight: 1.75 }}>
          Upload your PDF bank statement to get personalized financial assistance and recommendations based on your transaction history and spending patterns.
        </p>

        <div
          style={{
            padding: "32px",
            borderRadius: "20px",
            border: "2px dashed rgba(148,163,184,0.24)",
            background: "rgba(2,6,23,0.42)",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={uploading}
            style={{
              display: "none",
            }}
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            style={{
              display: "block",
              padding: "24px",
              cursor: uploading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
            <div style={{ fontSize: "14px", color: "#cbd5e1", marginBottom: "8px" }}>
              {file ? file.name : "Click to select PDF file"}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Only PDF files are supported
            </div>
          </label>
        </div>

        {error && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "14px",
              border: "1px solid rgba(248,113,113,0.24)",
              background: "rgba(127,29,29,0.18)",
              color: "#fca5a5",
              fontSize: "13px",
              lineHeight: 1.6,
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "14px",
              border: "1px solid rgba(16,185,129,0.24)",
              background: "rgba(6,78,59,0.18)",
              color: "#6ee7b7",
              fontSize: "13px",
              lineHeight: 1.6,
              marginBottom: "20px",
            }}
          >
            {success}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{
            width: "100%",
            padding: "16px 20px",
            borderRadius: "14px",
            border: "1px solid rgba(16,185,129,0.35)",
            background: !file || uploading ? "rgba(15,23,42,0.72)" : "linear-gradient(135deg, #10b981, #1d4ed8)",
            color: "#fff",
            fontFamily: "inherit",
            fontSize: "13px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
            cursor: !file || uploading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {uploading ? "Processing..." : "Upload & Analyze"}
        </button>

        <div style={{ marginTop: "24px", padding: "20px", borderRadius: "14px", background: "rgba(2,6,23,0.42)", border: "1px solid rgba(148,163,184,0.08)" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            How it works
          </div>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#cbd5e1", fontSize: "13px", lineHeight: 1.8 }}>
            <li>Upload your PDF bank statement</li>
            <li>AI extracts and analyzes your financial data</li>
            <li>Information is added to the knowledge base</li>
            <li>Ask questions about your finances in the Advisor</li>
            <li>Get personalized recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BankStatementUpload;
