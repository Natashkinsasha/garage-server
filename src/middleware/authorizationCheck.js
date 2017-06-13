import R from 'ramda';

import AuthorizationError from '../error/AuthorizationError';

module.exports = (...roles) => {
    return (req, res, next)=>{
        if (req.isAuthenticated()){
            if(R.isEmpty(roles)){
                return next();
            }
            if(req.user && !R.compose(R.isEmpty, R.intersection(roles))(req.user.roles)){
                return next();
            }
        }
        return next(new AuthorizationError())
    }
};
