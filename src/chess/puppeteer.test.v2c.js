const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function processHtmlAndLogErrors(htmlFilePath, logFilePath) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        const logStream = fs.createWriteStream(logFilePath, { flags: 'a' }); // 'a' for append

        // Capture console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                let errorMessage = `[${new Date().toISOString()}] Console Error: ${msg.text()}`;

                // Get location details
                const location = msg.location();
                if (location && location.url) {
                    const fileName = path.basename(location.url); // Extract just the filename
                    errorMessage += ` (File: ${fileName}, Line: ${location.lineNumber}, Column: ${location.columnNumber})`;
                }
                errorMessage += '\n';

                console.error(errorMessage.trim()); // Log to console for immediate feedback
                logStream.write(errorMessage);
            }
        });

        // Capture page errors
        page.on('pageerror', error => {
            // For page errors, the error object itself often contains the stack trace with file and line.
            const pageErrorMessage = `[${new Date().toISOString()}] Page Error: ${error.message}\nStack: ${error.stack}\n`;
            console.error(pageErrorMessage.trim());
            logStream.write(pageErrorMessage);
        });

        // Construct the file URL for the local HTML file
        const fileUrl = `file://${path.resolve(htmlFilePath)}`;
        console.log(`Navigating to: ${fileUrl}`);

        await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });

        console.log(`Finished processing ${htmlFilePath}. Check ${logFilePath} for errors.`);

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

// Run the function
processHtmlAndLogErrors(htmlFileName, logFileName);

