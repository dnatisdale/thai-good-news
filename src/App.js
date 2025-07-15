import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';

const predefinedCategories = ['Faith', 'Education', 'Health', 'Community', 'Others'];

function App() {
  const [url, setUrl] = useState('https://');
  const [category, setCategory] = useState(predefinedCategories[0]);
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

  return (
    <div className="app-container dyslexic-font">
      <h1>Thai: Good News - URL QR Manager</h1>

      <div className="form-section">
        <input
          type="text"
          placeholder="Enter a URL"
          value={url}
          onChange={(e) => setUrl(e.target.value.startsWith('https://') ? e.target.value : 'https://' + e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {predefinedCategories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="button-group">
          <button onClick={handleAddUrl}>Add URL</button>
        </div>
      </div>

      <h2>Stored URLs by Category</h2>
      {Object.keys(urlList).length === 0 ? (
        <p>No URLs stored yet.</p>
      ) : (
        Object.keys(urlList).map((cat, catIndex) => (
          <div key={catIndex} className="category-section">
            <h3>{cat}</h3>
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

/* In your public/index.html file, add this within <head> */
/*
<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/open-dyslexic" />
*/
