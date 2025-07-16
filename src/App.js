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
    <div className="app-container" lang="auto">
      <h1 lang="auto">ข่าวดี Thai: Good News</h1>

      <div className="input-section" lang="auto">
        <input
          type="text"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          placeholder="Enter URL"
          className="input-large"
        />
        <button onClick={addUrl}>Add URL</button>
      </div>

      <div className="search-section" lang="auto">
        <input
          type="text"
          placeholder="Search URLs"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="input-large"
        />
      </div>

      <h2 lang="auto">My URLs</h2>
      {filteredUrls.map((url, idx) => (
        <div key={idx} className="url-item" lang="auto">
          <input type="checkbox" className="url-checkbox" />
          <QRCodeCanvas
            value={url}
            size={48}
            className="qr-code-small"
            onClick={() => setQrZoomUrl(url)}
          />
          <a href={url} target="_blank" rel="noopener noreferrer" className="black-link small-font">
            {url}
          </a>
        </div>
      ))}

      {qrZoomUrl && (
        <div className="qr-modal" onClick={() => setQrZoomUrl('')} lang="auto">
          <QRCodeCanvas value={qrZoomUrl} size={256} />
          <p>Click anywhere to close</p>
        </div>
      )}
    </div>
  );
}

export default App;
