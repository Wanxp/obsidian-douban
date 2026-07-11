import fs from 'fs';
import path from 'path';

const distDir = './dist';

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

const filesToCopy = ['manifest.json', 'styles.css'];

filesToCopy.forEach(file => {
    const source = path.resolve(file);
    const dest = path.resolve(distDir, file);
    if (fs.existsSync(source)) {
        fs.copyFileSync(source, dest);
        console.log(`Copied ${file} to ${distDir}`);
    } else {
        console.error(`File ${file} not found`);
        process.exit(1);
    }
});