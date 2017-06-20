import util from 'util';
import AuthorizationError from './AuthorizationError';

function BrokenTokenError(result) {
    this.result = result;
    Error.captureStackTrace(this, BrokenTokenError);
}

util.inherits(BrokenTokenError, AuthorizationError);
BrokenTokenError.prototype.name = 'BrokenTokenError';

export default BrokenTokenError;
