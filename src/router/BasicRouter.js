import express from 'express';
import config from 'config';

export default ({userRouter, workerRouter, equipmentRouter, passport}) => {
    const basicRouter = express.Router();
    basicRouter.use(`/workers`, workerRouter);
    basicRouter.use(`/equipments`, equipmentRouter);
    basicRouter.use(`/`, userRouter);
    return basicRouter;
};