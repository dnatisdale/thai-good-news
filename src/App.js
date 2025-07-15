import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [urlList, setUrlList] = useState({});
  const [selectedUrl, setSelectedUrl] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('urlList');
    if (storedData) {
      setUrlList(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('urlList', JSON.stringify(urlList));
  }, [urlList]);

  const handleAddUrl = () => {
    if (url && category) {
      setUrlList(prevList => {
        const categoryUrls = prevList[category] || [];
        if (!categoryUrls.includes(url)) {
          return {
            ...prevList,
            [category]: [...categoryUrls, url]
          };
        }
        return prevList;
      });
      setUrl('');
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

  const handleExportAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(urlList));
    downloadData(dataStr, 'url_data.json');
  };

  const handleExportCategory = (cat) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ [cat]: urlList[cat] }));
    downloadData(dataStr, `${cat}_urls.json`);
  };

  const handleImport = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        setUrlList(importedData);
      } catch {
        alert('Invalid JSON file');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  };

  const downloadData = (dataStr, filename) => {
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="app-container">
      <h1>Thai: Good News - URL QR Manager</h1>

      <div className="form-section">
        <input
          type="text"
          placeholder="Enter a URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="button-group">
          <button onClick={handleAddUrl}>Add URL</button>
          <button onClick={handleExportAll}>Export All</button>
          <label className="import-label">
            Import
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              hidden
            />
          </label>
        </div>
      </div>

      <h2>Stored URLs by Category</h2>
      {Object.keys(urlList).length === 0 ? (
        <p>No URLs stored yet.</p>
      ) : (
        Object.keys(urlList).map((cat, catIndex) => (
          <div key={catIndex} className="category-section">
            <h3>
              {cat}
              <button onClick={() => handleExportCategory(cat)}>Export Category</button>
            </h3>
            <ul>
              {urlList[cat].map((u, index) => (
                <li key={index}>
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
