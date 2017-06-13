import util from 'util';

function AuthorizationError(result) {
    this.result = result;
    Error.captureStackTrace(this, AuthorizationError);
}

util.inherits(AuthorizationError, Error);
AuthorizationError.prototype.name = 'AuthorizationError';

export default AuthorizationError;