const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const url = 'https://ffxivcollect.com/api/mounts'

// GET /mounts -- index of all mounts
router.get('/', (req, res) => {
    axios.get(url)
        .then(response => {
            res.render('mounts/index.ejs', { mounts: response.data.results })
        })
        .catch(error => {
            console.warn(error)
            res.send('server error')
        })
})

// GET /mounts/:id -- show page for specific mount
router.get('/:id', async (req, res) => {
    try {
        const response = await axios.get(`${url}/${req.params.id}`)
        if (res.locals.user) {
            const mount = await db.mount.findOne({
                where: {
                apiId: req.params.id,
                userId: res.locals.user.id
                }
            })
            console.log(1, mount)
            const obtained = await res.locals.user.hasMount(mount)
            console.log(2, obtained)
            const data = {
                mount: response.data,
                user: res.locals.user,
                obtained
            }
            console.log(3,data.obtained)
            res.render('mounts/show.ejs', data)
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
            default: {
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
router.put('/:id', (req, res) => {
    res.send(`mount #${req.params.id} getto daze`)
})

// DELETE /mounts/:id -- remove mount from user's list
router.delete('/:id', (req, res) => {
    res.send(`goodbye mount ${req.params.id}`)
})

module.exports= router