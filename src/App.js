import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [urlList, setUrlList] = useState({});
  const [selectedExportUrls, setSelectedExportUrls] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [qrZoomUrl, setQrZoomUrl] = useState('');
  const [newUrl, setNewUrl] = useState('https://');
  const [newCategory, setNewCategory] = useState('');

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
    if (!newUrl || !newCategory) return;

    let processedUrl = newUrl.trim().startsWith('https://') ? newUrl.trim() : 'https://' + newUrl.trim();

    setUrlList(prev => {
      const updated = { ...prev };
      if (!updated[newCategory]) {
        updated[newCategory] = [];
      }
      updated[newCategory].push(processedUrl);
      return updated;
    });

    if (!categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
    }

    setNewUrl('https://');
    setNewCategory('');
  };

  const handleUrlAction = (url) => {
    const action = window.prompt("Type 'delete' to remove this URL or 'share' to copy it:");
    if (action === 'delete') {
      const updatedUrlList = { ...urlList };
      for (const cat in updatedUrlList) {
        updatedUrlList[cat] = updatedUrlList[cat].filter(u => u !== url);
      }
      setUrlList(updatedUrlList);
    } else if (action === 'share') {
      navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    }
  };

  return (
    <div className="app-container playpen-sans-thai compact-layout">
      <h1 className="header-title">ข่าวดี Thai: Good News</h1>

      <div>
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
        <button onClick={handleAddUrl}>Add URL</button>
      </div>

      <h2>My URLs</h2>
      {categories.map((cat, index) => (
        <div key={index} className="category-section">
          <h3>{cat}</h3>
          <ul>
            {urlList[cat]?.map((u, idx) => (
              <li key={idx} className="url-item">
                <div>
                  <a href={u} target="_blank" rel="noopener noreferrer" className="black-link">{u}</a>
                  <br />
                  <QRCodeCanvas 
                    value={u} 
                    size={48} 
                    className="qr-code-small"
                    onClick={() => handleUrlAction(u)} 
                  />
                </div>
              </li>
            ))}
          </ul>
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
