import http from 'http';


function HttpServer(app) {

    this.server = http.createServer(app);

    this.start = (port) => {
        this.server.listen(port);
    };

    this.finish = (cb) => {
        this.server.close(cb);
    };

    //return this.server;
}

export default HttpServer;




