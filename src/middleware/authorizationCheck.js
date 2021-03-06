import R from 'ramda';
import jwt from 'jsonwebtoken';

import AuthorizationError from '../error/AuthorizationError';

export default (...roles) => {
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
