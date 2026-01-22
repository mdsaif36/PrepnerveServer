const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

// Change this to match exactly where you put the PDF
const filePath = path.join(__dirname, '../uploads/Safiullah.resume.pdf'); 
// If you put it in the root folder, use: path.join(__dirname, '../Safiullah.resume.pdf')

async function testPdfRead() {
    console.log(`🔍 Testing File: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error("❌ File not found! Please check the path.");
        return;
    }

    try {
        const dataBuffer = fs.readFileSync(filePath);
        console.log(`📦 File Size: ${dataBuffer.length} bytes`);

        const data = await pdfParse(dataBuffer);
        
        console.log(`\n✅ SUCCESS! Extracted ${data.text.length} characters.`);
        console.log("\n--- TEXT PREVIEW ---");
        console.log(data.text.substring(0, 500)); // Show first 500 chars
        console.log("\n--------------------");

    } catch (error) {
        console.error("❌ Parsing Failed:", error);
    }
}

testPdfRead();