import app from './app';
import http from 'http';


class HttpServer {

    constructor(){
        this.server = null;
    }

    start = (port) => {
        this.server = http.createServer(app);
        this.server.listen(port);
    }

    finish = (cb) => {
        this.server.close(cb);
    }

}

export default HttpServer;




