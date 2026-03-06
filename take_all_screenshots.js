const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const pages_en = [
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

const pages_th = [
    { text: 'ค้นหา', name: '02_Search' },
    { text: 'วิดีโอภาษามือ', name: '03_Sign_Language' },
    { text: 'รายการโปรดของฉัน', name: '04_My_Favorites' },
    { text: 'บันทึกของฉัน', name: '05_My_Notes' },
    { text: 'ข้อความที่เลือก', name: '06_Selected_Messages' },
    { text: 'คลังของฉัน', name: '07_My_Library' },
    { text: 'จัดการพื้นที่จัดเก็บ', name: '08_Storage_Management' },
    { text: 'นำเข้า', name: '09_Import' },
    { text: 'ข้อเสนอแนะ', name: '10_Feedback' },
    { text: 'แชร์', name: '11_Share' }
];

const mobileViewport = { width: 375, height: 667, deviceScaleFactor: 2 };
const desktopViewport = { width: 1440, height: 900, deviceScaleFactor: 2 };

const scenarios = [
    { folder: 'english_mobile', lang: 'en', viewport: mobileViewport, pages: pages_en, showBanner: false },
    { folder: 'english_desktop', lang: 'en', viewport: desktopViewport, pages: pages_en, showBanner: false },
    { folder: 'thai_mobile', lang: 'th', viewport: mobileViewport, pages: pages_th, showBanner: false },
    { folder: 'thai_desktop', lang: 'th', viewport: desktopViewport, pages: pages_th, showBanner: false },
    { folder: 'orange_install_banner', lang: 'en', viewport: mobileViewport, pages: pages_en, showBanner: true }
];

const delay = (time) => new Promise(r => setTimeout(r, time));

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    for (const scenario of scenarios) {
        console.log(`\nStarting scenario: ${scenario.folder}`);
        const dir = path.join(__dirname, 'screenshots', scenario.folder);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        await page.setViewport(scenario.viewport);
        
        // Go to local server, but first intercept request to set localStorage
        await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded' });
        await page.evaluate((lang) => {
            localStorage.setItem('appLang', lang);
        }, scenario.lang);
        await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded' });
        await delay(5000); 

        if (scenario.showBanner) {
            console.log('  Triggering Install Banner logic');
            await page.evaluate(() => {
                window.dispatchEvent(new Event('beforeinstallprompt'));
            });
            await delay(3000); // Banner animates in after 2s
        } else {
            console.log('  Hiding Install Banner');
            await page.evaluate(() => {
                const style = document.createElement('style');
                style.innerHTML = 'div[class*="fixed bottom-0"] { display: none !important; }';
                document.head.appendChild(style);
            });
            await delay(500);
        }

        const takeScreenshot = async (name) => {
            const dest = path.join(dir, `${name}.png`);
            await page.screenshot({ path: dest });
            console.log(`  -> Saved screenshot: ${name}.png`);
        }

        async function openSidebar() {
            try {
                await page.evaluate(() => {
                    const svgs = document.querySelectorAll('svg');
                    for (let svg of svgs) {
                        if (svg.classList.contains('lucide-menu') || svg.innerHTML.includes('M4 6h16M4 12h16m-7 6h7')) {
                            const btn = svg.closest('button');
                            if (btn && btn.offsetWidth > 0) {
                                btn.click();
                                return true;
                            }
                        }
                    }
                    const btn = document.querySelector('header button');
                    if (btn && btn.offsetWidth > 0) btn.click(); // fallback
                });
                await delay(1000); // Wait for drawer
            } catch (e) {
                 console.log("  Error opening sidebar", e.message);
            }
        }

        async function closeSidebar() {
            try {
                await page.evaluate(() => {
                    const svgs = document.querySelectorAll('div[class*="fixed"] button svg');
                    for (let svg of svgs) {
                        if (svg.innerHTML.includes('M6 18L18 6M6 6l12 12')) {
                            const btn = svg.closest('button');
                            if (btn && btn.offsetWidth > 0) {
                                btn.click();
                                return true;
                            }
                        }
                    }
                    const backdrop = document.querySelector('div.bg-black\\/50');
                    if (backdrop) backdrop.click();
                });
                await delay(1000);
            } catch (e) {}
        }

        // 1. Home Base
        await takeScreenshot('00_Home');
        
        // 2. Sidebar Opened
        await openSidebar();
        await takeScreenshot('01_Sidebar');
        await closeSidebar();

        const navigateAndCapture = async (targetText, name) => {
            console.log(`  Capturing: ${name} (${targetText})`);
            try {
                await openSidebar();
                
                const clicked = await page.evaluate((text) => {
                    const interactables = Array.from(document.querySelectorAll('button, a, div[role="button"], li'));
                    const target = interactables.find(el => {
                        if (!el.innerText) return false;
                        const elText = el.innerText.trim();
                        // Either exact match or starts with (ignoring newlines from icons)
                        return elText === text || elText.includes(text);
                    });
                    
                    if (target && target.offsetWidth > 0) {
                        target.click();
                        return true;
                    }
                    return false;
                }, targetText);
                
                if (clicked) {
                    await delay(2000); // page transition
                    
                    // Screenshot page
                    await takeScreenshot(name);

                    // Screenshot page with sidebar open
                    await openSidebar();
                    await takeScreenshot(`${name}_Sidebar`);
                    await closeSidebar();

                } else {
                    console.log(`  !! Could not find link for ${targetText}`);
                    await closeSidebar();
                }
            } catch (e) {
                console.error(`  !! Error navigating to ${targetText}:`, e.message);
                await closeSidebar();
            }
        };

        for (const p of scenario.pages) {
            await navigateAndCapture(p.text, p.name);
        }
        
        await page.evaluate(() => localStorage.clear());
    }

    await browser.close();
    console.log('All Done!');
})();
