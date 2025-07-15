import React, { useState } from 'react';
import { QRCode } from 'qrcode.react';

function App() {
  const [url, setUrl] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');

  const handleAddUrl = () => {
    if (url && !urlList.includes(url)) {
      setUrlList([...urlList, url]);
      setUrl('');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Thai: Good News - URL QR Manager</h1>

      <div>
        <input
          type="text"
          placeholder="Enter a URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ marginRight: '10px', width: '300px' }}
        />
        <button onClick={handleAddUrl}>Add URL</button>
      </div>

      <h2>Stored URLs</h2>
      <ul>
        {urlList.map((u, index) => (
          <li key={index}>
            <span
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => setSelectedUrl(u)}
            >
              {u}
            </span>
          </li>
        ))}
      </ul>

      {selectedUrl && (
        <div>
          <h2>QR Code for:</h2>
          <p>{selectedUrl}</p>
          <QRCode value={selectedUrl} />
        </div>
      )}
    </div>
  );
}

export default App;
