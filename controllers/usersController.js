const usersStorage = require('../storages/usersStorage');
const { body, validationResult } = require('express-validator');

const alphaErr = 'must only contain letters.'
const lengthErr = 'must be between 1 and 10 characters.'

const validateUser = [
    body('firstName').trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10}).withMessage(`First name ${lengthErr}`),
    body('lastName').trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10}).withMessage(`Last name ${lengthErr}`),
    body('email')
    .isEmail().withMessage('Email is not valid'),
    body('age')
    .isInt({ min: 18, max: 120 }).withMessage('Age must be a number between 18 and 120.'),
    body('bio')
    .isLength({ max: 200 }).withMessage('Bio must not exceed 200 characters')
]

usersListGet = (req, res) => {
    res.render("index", {
        title: "Users List",
        users: usersStorage.getUsers(),
    });
};

usersCreateGet = (req, res) => {
    res.render("createUser", {
        title: "Create User",
    });
};

usersCreatePost = [
    validateUser, 
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('createUser', {
                title: "Create user",
                errors: errors.array(),
            });
        }
        const { firstName, lastName, email, age, bio } = req.body;
        usersStorage.addUser({ firstName, lastName, email, age, bio });
        res.redirect('/');
    },
]

usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
        title: "Update user",
        user: user,
    });
};

usersUpdatePost = [
    validateUser, 
    (req, res) => {
        const user = usersStorage.getUser(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('updateUser', {
                title: "Update user",
                user: user,
                errors: errors.array(),
            });
        }
        const { firstName, lastName, email, age, bio } = req.body;
        usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
        res.redirect('/');
    }
]

usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect('/');
}

usersSearchGet = (req, res) => {
    const { firstName, lastName } = req.query;
    const allUsers = usersStorage.getUsers();

    let correctUser;
    allUsers.forEach(candidateUser => {
        if (candidateUser.lastName === lastName) {
            if (candidateUser.firstName === firstName) {
                correctUser = candidateUser
            }
        }
    });
    if (!correctUser) {
    }
    res.render("search", { user: correctUser });
};

module.exports = { usersListGet, usersCreateGet, usersCreatePost, usersUpdateGet, usersUpdatePost, usersDeletePost, usersSearchGet }