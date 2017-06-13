import R from 'ramda';

function UserService(User) {

    const change = (user) => {
        return user && R.compose(R.omit(['_id']), R.assoc('id', user._id.toString()))(user);
    };

    this.findByUsername = (username) => {
        return User.findOne({username}).lean().exec().then(change);
    };

    this.create = ({username, password}) => {
        return new User({username, password}).save().then((worker) => (worker.toObject())).then(change);
    };

}

export default UserService;
