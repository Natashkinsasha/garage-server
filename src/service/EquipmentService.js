function EquipmentServer(db) {

    this.db = db;

    this.save = (worker) => {
        return this.db.collection('equipments').insertOne(worker);
    };

    this.update = (worker) => {
        return this.db.collection('equipments').updateOne({_id: worker.id}, worker);
    };

    this.remove = (...ids) => {
        return this.db.collection('equipments').deleteMany({_id: ids});
    };

    this.removeAll = () => {
        return this.db.collection('equipments').drop();
    };

    this.getById = (id) => {
        return this.db.collection('equipments').findOne({_id: id})
    };

    this.get = (page, number) => {
        return Promise.resolve([]);
    };

}

export default EquipmentServer;
