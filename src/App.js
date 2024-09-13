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
          await new Promise((resolve) => setTimeout(resolve, 15000));
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
                <p key={index} className="process-stage">
                  {stage}{" "}
                  {index === processStages.length - 1 && (
                    <span className="loading-dots"></span>
                  )}
                </p>
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
