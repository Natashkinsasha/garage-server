import _ from 'lodash';
import shortId from 'shortid';

let workers = [];

export function save(worker) {
    return Promise.resolve(workers.push({...worker, id: shortId.generate()}));
}

export function update(worker) {
    return Promise.resolve(_.remove(workers, {'id': worker.id})).then((deleteWorker)=>{
        if (deleteWorker.length){
            return workers.push(worker);
        }
        return false;
    });
}

export function remove(...ids) {
    return Promise.resolve(_.remove(workers, (worker) => {
        return _.find(ids, worker.id);
    }));
}

export function removeAll() {
    return Promise.resolve(workers=[]);
}


export function get(page, number) {
    return Promise.resolve({workers: _.slice(workers, page * number, number), length: workers.length});
}

export function getById(id) {
    return Promise.resolve( _.findLast(workers, {'id': id}));
}
