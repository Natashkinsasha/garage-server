import http from 'http';


function HttpServer(app) {

    this.server = null;
    this.port;
    this.start = (port) => {
        this.server = http.createServer(app);
        this.server.listen(port, ()=>{
            this.port =port;
            console.log(`Server start on port ${this.port}`)
        });
    };

    this.finish = (cb) => {
        console.log(`Server close on port ${this.port}`)
        this.server.close(cb);
    };
}

export default HttpServer;




