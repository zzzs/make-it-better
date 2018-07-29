const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const fileDir = './files/';
const params = process.argv.splice(2);
const port = params[1] || 8888;
http.createServer(function (request, response) {
    let pathname = url.parse(request.url)['pathname'];
    pathname = pathname === '/' ? 'small.txt' : pathname;
    let requestUrl = path.join(fileDir, pathname);
    let reader = fs.createReadStream(requestUrl);
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    reader.pipe(response, { end: false });
    reader.on('end', function() {
        response.end();
    });

}).listen(port);
