const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const filePath = path.resolve(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);

    // Start a new game to make the main layout visible
    await page.click('#start-game-button');
    await page.waitForSelector('#main-layout', { visible: true });

    const statusPanel = await page.$('#status-panel');
    const newGameButton = await page.$('#new-game-button');

    const statusBox = await statusPanel.boundingBox();
    const buttonBox = await newGameButton.boundingBox();

    let overlap = false;
    if (statusBox && buttonBox) {
        if (statusBox.x < buttonBox.x + buttonBox.width &&
            statusBox.x + statusBox.width > buttonBox.x &&
            statusBox.y < buttonBox.y + buttonBox.height &&
            statusBox.y + statusBox.height > buttonBox.y) {
            overlap = true;
        }
    }

    if (overlap) {
        console.log('Test Failed: #status-panel is overlapping with #new-game-button');
    } else {
        console.log('Test Passed: #status-panel is not overlapping with #new-game-button');
    }

    await browser.close();
})();
