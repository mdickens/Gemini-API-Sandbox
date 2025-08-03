const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function processHtmlAndLogErrors(htmlFilePath, logFilePath) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        const logStream = fs.createWriteStream(logFilePath, { flags: 'w' });

        // Capture console messages, including errors
        page.on('console', async (msg) => {
            const args = await Promise.all(msg.args().map(arg => arg.jsonValue()));
            const text = args.join(' ');

            // Log error messages with location details
            if (msg.type() === 'error') {
                const location = msg.location();
                if (location && location.url) {
                    const fileName = path.basename(location.url);
                    logStream.write(`Error: ${text} (File: ${fileName}, Line: ${location.lineNumber}, Column: ${location.columnNumber})\n`);
                } else {
                    logStream.write(`Error: ${text}\n`);
                }
            } else {
                logStream.write(text + '\n');
            }
            console.log(text);
        });

        // Capture uncaught exceptions in the page context
        await page.evaluate(() => {
            window.onerror = (message, source, lineno, colno, error) => {
                const errorMessage = `Uncaught Error: ${message} (File: ${source}, Line: ${lineno}, Column: ${colno})`;
                console.error(errorMessage);
                window.logErrorToNode(errorMessage); // Send error to Node.js
            };
        });

        await page.exposeFunction('logErrorToNode', (errorMessage) => {
            logStream.write(`${errorMessage}\n`);
        });

        // Capture page errors (runtime errors)
        page.on('pageerror', (error) => {
            const pageErrorMessage = `Page error: ${error.message}\nStack: ${error.stack}\n`;
            console.error(pageErrorMessage);
            logStream.write(pageErrorMessage);
        });

        // Capture uncaught exceptions
        page.on('error', (err) => {
            console.error('Page error:', err);
            logStream.write(`Page error: ${err.toString()}\n`);
        });

        const fileUrl = `file://${path.resolve(htmlFilePath)}`;
        console.log(`Navigating to: ${fileUrl}`);

        await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        await page.evaluate(() => {
            // Assuming QUnit is being used for testing
            QUnit.log(result => {
                window.onQUnitLog(result);
            });
            QUnit.done(details => {
                window.onQUnitDone(details);
            });
        });

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

