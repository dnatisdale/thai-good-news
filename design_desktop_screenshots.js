const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const mobileFolders = [
    { src: 'english_mobile', dest: 'english_desktop' },
    { src: 'thai_mobile', dest: 'thai_desktop' }
];

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    // 1440x900 @ 2x scaling for crisp quality
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    for (const folderPair of mobileFolders) {
        console.log(`\nStarting composite generation for ${folderPair.dest}...`);
        const srcDir = path.join(__dirname, 'screenshots', folderPair.src);
        const destDir = path.join(__dirname, 'screenshots', folderPair.dest);
        
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

        const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png'));

        for (const file of files) {
            const srcPath = path.join(srcDir, file);
            const destPath = path.join(destDir, file);

            const imgData = fs.readFileSync(srcPath);
            const base64Img = `data:image/png;base64,${imgData.toString('base64')}`;

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            margin: 0; padding: 0; 
                            width: 1440px; height: 900px;
                            /* Gorgeous soft brand background */
                            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
                            display: flex; align-items: center; justify-content: center;
                            overflow: hidden;
                        }
                        /* Subtle accent blob behind phone */
                        .blob {
                            position: absolute;
                            width: 800px;
                            height: 800px;
                            background: radial-gradient(circle, rgba(169, 27, 13, 0.15) 0%, rgba(169, 27, 13, 0) 70%);
                            z-index: 0;
                        }
                        /* Mockup frame */
                        .device {
                            position: relative;
                            width: 375px; 
                            height: 667px;
                            transform: scale(1.15); /* Scale up cleanly */
                            border-radius: 36px;
                            z-index: 10;
                            /* Beautiful bezel + huge realistic shadow */
                            box-shadow: 
                                0 45px 80px -20px rgba(0,30,60,0.4), 
                                0 10px 30px -10px rgba(0,0,0,0.1),
                                0 0 0 1px rgba(0,0,0,0.05),
                                inset 0 0 0 10px #f8fafc; /* White/slate-50 bezel */
                            background: #f8fafc;
                            padding: 10px;
                        }
                        .screen {
                            width: 100%; height: 100%;
                            border-radius: 26px;
                            overflow: hidden;
                            position: relative;
                            background: #fff;
                            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); /* inner rim */
                        }
                        img {
                            width: 100%; height: 100%; object-fit: cover; display: block;
                        }
                        /* Subtle screen glare */
                        .screen::after {
                            content: '';
                            position: absolute;
                            top: -50%; left: -50%;
                            width: 200%; height: 200%;
                            background: linear-gradient(-45deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0) 50%);
                            pointer-events: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="blob"></div>
                    <div class="device">
                        <div class="screen">
                            <img src="${base64Img}" />
                        </div>
                    </div>
                </body>
                </html>
            `;

            await page.setContent(html);
            await new Promise(r => setTimeout(r, 50));
            await page.screenshot({ path: destPath });
            console.log(`  -> Designed composite: ${file}`);
        }
    }

    await browser.close();
    console.log("\nAll Desktop screenshots successfully generated from Mobile frames!");
})();
