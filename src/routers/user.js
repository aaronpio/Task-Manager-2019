const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

module.exports = router


// ------------------------- Create user -------------------------
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        res.send({user: user, token: token})
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// ------------------------- Login to user -------------------------
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user: user, token: token})
    } catch (e) {
        res.status(400).send()
    }
})

// ------------------------- Logout of user -------------------------

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {     //filter method removes from array if doesn't match callback logic
            return token.token !== req.token                     //returns true if not token we logged in with, keeps in array (removes token we logged in with)
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//------------------------- Logout of all users -------------------------

router.post('/users/logoutAll', auth, async (req, res) => {
    
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }

})

// ------------------------- Read all users -------------------------
router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)
    
})

// ---------------- Update one user by ID object ------------------
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'invalid updates yo'})
    }

        try{
            updates.forEach((update) => req.user[update] = req.body[update])
            await req.user.save()                                               //allows for middleware to run (to do password hashing)
            
            res.send(req.user)
        } catch (e) {
            res.status(400).send(e)
        }

})

// ----------------- Delete one user by ID object -------------------
router.delete('/users/me', auth, async (req, res) => {
    try {
               
        await req.user.remove()
        res.send(req.user)

    } catch (e) {
        res.status(500).send()
    }
})

//-------------------------------------------------------------------

