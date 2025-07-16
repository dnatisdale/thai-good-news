import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [urlList, setUrlList] = useState({});
  const [uploadHistory, setUploadHistory] = useState([]);
  const [qrZoomUrl, setQrZoomUrl] = useState('');
  const [newUrl, setNewUrl] = useState('https://');
  const [newCategory, setNewCategory] = useState('');
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('urlList');
    const storedCategories = localStorage.getItem('categories');
    const storedHistory = localStorage.getItem('uploadHistory');
    if (storedData) setUrlList(JSON.parse(storedData));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    if (storedHistory) setUploadHistory(JSON.parse(storedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('urlList', JSON.stringify(urlList));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('uploadHistory', JSON.stringify(uploadHistory));
  }, [urlList, categories, uploadHistory]);

  const handleAddUrl = () => {
    if (!newUrl || newUrl === 'https://' || !newCategory) return;
    let processedUrl = newUrl.trim().replace(/\s+/g, '').startsWith('https://') ? newUrl.trim().replace(/\s+/g, '') : 'https://' + newUrl.trim().replace(/\s+/g, '');

    setUrlList(prev => {
      const updated = { ...prev };
      if (!updated[newCategory]) updated[newCategory] = [];
      updated[newCategory].push(processedUrl);
      return updated;
    });

    if (!categories.includes(newCategory)) setCategories(prev => [...prev, newCategory]);

    setUploadHistory(prev => [...prev, { url: processedUrl, category: newCategory, timestamp: new Date().toISOString() }]);

    setNewUrl('https://');
    setNewCategory('');
  };

  const toggleUrlSelection = (url) => {
    setSelectedUrls(prev => {
      const updated = prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url];
      setActionMenuVisible(updated.length > 0);
      return updated;
    });
  };

  const handleShare = () => {
    const mailtoLink = `mailto:?subject=Shared URLs&body=${encodeURIComponent(selectedUrls.join('\n'))}`;
    window.location.href = mailtoLink;
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + selectedUrls.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exported_urls.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete the selected URLs?')) return;

    const updatedUrlList = { ...urlList };
    Object.keys(updatedUrlList).forEach(category => {
      updatedUrlList[category] = updatedUrlList[category].filter(u => !selectedUrls.includes(u));
    });
    setUrlList(updatedUrlList);
    setSelectedUrls([]);
    setActionMenuVisible(false);
  };

  return (
    <div className="app-container playpen-sans-thai vibrant-colors">
      <h1 className="header-title playpen-sans-thai">ข่าวดี Thai: Good News</h1>

      <div className="input-section">
        <input
          type="text"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          placeholder="Enter URL"
          className="input-large playpen-sans-thai"
        />
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="Enter Category"
          className="input-large playpen-sans-thai"
        />
        <button className="playpen-sans-thai" onClick={handleAddUrl}>Add URL</button>
      </div>

      <h2 className="playpen-sans-thai">My URLs</h2>
      {categories.map((cat, index) => (
        <div key={index} className="category-section">
          <h3 className="playpen-sans-thai">{cat}</h3>
          {urlList[cat]?.map((u, idx) => (
            <div key={idx} className="url-item">
              <input
                type="checkbox"
                className="url-checkbox"
                onChange={() => toggleUrlSelection(u)}
                checked={selectedUrls.includes(u)}
              />
              <a href={u} target="_blank" rel="noopener noreferrer" className="black-link playpen-sans-thai small-font">{u}</a>
              <QRCodeCanvas
                value={u}
                size={48}
                className="qr-code-small"
                onClick={() => setQrZoomUrl(u)}
              />
            </div>
          ))}
        </div>
      ))}

      {actionMenuVisible && (
        <div className="action-menu playpen-sans-thai">
          <p>What would you like to do with the selected URLs?</p>
          <button onClick={handleShare}>Share (Email)</button>
          <button onClick={handleExport}>Export (CSV)</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

      <h2 className="playpen-sans-thai">Upload History</h2>
      <ul>
        {uploadHistory.map((record, idx) => (
          <li key={idx} className="playpen-sans-thai">
            {record.url} (Category: {record.category}, Time: {new Date(record.timestamp).toLocaleString()})
          </li>
        ))}
      </ul>

      {qrZoomUrl && (
        <div className="qr-modal" onClick={() => setQrZoomUrl('')}>
          <QRCodeCanvas value={qrZoomUrl} size={256} />
          <p className="playpen-sans-thai" style={{ color: 'white' }}>Click anywhere to close</p>
        </div>
      )}
    </div>
  );
}

export default App;
