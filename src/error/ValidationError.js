import util from 'util';

function ValidationError(result) {
    this.result = result;
    Error.captureStackTrace(this, ValidationError);
}

util.inherits(ValidationError, Error);
ValidationError.prototype.name = 'ValidationError';

export default ValidationError;