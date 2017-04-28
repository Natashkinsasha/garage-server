import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Equipment = new Schema({
    types: {type: Array},
    mark: {type: String},
    name: {type: String},
    registerSign: {type: String},
    garageNumber: {type: String},
    codeMark: {type: String},
});
Equipment.plugin(mongoosePaginate);
export default mongoose.model('equipment', Equipment);
