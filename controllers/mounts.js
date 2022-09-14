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
        })
})

// GET /mounts/:id -- show page for specific mount
router.get('/:id', (req, res) => {
    res.send(`mount #${req.params.id}`)
})

// POST /mounts/users/:id -- add mount to specific user's list
router.post('/users/:id', (req, res) => {
    console.log(`new mount for user#${req.params.id}`)
    res.json(req.body)
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