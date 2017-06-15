import Promise from 'bluebird';

function EquipmentServer(Equipment) {

    this.save = (equipment) => {
        return new Equipment(equipment).save();
    };

    this.update = (equipment) => {
        return Equipment.findByIdAndUpdate(equipment.id, equipment, {new: true, runValidators: true });
    };

    this.remove = (...ids) => {
        return Promise.map(ids, (id) => {
            return Equipment.findByIdAndRemove(id);
        });
    };

    this.removeAll = () => {
        return Equipment.remove({});
    };

    this.getById = (id) => {
        return Equipment.findById(id);
    };

    this.get = (page, number) => {
        return Equipment.paginate({}, {offset: page * number, limit: number})
    };

}

export default EquipmentServer;
