const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const url = 'https://ffxivcollect.com/api/emotes'

// GET /emotes -- index of all emotes
router.get('/', async (req, res) => {
    try {
        // if search paramaters are provided
        if (req.query.search) {
            // pass along search request
            const response = await axios.get(`${url}?name_en_cont=${req.query.search}`)
            res.render('emotes/index.ejs', {
                emotes: response.data.results,
                searchReq: req.query.search
            })
        // else request the whole whopping index
        } else {
            const response = await axios.get(url)
            res.render('emotes/index.ejs', {
                emotes: response.data.results,
                searchReq: null
            })
        }
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// GET /emotes/:id -- show page for specific emote
router.get('/:id', async (req, res) => {
    try {
        // API call
        const response = await axios.get(`${url}/${req.params.id}`)
        // if a user is logged in
        if (res.locals.user) {
            // find if user has saved this emote
            const emote = await db.emote.findOne({
                where: {
                    apiId: req.params.id,
                    userId: res.locals.user.id
                }
            })
            const saved = await res.locals.user.hasEmote(emote)
            // necessary data to send to the view
            const data = {
                emote: response.data,
                user: res.locals.user,
                saved
            }
            res.render('emotes/show.ejs', data)
        // else just send the API response
        } else {
            res.render('emotes/show.ejs', {emote: response.data})
        }
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// POST /emotes/users/:id -- add emote to specific user's list
router.post('/users/:id', async(req, res) => {
    try {
        await db.emote.findOrCreate({
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

// PUT /emotes/:id -- update emote (marking it as obtained or not)
router.put('/:id', async (req, res) => {
    try {
        const emote = await db.emote.findByPk(req.params.id)
        await emote.update({obtained: req.body.obtained})
        res.redirect('/users/profile')
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// DELETE /emotes/:id -- remove emote from user's list
router.delete('/:id', async (req, res) => {
    try {
        await db.emote.destroy({ where: { id: req.params.id } })
        res.redirect('/users/profile')
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

module.exports= router