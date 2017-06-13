import expressValidator from 'express-validator';
import reduce from 'lodash/reduce';

const LocalStrategy = require('passport-local').Strategy;
const objectID = require('mongodb').ObjectID;

module.exports = () => expressValidator({
    customValidators: {
        isObjectId: (value) => {
            return objectID.isValid(value);
        },
        isArrayObjectId: (value) => {
            return reduce(value, (result, iteam) => {
                return result && objectID.isValid(iteam)
            }, true);
        },
        isDirection: (value) => {
            return value === 'ascending' || value === 'descending';
        }
    }
})