import * as workerService from '../src/service/workerService'

describe('Test worker API', () => {

    it('get worker by id', (done) => {
        workerService.getById(1).then((worker) => {
            done();
        });
    });

    it('get workers by parameters', (done) => {
        workerService.get(0, 10).then((workers) => {
            done();
        });
    });

    it('save worker', (done) => {
        workerService.save({firstName: 'Petia', secondName: 'Parker'}).then(() => {
            done();
        });
    });


    it('update worker', (done) => {
        workerService.update({id: '1', firstName: 'Petia', secondName: 'Parker'}).then(() => {
            done();
        });
    });


    it('delete workers by ids', (done) => {
        workerService.remove(1,2,3).then(() => {
            done();
        });
    });

    it('delete all workers', (done) => {
        workerService.removeAll().then(() => {
            done();
        });
    });
});

