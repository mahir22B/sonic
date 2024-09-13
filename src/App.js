import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Key } from "lucide-react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [claudeKey, setClaudeKey] = useState("");
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [apiKeysMissing, setApiKeysMissing] = useState(true);
  const [processStages, setProcessStages] = useState([]);

  const icons = {
    pdf: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    dialogue: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    speech: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
    ),
    finalizing: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    ),
  };

  useEffect(() => {
    setApiKeysMissing(!claudeKey || !elevenLabsKey);
  }, [claudeKey, elevenLabsKey]);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileDelete = () => {
    setFile(null);
  };

  const handleUrlSubmit = (event) => {
    event.preventDefault();
    if (apiKeysMissing) {
      alert("API keys are missing. Please set them in the API Keys section.");
      return;
    }
    processInput(null, url);
  };

  const handleFileSubmit = (event) => {
    event.preventDefault();
    if (apiKeysMissing) {
      alert("API keys are missing. Please set them in the API Keys section.");
      return;
    }
    processInput(file, null);
  };

  const processInput = async (file, url) => {
    setLoading(true);
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (url) formData.append("url", url);
    formData.append("claudeKey", claudeKey);
    formData.append("elevenLabsKey", elevenLabsKey);

    const stages = [
      "Extracting text from PDF",
      "Generating dialogue from text",
      "Creating speech from dialogue",
      "Finalizing podcast",
    ];

    try {
      for (let i = 0; i < stages.length; i++) {
        setProcessStages((prevStages) => [...prevStages, stages[i]]);
        if (i < stages.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 25000));
        }
      }

      const response = await axios.post(
        "https://stingray-app-2ni23.ondigitalocean.app/api/process",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "arraybuffer",
        }
      );

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      setAudioBlob(audioBlob);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      alert("An error occurred while processing your request.");
    }
    setLoading(false);
  };

  const resetState = () => {
    setFile(null);
    setUrl("");
    setAudioBlob(null);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const saveKeys = () => {
    if (!claudeKey || !elevenLabsKey) {
      alert("Both API keys are required.");
    } else {
      toggleModal();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sonic Boom</h1>
        <p className="subtitle">
          Understand research papers at the speed of sound
        </p>
        <button onClick={toggleModal} className="keys-button">
          <Key size={20} />
        </button>
      </header>
      <main className="app-main">
        {apiKeysMissing && (
          <div className="error-message">
            <b>
              API keys are missing. Please set them in the API Keys section.
            </b>
          </div>
        )}
        {loading ? (
          <div className="loading-overlay">
            <div className="loading-content">
              <h3>Processing your request...</h3>
              {processStages.map((stage, index) => (
                <div key={index} className="process-stage">
                  <div
                    className={`icon-wrapper ${
                      index === processStages.length - 1 ? "active" : ""
                    }`}
                  >
                    {icons[["pdf", "dialogue", "speech", "finalizing"][index]]}
                  </div>
                  <p>
                    {stage}
                    {index === processStages.length - 1 && (
                      <span className="loading-dots"></span>
                    )}
                  </p>
                </div>
              ))}
              <div className="loading-spinner"></div>
            </div>
          </div>
        ) : audioBlob ? (
          <section className="result-section">
            <h2>Generated Podcast</h2>
            <audio
              controls
              src={URL.createObjectURL(audioBlob)}
              className="audio-player"
            >
              Your browser does not support the audio element.
            </audio>
            <a
              href={URL.createObjectURL(audioBlob)}
              download="podcast.mp3"
              className="download-link"
            >
              Download Podcast
            </a>
            <button onClick={resetState} className="generate-another-button">
              Generate Another Paper
            </button>
          </section>
        ) : (
          <>
            <section className="upload-section">
              <h2>Upload PDF</h2>
              <form onSubmit={handleFileSubmit} className="form-group">
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileUpload}
                    accept=".pdf"
                    className="file-input"
                  />
                  <label htmlFor="file-upload" className="file-label">
                    Choose a file
                  </label>
                </div>
                {file && (
                  <div className="file-info">
                    <span>{file.name}</span>
                    <button onClick={handleFileDelete} className="delete-file">
                      <X size={16} />
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={!file || apiKeysMissing}
                  className="submit-button"
                >
                  Upload PDF
                </button>
              </form>
            </section>

            <section className="url-section">
              <h2>arXiv URL</h2>
              <form onSubmit={handleUrlSubmit} className="form-group">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter arXiv URL"
                  className="url-input"
                />
                <button
                  type="submit"
                  disabled={!url || apiKeysMissing}
                  className="submit-button"
                >
                  Process URL
                </button>
              </form>
            </section>
          </>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>API Keys</h2>
            <label htmlFor="claude-key">
              Claude API Key:{" "}
              <a
                target="__blank"
                href="https://www.youtube.com/watch?v=Vp4we-ged4w"
              >
                Get Claude Key
              </a>
            </label>
            <input
              type="password"
              id="claude-key"
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
            />
            <label htmlFor="elevenlabs-key">
              ElevenLabs API Key:{" "}
              <a
                target="__blank"
                href="https://www.youtube.com/watch?v=9zFBc-yH0hU"
              >
                Get ElevenLabs Key
              </a>
            </label>
            <input
              type="password"
              id="elevenlabs-key"
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={saveKeys}>Save</button>
              <button onClick={toggleModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
