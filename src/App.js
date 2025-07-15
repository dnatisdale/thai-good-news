import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';

function App() {
  const [url, setUrl] = useState('https://');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [urlList, setUrlList] = useState({});
  const [selectedUrl, setSelectedUrl] = useState('');
  const [selectedExportUrls, setSelectedExportUrls] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem('urlList');
    const storedCategories = localStorage.getItem('categories');
    if (storedData) setUrlList(JSON.parse(storedData));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
  }, []);

  useEffect(() => {
    localStorage.setItem('urlList', JSON.stringify(urlList));
  }, [urlList]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddUrl = () => {
    if (url) {
      const effectiveCategory = category || 'Uncategorized';
      setUrlList(prevList => {
        const categoryUrls = prevList[effectiveCategory] || [];
        if (!categoryUrls.includes(url)) {
          return {
            ...prevList,
            [effectiveCategory]: [...categoryUrls, url]
          };
        }
        return prevList;
      });
      if (category && !categories.includes(category)) {
        setCategories(prev => [...prev, category]);
      } else if (!category && !categories.includes('Uncategorized')) {
        setCategories(prev => [...prev, 'Uncategorized']);
      }
      setUrl('https://');
    }
  };

  const handleDeleteUrl = (cat, urlToDelete) => {
    setUrlList(prevList => {
      const updatedCategoryUrls = prevList[cat].filter(u => u !== urlToDelete);
      const newList = { ...prevList };
      if (updatedCategoryUrls.length > 0) {
        newList[cat] = updatedCategoryUrls;
      } else {
        delete newList[cat];
      }
      return newList;
    });
    if (selectedUrl === urlToDelete) setSelectedUrl('');
  };

  const handleFileImport = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const lines = event.target.result.split('\n');
      lines.forEach(line => {
        const [cat, urlValue] = line.split(',').map(item => item.trim());
        setCategory(cat || 'Uncategorized');
        setUrl(urlValue);
        handleAddUrl();
      });
    };
    fileReader.readAsText(e.target.files[0]);
  };

  const toggleExportSelection = (url) => {
    setSelectedExportUrls(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleExportSelected = () => {
    const dataStr = selectedExportUrls.join('\n');
    const blob = new Blob([dataStr], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_urls.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShareSelected = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Selected URLs',
        text: selectedExportUrls.join('\n')
      }).catch(err => console.error('Share failed:', err));
    } else {
      alert('Share is not supported on this device/browser.');
    }
  };

  return (
    <div className="app-container dyslexic-font">
      <div className="app-download-section">
        <QRCodeCanvas value="https://thai-good-news.netlify.app" size={80} style={{ border: '1px solid white' }} />
      </div>

      <h1 className="header-title">ข่าวดี Thai: Good News</h1>

      <div className="form-section">
        <input
          className="input-field"
          type="text"
          placeholder="Enter a URL"
          value={url}
          onChange={(e) => setUrl(e.target.value.startsWith('https://') ? e.target.value : 'https://' + e.target.value)}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Enter Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="button-group">
          <button onClick={handleAddUrl}>Add URL</button>
          <input type="file" accept=".txt,.csv" onChange={handleFileImport} />
          <button onClick={handleExportSelected}>Export Selected URLs</button>
          <button onClick={handleShareSelected}>Share Selected URLs</button>
        </div>
      </div>

      <h2>My URLs</h2>
      {categories.length === 0 ? (
        <p>No URLs stored yet.</p>
      ) : (
        categories.map((cat, catIndex) => (
          <div key={catIndex} className="category-section">
            <h3>{cat}</h3>
            <ul>
              {(urlList[cat] || []).map((u, index) => (
                <li key={index} className="url-item">
                  <input
                    type="checkbox"
                    checked={selectedExportUrls.includes(u)}
                    onChange={() => toggleExportSelection(u)}
                  />
                  <span onClick={() => setSelectedUrl(u)} className="url-link">
                    {u}
                  </span>
                  <button onClick={() => handleDeleteUrl(cat, u)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {selectedUrl && (
        <div className="qr-section">
          <h2>QR Code for:</h2>
          <p>{selectedUrl}</p>
          <QRCodeCanvas value={selectedUrl} />
        </div>
      )}
    </div>
  );
}

export default App;
