import Promise from 'bluebird';
import R from 'ramda';


function WorkerServer(Worker) {


    const change = (worker) => {
        return worker && R.compose(R.omit(['_id']), R.assoc('id', worker._id.toString()))(worker);
    };

    this.save = (worker) => {
        return new Worker(worker).save().then((worker) => (worker.toObject())).then(change);
    };

    this.update = (worker) => {
        return Worker.findByIdAndUpdate(worker.id, worker, {new: true, runValidators: true}).lean().exec().then(change);
    };

    this.remove = (...ids) => {
        return Promise.map(ids, (id) => {
            return Worker.findByIdAndRemove(id).exec();
        });
    };

    this.removeAll = () => {
        return Worker.remove({}).exec();
    };

    this.getById = (id) => {
        return Worker.findById(id).lean().exec().then(change);
    };

    this.get = ({page = 1, limit = 10, sort}) => {
        return Worker.paginate({}, {page: +page, limit: +limit, lean: true, sort})
    };

    this.findByPositions = (...positions) => {
        return Worker.find({positions: {'$in': positions}}).lean().exec().map(change);
    };
}

export default WorkerServer;
