//Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');

const commentsPath = path.join(__dirname, 'comments.json');

// const comments = [
//     {
//         name: 'John',
//         message: 'Hello!',
//         timestamp: new Date()
//     }
// ];

// const jsonString = JSON.stringify(comments, null, 2);
// fs.writeFileSync(commentsPath, jsonString);

const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8'));

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, world!');
});

server.listen(3000, 'localhost', () => {
    console.log('Server running at http://localhost:3000/');
});
