import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import './App.css';

function App() {
  const [urls, setUrls] = useState([]);
  const [inputUrl, setInputUrl] = useState('https://');
  const [selectedUrls, setSelectedUrls] = useState([]);

  const normalizeUrl = (url) => {
    let trimmed = url.trim().replaceAll(' ', '');
    if (!trimmed || trimmed === 'https://') return '';
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
    }
    return trimmed;
  };

  const addUrl = () => {
    const normalized = normalizeUrl(inputUrl);
    if (normalized && !urls.includes(normalized)) {
      setUrls([...urls, normalized]);
    }
    setInputUrl('https://');
  };

  const toggleSelectUrl = (url) => {
    setSelectedUrls(
      selectedUrls.includes(url)
        ? selectedUrls.filter(u => u !== url)
        : [...selectedUrls, url]
    );
  };

  const shareUrls = () => {
    if (selectedUrls.length === 0) return;
    const mailtoLink = `mailto:?body=${encodeURIComponent(selectedUrls.join('\n'))}`;
    window.location.href = mailtoLink;
  };

  const exportUrls = () => {
    if (selectedUrls.length === 0) return;
    const csvContent = 'data:text/csv;charset=utf-8,' + selectedUrls.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'urls.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteUrls = () => {
    if (selectedUrls.length === 0) return;
    if (window.confirm('Are you sure you want to delete the selected URLs?')) {
      setUrls(urls.filter(url => !selectedUrls.includes(url)));
      setSelectedUrls([]);
    }
  };

  return (
    <div className="App">
      <h1>ข่าวดี Thai: Good News</h1>
      <div>
        <input
          type="text"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
        />
        <button onClick={addUrl}>Add URL</button>
      </div>
      <div>
        <button onClick={shareUrls}>Share</button>
        <button onClick={exportUrls}>Export</button>
        <button onClick={deleteUrls}>Delete</button>
      </div>
      <ul>
        {urls.map((url, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={selectedUrls.includes(url)}
              onChange={() => toggleSelectUrl(url)}
            />
            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
            <QRCode value={url} size={64} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
