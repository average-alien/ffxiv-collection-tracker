const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')

// GET /minions -- index of all minions
router.get('/', (req, res) => {
    res.send('minion index')
})

// GET /minions/:id -- show page for specific minion
router.get('/:id', (req, res) => {
    res.send(`minion #${req.params.id}`)
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