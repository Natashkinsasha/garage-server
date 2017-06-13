function UserController(userService) {

    this.login = (req, res, next) => {
        return res.status(200).end()
    };

    this.logout = (req, res, next) => {
        return res.status(200).end()
    };

    this.signup = (req, res, next) => {
        return userService
            .create({...req.body})
            .then(()=>{
                return res.status(201).end()
            })
            .catch(next);
    };

}

export default UserController;

