// required pacakges
require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const db = require('./models')
const crypto = require('crypto-js')
const methodOverride = require('method-override')

// config express app/middlewares
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(methodOverride('_method'))
// our custom auth middleware
app.use(async (req, res, next) => {
    try {
        // if there is a cookie on the incoming request
        if (req.cookies.userId) {
            // decrypt the user id before we look up the user in the db
            const decryptedId = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
            const decryptedIdString = decryptedId.toString(crypto.enc.Utf8)
            // look up the user in the db
            const user = await db.user.findByPk(decryptedIdString, {
                include: [db.mount, db.minion],
            }) // includes can go here
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
app.use('/mounts', require('./controllers/mounts'))
app.use('/minions', require('./controllers/minions'))

// route definitions
app.get('/', (req, res) => {
    res.render('home.ejs')
})

// listen on a port
app.listen(PORT, () => console.log(`Pray return to port ${PORT}`))