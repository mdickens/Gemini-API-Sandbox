const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function processHtmlAndLogErrors(htmlFilePath, logFilePath) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        const logStream = fs.createWriteStream(logFilePath, { flags: 'w' });

        page.on('console', async (msg) => {
            const args = await Promise.all(msg.args().map(arg => arg.jsonValue()));
            const text = args.join(' ');
            logStream.write(text + '\n');
            console.log(text);
        });

        const fileUrl = `file://${path.resolve(htmlFilePath)}`;
        console.log(`Navigating to: ${fileUrl}`);

        await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        await new Promise(resolve => setTimeout(resolve, 10000));

    } catch (error) {
        console.error(`An error occurred during Puppeteer operation: ${error.message}`);
        fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] Puppeteer Operation Error: ${error.message}\n`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

const htmlFileName = 'tests/tests.html';
const logFileName = 'console.log';

processHtmlAndLogErrors(htmlFileName, logFileName);
