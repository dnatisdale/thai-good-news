import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';
import './fonts/PlaypenSans.css';

function App() {
  const [url, setUrl] = useState('https://');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [urlList, setUrlList] = useState({});
  const [selectedExportUrls, setSelectedExportUrls] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);

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

  const handleDeleteCategory = (catToDelete) => {
    if (window.confirm(`Are you sure you want to delete the category "${catToDelete}" and all its URLs?`)) {
      setUrlList(prevList => {
        const newList = { ...prevList };
        delete newList[catToDelete];
        return newList;
      });
      setCategories(prev => prev.filter(cat => cat !== catToDelete));
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
        setCategories(prev => prev.filter(c => c !== cat));
      }
      return newList;
    });
  };

  const handleFileImport = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const lines = event.target.result.split('\n');
        lines.forEach(line => {
          const [cat, urlValue] = line.split(',').map(item => item.trim());
          setCategory(cat || 'Uncategorized');
          setUrl(urlValue);
          handleAddUrl();
        });
        const timestamp = new Date().toLocaleString();
        setUploadHistory(prev => [...prev, { name: file.name, size: file.size, uploadedAt: timestamp }]);
      };
      reader.readAsText(file);
    }
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
    <div className="app-container playpen-sans-font">
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
        categories.map((cat, index) => (
          <div key={index} className="category-section">
            <h3>{cat} <button onClick={() => handleDeleteCategory(cat)}>Delete Category</button></h3>
            <ul>
              {urlList[cat]?.map((u, idx) => (
                <li key={idx} className="url-item">
                  <input
                    type="checkbox"
                    checked={selectedExportUrls.includes(u)}
                    onChange={() => toggleExportSelection(u)}
                  />
                  <a href={u} target="_blank" rel="noopener noreferrer">{u}</a>
                  <QRCodeCanvas value={u} size={48} style={{ border: '1px solid white', marginLeft: '10px' }} />
                  <button onClick={() => handleDeleteUrl(cat, u)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <h2>Upload History</h2>
      <ul>
        {uploadHistory.map((file, idx) => (
          <li key={idx}>{file.name} - {file.size} bytes - Uploaded at {file.uploadedAt}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
