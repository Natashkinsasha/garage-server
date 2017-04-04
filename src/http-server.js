import http from 'http';


function HttpServer(app) {

    this.server = null;

    this.start = (port) => {
        this.server = http.createServer(app);
        this.server.listen(port);
    };

    this.finish = (cb) => {
        this.server.close(cb);
    };
}

export default HttpServer;




