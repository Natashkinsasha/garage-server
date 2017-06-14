import http from 'http';


function HttpServer(app) {

    const server = http.createServer(app);

    server.start = (port) => {
        server.listen(port);
    };

    server.finish = (cb) => {
        server.close(cb);
    };

    return server;
}

export default HttpServer;




