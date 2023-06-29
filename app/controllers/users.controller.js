const { selectAllUsers } = require("../models/users.models")

exports.getAllUsers = (_, res, next) => {
    selectAllUsers()
        .then((allUsers) => {
            res.status(200).send({ allUsers })
        })
        .catch(next)
}