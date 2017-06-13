import util from 'util';

function AuthenticationError(result) {
    this.result = result;
    Error.captureStackTrace(this, AuthenticationError);
}

util.inherits(AuthenticationError, Error);
AuthenticationError.prototype.name = 'AuthenticationError';

export default AuthenticationError;