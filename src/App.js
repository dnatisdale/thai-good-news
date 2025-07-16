import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';

function App() {
    const [urls, setUrls] = useState([]);
    const [inputUrl, setInputUrl] = useState('');
    const [selectedUrls, setSelectedUrls] = useState([]);

    const handleAddUrl = () => {
        let urlToAdd = inputUrl.trim();
        if (!urlToAdd) return;

        if (!urlToAdd.startsWith('https://')) {
            urlToAdd = 'https://' + urlToAdd;
        }

        urlToAdd = urlToAdd.replace(/\s+/g, ''); // Remove any spaces within the URL

        if (!urls.includes(urlToAdd)) {
            setUrls([...urls, urlToAdd]);
            setInputUrl('');
        }
    };

    const handleCheckboxChange = (url) => {
        setSelectedUrls((prevSelected) =>
            prevSelected.includes(url)
                ? prevSelected.filter((u) => u !== url)
                : [...prevSelected, url]
        );
    };

    const handleAction = (action) => {
        if (selectedUrls.length === 0) return;

        if (action === 'delete') {
            setUrls(urls.filter((url) => !selectedUrls.includes(url)));
            setSelectedUrls([]);
        } else if (action === 'export') {
            const csvContent = selectedUrls.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'exported_urls.csv';
            link.click();
        } else if (action === 'share') {
            const mailtoLink = `mailto:?body=${encodeURIComponent(selectedUrls.join('\n'))}`;
            window.location.href = mailtoLink;
        }
    };

    return (
        <div className="App">
            <h1>ข่าวดี Thai: Good News</h1>

            <div className="input-group">
                <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Enter URL"
                />
                <button onClick={handleAddUrl}>Add URL</button>
            </div>

            <div className="actions">
                <button onClick={() => handleAction('share')}>Share</button>
                <button onClick={() => handleAction('export')}>Export</button>
                <button onClick={() => handleAction('delete')}>Delete</button>
            </div>

            <ul className="url-list">
                {urls.map((url, index) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            checked={selectedUrls.includes(url)}
                            onChange={() => handleCheckboxChange(url)}
                        />
                        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                        <div className="qr-container">
                            <QRCodeCanvas value={url} size={50} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
