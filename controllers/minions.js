const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const url = "https://ffxivcollect.com/api/minions"

// GET /minions -- index of all minions
router.get('/', async (req, res) => {
    try {
        const renderData = {}
        // if user is logged in
        if (res.locals.user) {
            // find their minions and save the IDs
            const userMinions = await res.locals.user.getMinions()
            renderData.userMinionsIds = userMinions.map(value => {
                return value.apiId
            })
            renderData.userId = res.locals.user.id
        } else {
            renderData.userMinionsIds = null
        }
        // if search paramaters are provided
        if (req.query.search) {
            // pass along search request
            const response = await axios.get(`${url}?name_en_cont=${req.query.search}`)
            renderData.minions = response.data.results
            renderData.searchReq = req.query.search
        // else request the whole whopping index
        } else {
            const response = await axios.get(url)
            renderData.minions = response.data.results
            renderData.searchReq = null
        }
        res.render('minions/index.ejs', renderData)
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
            // find if user has saved this minion
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
router.post('/users/:id', async (req, res) => {
    try {
        await db.minion.findOrCreate({
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

// PUT /minions/:id -- update minion (marking it as obtained or not)
router.put('/:id', async (req, res) => {
    try {
        const minion = await db.minion.findByPk(req.params.id)
        await minion.update({obtained: req.body.obtained})
        res.redirect('/users/profile')
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// DELETE /minions/:id -- remove minion from user's list
router.delete('/:id', async (req, res) => {
    try {
        await db.minion.destroy({ where: { id: req.params.id } })
        res.redirect('/users/profile')
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

module.exports= router