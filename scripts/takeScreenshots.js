const puppeteer = require('puppeteer');
const fs = require('fs');

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1366, height: 768 });

  const features = [
    { index: 0, name: 'Search' },
    { index: 1, name: 'Sign_Language' },
    { index: 2, name: 'Favorites' },
    { index: 3, name: 'Notes' },
    { index: 4, name: 'Selected_Messages' },
    { index: 5, name: 'My_Library' },
    { index: 6, name: 'Storage_Management' },
    { index: 7, name: 'Import' },
    { index: 8, name: 'Feedback' },
    { index: 9, name: 'Share' }
  ];

  async function takeScreenshotsForLang(lang, folderName) {
    if (!fs.existsSync(`screenshots/${folderName}`)) {
        fs.mkdirSync(`screenshots/${folderName}`, { recursive: true });
    }

    // Load with specific language
    await page.goto('http://localhost:3000');
    await page.evaluate((l) => {
        localStorage.setItem('appLang', l);
        localStorage.setItem('theme', 'light');
    }, lang);
    await page.reload();

    // Wait for the main page to load
    await page.waitForSelector('[aria-label="Open Sidebar Menu"]', { timeout: 30000 });
    // Wait for loading splash to go away
    await delay(3000); 

    for (let i = -1; i < features.length; i++) {
        // Open the menu
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('[aria-label="Open Sidebar Menu"]'));
            const visibleBtn = btns.find(b => b.offsetParent !== null);
            if(visibleBtn) visibleBtn.click();
        });
        await delay(1000); // UI transition

        if (i === -1) {
            // Take screenshot of the open sidebar!
            await page.screenshot({ path: `screenshots/${folderName}/01_Sidebar.png` });
            
            // Close the sidebar to reset state
            await page.evaluate(() => {
                const closeBtn = document.querySelector('nav').parentElement.querySelector('.text-white.p-1.hover\\:bg-red-800.rounded-full');
                if(closeBtn) closeBtn.click();
            });
            await delay(1000);
            continue;
        }

        const feature = features[i];
        
        // Find the feature button in the nav and click it
        // Note: feature buttons are the first 10 buttons in the nav
        await page.evaluate((idx) => {
            const nav = document.querySelector('nav');
            const buttons = Array.from(nav.querySelectorAll('button'));
            if (buttons[idx]) buttons[idx].click();
        }, feature.index);
        
        await delay(2000); // Wait for the page content to swap

        // Take a screenshot of the feature
        const fileNumber = (i + 2).toString().padStart(2, '0');
        await page.screenshot({ path: `screenshots/${folderName}/${fileNumber}_${feature.name}.png` });
    }
  }

  try {
    console.log('Taking English screenshots...');
    await takeScreenshotsForLang('en', 'ms-store-en');
    
    console.log('Taking Thai screenshots...');
    await takeScreenshotsForLang('th', 'ms-store-th');

    console.log('Done!');
  } catch (error) {
    console.error('Error during screenshot capture:', error);
  } finally {
    await browser.close();
  }
})();
