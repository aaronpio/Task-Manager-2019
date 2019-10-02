const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

module.exports = router


// -------------------------- Create task --------------------------
router.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    
})

// ------------------------ Read all tasks ------------------------
router.get('/tasks', auth, async (req, res) => {
    
    try {
        const tasks = await Task.find({ owner: req.user._id})
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
    
})

// ------------------ Read one task by ID object --------------------
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id: _id, owner: req.user._id})
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
    
})

// ---------------- Update one task by ID object ------------------
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))          // checks that the new property inputted exists on the task object

    if (!isValidOperation) {
        return res.status(400).send({error: 'invalid update G'})
    }

    try {
        const task = await Task.findOne( { _id:  req.params.id, owner: req.user._id} )

        if (!task) {
            res.status(404).send()
        }        
        
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()                                               // allows middleware to run, updates the task properties
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }

})

// ----------------- Delete one task by ID object -------------------
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        
        const task = await Task.findOneAndDelete( { _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

//--------------------------------------------------------------------

