import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import './App.css';

function App() {
    const [urls, setUrls] = useState([]);
    const [newUrl, setNewUrl] = useState('');
    const [zoomQr, setZoomQr] = useState(null);

    const handleAddUrl = () => {
        if (!newUrl.trim()) return;
        const cleanedUrl = newUrl.trim().replace(/\s+/g, '').replace(/^(?!https?:\/\/)/, 'https://');
        setUrls([...urls, cleanedUrl]);
        setNewUrl('');
    };

    const handleZoomQr = (url) => setZoomQr(url);

    return (
        <div className="container">
            <h1>ข่าวดี Thai: Good News</h1>
            <div>
                <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="Enter URL"
                />
                <button onClick={handleAddUrl}>Add URL</button>
            </div>

            <ul className="category-list">
                {urls.map((url, index) => (
                    <li key={index}>
                        <input type="checkbox" /> {/* Placeholder for future actions */}
                        <QRCode
                            value={url}
                            className="qr-small"
                            onClick={() => handleZoomQr(url)}
                        />
                        <div className="url-link">{url}</div>
                    </li>
                ))}
            </ul>

            {zoomQr && (
                <div>
                    <QRCode value={zoomQr} className="zoomed-qr" />
                    <div className="click-to-close" onClick={() => setZoomQr(null)}>Click anywhere to close</div>
                </div>
            )}
        </div>
    );
}

export default App;
