const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')

// GET /users/new -- render a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs')
})

// POST /users -- create new user in the db
router.post('/', async (req, res) => {
    try{
        // hash the password from the req.body
        const hashedPassword = bcrypt.hashSync(req.body.password, 12)
        // create a new user
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            },
            defaults: {
                password: hashedPassword
            }
        })

        // if the user was found...send them to the login form
        if (!created) {
            console.log('user exists already')
            res.redirect('/users/login?message=Account already exists, please log in to continue.')
        } else {
            // tell the browser to store the user creds as a cookie
            const encryptedUserId = crypto.AES.encrypt(newUser.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString()
            // res.cookie('key', value)
            res.cookie('userId', encryptedUserIdString)
            // redirect to the homepage
            res.redirect('/users/profile')
        }
    } catch(error) {
        console.log(error)
        res.send('server error')
    }
})

// GET /users/login -- show a login form to user
router.get('/login', (req, res) => {
    console.log(req.query)
    res.render('users/login.ejs', {
        // if the req.query.message exists, pass it as the message, otherwise pass i null
        // ternary operator
        // condition ? expression if truth : expression if falsey
        message: req.query.message ? req.query.message : null
    })
})

// POST /users/login -- accept a payload of form data and use it to log a user in
router.post('/login', async (req, res) => {
    try {
        // look up the user in the db using the supplied email
        const user = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        const noLoginMessage = 'Incorrect email or password'
        // if the user is not found -- send the user back to the login form
        if (!user) {
            console.log('user not found')
            res.redirect('/users/login?message=' + noLoginMessage)
        // if the user is found but has given the wrong password -- send them back to the login form
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            console.log('wrong password')
            res.redirect('/users/login?message=' + noLoginMessage)
        // if the user is found and the supplied pw matches -- log them in
        } else {
            const encryptedUserId = crypto.AES.encrypt(user.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString()
            res.cookie('userId', encryptedUserIdString)
            res.redirect('/users/profile')
        }
    } catch(error) {
        console.log(error)
        res.send('server error')
    }
})

// GET /users/logout -- log out a user by clearing the stored cookie
router.get('/logout', (req, res) => {
    // clear the cookie
    res.clearCookie('userId')
    // redirect to the homepage
    res.redirect('/')
})

router.get('/profile', (req, res) => {
    // if the user is not logged in ... we need to redirect to the login form
    if (!res.locals.user) {
        res.redirect('/users/login?message=You mustt authenticate before you are authorized to view this resource')
    // otherwise, show them their profile
    } else {
        res.render('users/profile.ejs', {
            user: res.locals.user
        })
    }
})

module.exports = router