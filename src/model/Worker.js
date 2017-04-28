import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
var renameIdPlugin = require('mongoose-rename-id');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Worker = new Schema({
    firstName: {type: String, required: true},
    secondName: {type: String, required: true},
    age: {type: Number, min: 0, max: 100},
    phone: {type: String},
    birthday: {type: Date},
    positions: {type: Array},
    cardNumber: {type: String},
    personnelNumber: {type: String},
    licenseNumber: {type: String},
    class: {type: String},
});

Worker.plugin(renameIdPlugin({newIdName: 'id'}));

Worker.plugin(mongoosePaginate);

export default mongoose.model('worker', Worker);
