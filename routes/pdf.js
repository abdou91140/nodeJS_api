const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(process.env.FRONTEND_URL + "/details/" + id, { waitUntil: 'networkidle2' });
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        const pdfFilePath = path.join(__dirname, 'details.pdf');
        require('fs').writeFileSync(pdfFilePath, pdfBuffer);

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Content-Disposition', 'attachment; filename="details.pdf"');
        res.sendFile(pdfFilePath);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});
module.exports = router;
