const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                replaceInDir(fullPath);
            }
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            
            if (content.includes('chuyên gia của chúng tôi')) {
                content = content.replace(/chuyên gia của chúng tôi/g, 'Ban Biên tập');
                updated = true;
            }
            if (content.includes('đội ngũ chuyên gia và bác sĩ')) {
                content = content.replace(/đội ngũ chuyên gia và bác sĩ/g, 'đội ngũ biên tập viên');
                updated = true;
            }
            
            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

replaceInDir(__dirname);
console.log('Done.');
