const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const url = 'https://ffxivcollect.com/api/bardings'

// GET /bardings -- index of all bardings
router.get('/', async (req, res) => {
    try {
        const renderData = {}
        // if user is logged in
        if (res.locals.user) {
            // find their bardings and save the IDs
            const userBardings = await res.locals.user.getBardings()
            renderData.userBardingsIds = userBardings.map(value => {
                return value.apiId
            })
        } else {
            renderData.userBardingsIds = null
        }
        // if search paramaters are provided
        if (req.query.search) {
            // pass along search request
            const response = await axios.get(`${url}?name_en_cont=${req.query.search}`)
            renderData.bardings = response.data.results
            renderData.searchReq = req.query.search
        // else request the whole whopping index
        } else {
            const response = await axios.get(url)
            renderData.bardings = response.data.results
            renderData.searchReq = null
        }
        res.render('bardings/index.ejs', renderData)
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// GET /bardings/:id -- show page for specific barding
router.get('/:id', async (req, res) => {
    try {
        // API call
        const response = await axios.get(`${url}/${req.params.id}`)
        const renderData = {
            barding: response.data
        }
        // if a user is logged in
        if (res.locals.user) {
            // find if user has saved this barding
            const barding = await db.barding.findOne({
                where: {
                    apiId: req.params.id,
                    userId: res.locals.user.id
                }
            })
            renderData.saved = await res.locals.user.hasBarding(barding)
        }
        res.render('bardings/show.ejs', renderData)
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// POST /bardings/users/:id -- add barding to specific user's list
router.post('/users/:id', async(req, res) => {
    try {
        await db.barding.findOrCreate({
            where: {
                apiId: req.body.apiId,
                userId: req.params.id
            },
            defaults: {
                name: req.body.name,
                icon: req.body.icon,
                obtained: false
            }
        })
        res.redirect(`back`)
    } catch (error) {
        console.warn(error)
        res.send('server error')
    }   
})

// PUT /bardings/:id -- update barding (marking it as obtained or not)
router.put('/:id', async (req, res) => {
    try {
        const barding = await db.barding.findByPk(req.params.id)
        await barding.update({obtained: req.body.obtained})
        res.redirect('/users/profile')
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// DELETE /bardings/:id -- remove barding from user's list
router.delete('/:id', async (req, res) => {
    try {
        await db.barding.destroy({ where: { id: req.params.id } })
        res.redirect('/users/profile')
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

module.exports = router