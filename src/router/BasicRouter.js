import express from 'express';
import config from 'config';

export default ({userRouter, workerRouter, equipmentRouter, passport}) => {
    const basicRouter = express.Router();
    basicRouter.use(`/${config.get('version')}/api/workers`, workerRouter);
    basicRouter.use(`/${config.get('version')}/api/equipments`, equipmentRouter);
    basicRouter.use(`/${config.get('version')}/api`, userRouter);
    return basicRouter;
};