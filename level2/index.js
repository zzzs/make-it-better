const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');
const cluster = require('cluster');

const numCPUs = require('os').cpus().length;
const fileDir = './files/';

const params = process.argv.splice(2);
const port = params[1] || 8888;

if (cluster.isMaster) {
    console.log(`主进程 ${process.pid} 正在运行`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
        cluster.fork();
    });
} else {
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
    console.log(`工作进程 ${process.pid} 已启动`);
}
