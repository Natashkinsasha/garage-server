import Promise from 'bluebird';

function WorkerServer(Worker) {


    this.save = (worker) => {
        return new Worker(worker).save();
    };

    this.update = (worker) => {
        return Worker.findByIdAndUpdate(worker.id, worker, {new: true});
    };

    this.remove = (...ids) => {
        return Promise.map(ids, (id) => {
            return Worker.findByIdAndRemove(id);
        });
    };

    this.removeAll = () => {
        return Worker.remove({});
    };

    this.getById = (id) => {
        return Worker.findById(id);
    };

    this.get = (page, number) => {
        return Worker.paginate({}, {offset: page * number, limit: number})
    };
}

export default WorkerServer;
