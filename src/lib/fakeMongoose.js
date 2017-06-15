import mongoose from 'mongoose';
import Promise from 'bluebird';
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
mongoose.Promise = Promise;

mockgoose
    .prepareStorage();

export default ()=>(mongoose)

