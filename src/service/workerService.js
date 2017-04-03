function WorkerServer(db) {

    this.db = db;

    this.save = (worker) => {
        return this.db.collection('workers').insertOne(worker);
    };

    this.update = (worker) => {
        return this.db.collection('workers').updateOne({_id: worker.id}, worker);
    };

    this.remove = (...ids) => {
        return this.db.collection('workers').deleteMany({_id: ids});
    };

    this.removeAll = () => {
        return this.db.collection('workers').drop();
    };

    this.getById = (id) => {
        return this.db.collection('workers').findOne({_id: id})
    };

    this.get = (page, number) => {
        return Promise.resolve([]);
    };

    this.closeDB = () => {
        return this.db.close();
    }
}

export default WorkerServer;
