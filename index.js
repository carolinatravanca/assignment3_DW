const http = require('http');
const fs = require('fs');
const path = require('path');


const getMimeType = (ext) => {
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}; 

const server = http.createServer((message, response) => {
    const filePath = message.url === '/' ? '/index.html' : message.url;
    const fullPath = path.join(__dirname,filePath);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = getMimeType(extname);

    fs.readFile(fullPath, (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            if (err.code === 'ENOENT') {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                response.writeHead(500, { 'Content-Type': 'text/html' });
                response.end('<h1>500 Server Error</h1>', 'utf-8');
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(data, 'utf-8');
        }
    });
});


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://10.17.0.25:3000`);
});

