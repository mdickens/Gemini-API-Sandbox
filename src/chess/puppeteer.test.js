const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function processHtmlAndLogErrors(htmlFilePath, logFilePath) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        const logStream = fs.createWriteStream(logFilePath, { flags: 'a' }); // 'a' for append

        page.on('console', msg => {
            if (msg.type() === 'error') {
                const errorMessage = `[${new Date().toISOString()}] Console Error: ${msg.text()}\n`;
                console.error(errorMessage.trim()); // Also log to console for immediate feedback
                logStream.write(errorMessage);
            }
        });

        page.on('pageerror', error => {
            const pageErrorMessage = `[${new Date().toISOString()}] Page Error: ${error.message}\n`;
            console.error(pageErrorMessage.trim());
            logStream.write(pageErrorMessage);
        });

        // Construct the file URL for the local HTML file
        const fileUrl = `file://${path.resolve(htmlFilePath)}`;
        console.log(`Navigating to: ${fileUrl}`);

        await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });

        console.log(`Finished processing ${htmlFilePath}. Check ${logFilePath} for errors.`);

    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] Puppeteer Error: ${error.message}\n`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}


const htmlFileName = 'index.html';
const logFileName = 'console_errors.log';


// Run the function
processHtmlAndLogErrors(htmlFileName, logFileName);
