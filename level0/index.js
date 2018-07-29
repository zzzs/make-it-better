const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const fileDir = './files/';
const params = process.argv.splice(2);
const port = params[0] || 8888;
http.createServer(function (request, response) {
    let pathname = url.parse(request.url)['pathname'];
    pathname = pathname === '/' ? 'small.txt' : pathname;
    let requestUrl = path.join(fileDir, pathname);
    fs.readFile(requestUrl, (err, data) => {
        if (err) {
            response.writeHead(404);
            response.end(err.message);
        } else {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(data);
        }
    });

}).listen(port);
