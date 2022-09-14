const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const url = 'https://ffxivcollect.com/api/mounts'

// GET /mounts -- index of all mounts
router.get('/', async (req, res) => {
    try {
        if (req.query.search) {
            const response = await axios.get(`${url}?name_en_cont=${req.query.search}`)
            res.render('mounts/index.ejs', { mounts: response.data.results })
        } else {
            const response = await axios.get(url)
            res.render('mounts/index.ejs', { mounts: response.data.results })
        }
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }

})

// GET /mounts/:id -- show page for specific mount
router.get('/:id', async (req, res) => {
    try {
        // API call
        const response = await axios.get(`${url}/${req.params.id}`)
        // if a user is logged in
        if (res.locals.user) {
            // find if user has saved this mount
            const mount = await db.mount.findOne({
                where: {
                    apiId: req.params.id,
                    userId: res.locals.user.id
                }
            })
            const saved = await res.locals.user.hasMount(mount)
            // necessary data to send to the view
            const data = {
                mount: response.data,
                user: res.locals.user,
                saved
            }
            res.render('mounts/show.ejs', data)
        // else just send the API response
        } else {
            res.render('mounts/show.ejs', {mount: response.data})
        }
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// POST /mounts/users/:id -- add mount to specific user's list
router.post('/users/:id', async(req, res) => {
    try {
        const [trackedMount] = await db.mount.findOrCreate({
            where: {
                apiId: req.body.apiId,
                name: req.body.name,
                userId: req.params.id
            },
            defaults: {
                obtained: false
            }
        })
        res.redirect(`/mounts/${req.body.apiId}`)
    } catch (error) {
        console.warn(error)
        res.send('server error')
    }   
})

// PUT /mounts/:id -- update mount (marking it as obtained or not)
router.put('/:id', async (req, res) => {
    try {
        const mount = await db.mount.findByPk(req.params.id)
        await mount.update({obtained: req.body.obtained})
        res.redirect('/users/profile')
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

// DELETE /mounts/:id -- remove mount from user's list
router.delete('/:id', async (req, res) => {
    try {
        await db.mount.destroy({ where: { id: req.params.id } })
        res.redirect('/users/profile')
    } catch(error) {
        console.warn(error)
        res.send('server error')
    }
})

module.exports= router