const express = require('express');
const Comment = require('../models/comment.model');
const auth = require('../authentication/auth');
const router = express.Router();

// Create a new comment
router.post('/', auth, async (req, res) => {
    try {
        const comment = new Comment({
            ...req.body,
            author: req.user._id
        });
        await comment.save();
        res.status(201).send(comment);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Get all comments
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find().populate('author', 'username');
        res.send(comments);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get a specific comment by ID
router.get('/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('author', 'username');
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        res.send(comment);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Update a comment 
router.put('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        res.send(comment);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Delete a comment
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;