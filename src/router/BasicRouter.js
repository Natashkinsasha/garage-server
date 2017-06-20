import express from 'express';
import config from 'config';

export default ({authRouter, workerRouter, equipmentRouter, passport}) => {
    const basicRouter = express.Router();
    basicRouter.use(`/workers`, workerRouter);
    basicRouter.use(`/equipments`, equipmentRouter);
    basicRouter.use(`/`, authRouter);
    return basicRouter;
};