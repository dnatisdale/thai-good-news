const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Function to wait
const delay = (time) => new Promise(r => setTimeout(r, time));

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set to mobile dimensions
    await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 });
    
    console.log('Navigating to http://127.0.0.1:3005');
    await page.goto('http://127.0.0.1:3005', { waitUntil: 'domcontentloaded' });

    // Hide the orange install banner
    await page.addStyleTag({ content: '.fixed.bottom-0.z-50 { display: none !important; }' });

    // Ensure we are fully loaded
    await delay(4000);

    const takeScreenshot = async (name) => {
        await page.screenshot({ path: path.join(dir, `${name}.png`) });
        console.log(`Saved screenshot: ${name}.png`);
    }

    // Capture home page
    await takeScreenshot('00_Home');

    async function openSidebar() {
        try {
            await page.evaluate(() => {
                const svgs = document.querySelectorAll('svg');
                for (let svg of svgs) {
                    // Check for hamburger menu icon (the header menu button)
                    if (svg.classList.contains('lucide-menu') || svg.innerHTML.includes('M4 6h16M4 12h16m-7 6h7')) {
                        const btn = svg.closest('button');
                        if (btn) {
                            btn.click();
                            return true;
                        }
                    }
                }
                const firstBtn = document.querySelector('button');
                if (firstBtn) firstBtn.click();
            });
            await delay(1500); // Wait for drawer to slide out
        } catch (e) {
             console.log("Error opening sidebar", e);
        }
    }

    async function closeSidebar() {
        // Find the close button inside the sidebar
        try {
            await page.evaluate(() => {
                const svgs = document.querySelectorAll('div[class*="fixed"] button svg');
                for (let svg of svgs) {
                     // Check for X icon (close button)
                    if (svg.innerHTML.includes('M6 18L18 6M6 6l12 12')) {
                        const btn = svg.closest('button');
                        if (btn) {
                            btn.click();
                            return true;
                        }
                    }
                }
                // Fallback click on the backdrop overlay
                const backdrop = document.querySelector('div.bg-black\\/50');
                if (backdrop) backdrop.click();
            });
            await delay(1000);
        } catch (e) {}
    }

    await openSidebar();
    await takeScreenshot('01_Sidebar');
    await closeSidebar();

    const navigateAndCapture = async (targetText, name) => {
        try {
            await openSidebar();

            const clicked = await page.evaluate((text) => {
                // Find all clickable things
                const interactables = Array.from(document.querySelectorAll('button, a, div[role="button"], li'));
                
                const target = interactables.find(el => {
                    if (!el.innerText) return false;
                    const elText = el.innerText.trim();
                    return elText === text || elText.startsWith(text);
                });
                
                if (target) {
                    target.click();
                    return true;
                }
                return false;
            }, targetText);
            
            if (clicked) {
                await delay(2000); // wait for page transition
                
                // We're now on the target page. 
                // 1. Take screenshot of the page itself
                await takeScreenshot(name);

                // 2. Open Sidebar again so we can see the highlighted active state
                await openSidebar();
                await takeScreenshot(`${name}_Sidebar`);
                
                // 3. Close the sidebar to reset state for the next item
                await closeSidebar();

            } else {
                console.log(`Could not find link for ${targetText}`);
                await closeSidebar();
            }
        } catch (e) {
            console.error(`Error navigating to ${targetText}:`, e);
            await closeSidebar();
        }
    };

    const pages = [
        { text: 'Search', name: '02_Search' },
        { text: 'Sign Language Video', name: '03_Sign_Language' },
        { text: 'My Favorites', name: '04_My_Favorites' },
        { text: 'My Notes', name: '05_My_Notes' },
        { text: 'Selected Messages', name: '06_Selected_Messages' },
        { text: 'My Library', name: '07_My_Library' },
        { text: 'Storage Management', name: '08_Storage_Management' },
        { text: 'Import', name: '09_Import' },
        { text: 'Feedback', name: '10_Feedback' },
        { text: 'Share', name: '11_Share' }
    ];

    for (const p of pages) {
        await navigateAndCapture(p.text, p.name);
    }

    await browser.close();
    console.log('Done!');
})();
