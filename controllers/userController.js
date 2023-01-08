const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}
//createUser is only accessible to head-admin, use it for creating new admins only!
exports.createUser = factory.createOne(User)
//updateUser is only for general fields, don't use it for password update! otherwise password won't be hashed!
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)