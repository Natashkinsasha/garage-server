import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Worker = new Schema({
    firstName: {type: String, required: true},
    secondName: {type: String, required: true},
    patronymic: {type: String},
    gender: {type: Boolean},
    dismissalData: {type: Schema.Types.Date},
    age: {type: Number, min: 0, max: 100},
    phone: {type: String},
    birthday: {type: Date},
    positions: {type: Array},
    cardNumber: {type: String},
    personnelNumber: {type: String},
    licenseNumber: {type: String},
    class: {type: String},
});

Worker.plugin(mongoosePaginate);

export default mongoose.model('worker', Worker);
