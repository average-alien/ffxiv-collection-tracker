const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const url = "https://ffxivcollect.com/api/minions"

// GET /minions -- index of all minions
router.get('/', async (req, res) => {
    try {
        // if search paramaters are provided
        if (req.query.search) {
            // pass along search request
            const response = await axios.get(`${url}?name_en_cont=${req.query.search}`)
            res.render('minions/index.ejs', { minions: response.data.results })
        // else request the whole whopping index
        } else {
            const response = await axios.get(url)
            res.render('minions/index.ejs', { minions: response.data.results })
        }
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// GET /minions/:id -- show page for specific minion
router.get('/:id', async (req, res) => {
    try {
        // API call
        const response = await axios.get(`${url}/${req.params.id}`)
        // if a user is logged in
        if (res.locals.user) {
            // find if user has saved this mount
            const minion = await db.minion.findOne({
                where: {
                    apiId: req.params.id,
                    userId: res.locals.user.id
                }
            })
            const saved = await res.locals.user.hasMinion(minion)
            // necessary data to send to the view
            const data = {
                minion: response.data,
                user: res.locals.user,
                saved
            }
            res.render('minions/show.ejs', data)
        // else just send the API response
        } else {
            res.render('minions/show.ejs', {minion: response.data})
        }
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// POST /minions/users/:id -- add minion to specific user's list
router.post('/users/:id', (req, res) => {
    console.log(`new minion for user#${req.params.id}`)
    res.json(req.body)
})

// PUT /minions/:id -- update minion (marking it as obtained or not)
router.put('/:id', (req, res) => {
    res.send(`minion #${req.params.id} getto daze`)
})

// DELETE /minions/:id -- remove minion from user's list
router.delete('/:id', (req, res) => {
    res.send(`goodbye minion ${req.params.id}`)
})

module.exports= router