import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';

function App() {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('https://');
  const [qrZoomUrl, setQrZoomUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const addUrl = () => {
    const trimmed = newUrl.trim().replace(/\s+/g, '');
    if (trimmed.length > 8 && !urls.includes(trimmed)) {
      setUrls([...urls, trimmed]);
      setNewUrl('https://');
    }
  };

  const filteredUrls = urls.filter(u => u.includes(searchTerm));

  return (
    <div className="app-container playpen-sans vibrant-bg">
      <h1>ข่าวดี Thai: Good News</h1>

      <div className="input-section">
        <input
          type="text"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          placeholder="Enter URL"
          className="input-large"
        />
        <button onClick={addUrl}>Add URL</button>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search URLs"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="input-large"
        />
      </div>

      <h2>My URLs</h2>
      {filteredUrls.map((url, idx) => (
        <div key={idx} className="url-item">
          <a href={url} target="_blank" rel="noopener noreferrer" className="black-link small-font">
            {url}
          </a>
          <QRCodeCanvas
            value={url}
            size={64}
            className="qr-code-small"
            onClick={() => setQrZoomUrl(url)}
          />
        </div>
      ))}

      {qrZoomUrl && (
        <div className="qr-modal" onClick={() => setQrZoomUrl('')}>
          <QRCodeCanvas value={qrZoomUrl} size={256} />
          <p>Click anywhere to close</p>
        </div>
      )}
    </div>
  );
}

export default App;
