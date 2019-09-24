const express = require('express')
const User = require('../models/user')
const router = new express.Router()

module.exports = router


// ------------------------- Create user -------------------------
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
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
        res.send(user)
    } catch (e) {
        res.status(400).send()
    }
})

// ------------------------- Read all users -------------------------
router.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }

})

// ------------------ Read one user by ID object --------------------
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
    
})

// ---------------- Update one user by ID object ------------------
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'invalid updates yo'})
    }

        try{
            const user = await User.findById(req.params.id)
            updates.forEach((update) => user[update] = req.body[update])
            await user.save()                                               //allows for middleware to run (to do password hashing)
            
            if (!user) {
                return res.status(404).send()
            }
            res.send(user)
        } catch (e) {
            res.status(400).send(e)
        }

})

// ----------------- Delete one user by ID object -------------------
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

//-------------------------------------------------------------------

