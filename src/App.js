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
  const [newUrl, setNewUrl] = useState('');
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

  const handleDeleteSelected = () => {
    const updatedUrlList = { ...urlList };

    categories.forEach(category => {
      if (updatedUrlList[category]) {
        updatedUrlList[category] = updatedUrlList[category].filter(url => !selectedExportUrls.includes(url));
        if (updatedUrlList[category].length === 0) {
          delete updatedUrlList[category];
        }
      }
    });

    selectedCategories.forEach(cat => {
      delete updatedUrlList[cat];
    });

    setUrlList(updatedUrlList);
    setCategories(Object.keys(updatedUrlList));
    setSelectedExportUrls([]);
    setSelectedCategories([]);
  };

  const toggleCategorySelection = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleAddUrl = () => {
    if (!newUrl || !newCategory) return;

    setUrlList(prev => {
      const updated = { ...prev };
      if (!updated[newCategory]) {
        updated[newCategory] = [];
      }
      updated[newCategory].push(newUrl);
      return updated;
    });

    if (!categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
    }

    setNewUrl('');
    setNewCategory('');
  };

  return (
    <div className="app-container playpen-sans-thai">
      <h1 className="header-title">ข่าวดี Thai: Good News</h1>

      <div>
        <input
          type="text"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="Enter Category"
        />
        <button onClick={handleAddUrl}>Add URL</button>
      </div>

      <button className="playpen-sans-thai" onClick={handleDeleteSelected}>Delete Selected</button>

      <h2>My URLs</h2>
      {categories.map((cat, index) => (
        <div key={index} className="category-section">
          <h3>
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleCategorySelection(cat)}
            />
            {cat}
          </h3>
          <ul>
            {urlList[cat]?.map((u, idx) => (
              <li key={idx} className="url-item">
                <input
                  type="checkbox"
                  checked={selectedExportUrls.includes(u)}
                  onChange={() => setSelectedExportUrls(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u])}
                />
                <a href={u} target="_blank" rel="noopener noreferrer">{u}</a>
                <QRCodeCanvas value={u} size={48} style={{ border: '1px solid white', cursor: 'pointer' }} onClick={() => setQrZoomUrl(u)} />
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
