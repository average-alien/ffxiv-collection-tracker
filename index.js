// required pacakges
require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const db = require('./models')
const crypto = require('crypto-js')

// config express app/middlewares
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// our custom auth middleware
app.use(async (req, res, next) => {
    // console.log('hello from a middleware')
    // res.locals.myData = 'hello, fellow route!'
    try {
        // if there is a cookie on the incoming request
        if (req.cookies.userId) {
            // decrypt the user id before we look up the user in the db
            const decryptedId = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
            const decryptedIdString = decryptedId.toString(crypto.enc.Utf8)
            // look up the user in the db
            const user = await db.user.findByPk(decryptedIdString) // includes can go here
            // mount the user on the res.locals
            res.locals.user = user
            // if there is no cookie -- set the user to be null in the res.locals
        } else {
            res.locals.user = null
        }
        
        // move on to the next middleware or route in the chain
        next()
    } catch(error) {
        console.warn(error)
    }
})

// route controllers
app.use('/users', require('./controllers/users'))

// route definitions
app.get('/', (req, res) => {
    console.log(res.locals.user)
    // console.log('incoming cookie', req.cookies)
    // console.log(res.locals.myData)
    res.render('home.ejs')
})

// listen on a port
app.listen(PORT, () => console.log(`You or your loved ones may be entitled to compensation on port: ${PORT}`))