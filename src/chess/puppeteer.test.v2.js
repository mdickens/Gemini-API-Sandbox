const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function processHtmlAndLogErrors(htmlFilePath, logFilePath) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        const logStream = fs.createWriteStream(logFilePath, { flags: 'w' });

        page.on('console', msg => {
            const text = msg.text();
            logStream.write(text + '\n');
            console.log(text);
        });

        await page.exposeFunction('onQUnitLog', (result) => {
            if (!result.result) {
                let logMessage = `QUnit.testFailed\n`;
                logMessage += `  Module: ${result.module}\n`;
                logMessage += `  Test: ${result.name}\n`;
                logMessage += `  Message: ${result.message}\n`;
                if(result.source) {
                    logMessage += `  Source: ${result.source}\n`;
                }
                console.log(logMessage);
                logStream.write(logMessage);
            }
        });

        await page.exposeFunction('onQUnitDone', (details) => {
            const summary = `\nTests finished. Passed: ${details.passed}, Failed: ${details.failed}, Total: ${details.total}, Runtime: ${details.runtime}ms\n`;
            console.log(summary);
            logStream.write(summary);
        });

        const fileUrl = `file://${path.resolve(htmlFilePath)}`;
        console.log(`Navigating to: ${fileUrl}`);

        await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        await page.evaluate(() => {
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