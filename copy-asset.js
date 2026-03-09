const fs = require('fs');
const path = require('path');

const source = "C:\\Users\\Juan\\.gemini\\antigravity\\brain\\18007d55-b2d9-4a4a-af45-dd0820284358\\academic_social_bg_1773026381046.png";
const dest = "c:\\Users\\Juan\\Desktop\\RedSocial\\public\\academic_social_bg.png";

try {
    fs.copyFileSync(source, dest);
    console.log('Successfully copied file to ' + dest);
    if (fs.existsSync(dest)) {
        console.log('Verified: File exists at destination');
    }
} catch (err) {
    console.error('Error copying file:', err);
    process.exit(1);
}
