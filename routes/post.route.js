const express = require('express');
const Post = require('../models/post.model');
const auth = require('../authentication/auth');
const router = express.Router();

// Create a new post
router.post('/', auth, async (req, res) => {
    try {
        console.log('User:', req.user); // Add this line
        if (!req.user) {
            return res.status(401).send({ message: 'User not authenticated' });
        }
        const post = new Post({
            ...req.body,
            author: req.user._id
        });
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        console.error('Error creating post:', error); // Add this line
        res.status(400).send({ message: error.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.send(posts);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).send({ message: 'Post not found' });
        res.send(post);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }    
});

// Update a post
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: 'Post not found' });
        if (post.author.toString() !== req.user._id.toString()) return res.status(403).send({ message: 'Unauthorized' });

        Object.assign(post, req.body);
        await post.save();
        res.send(post);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Delete a post 
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: 'Post not found' });
        if (post.author.toString() !== req.user._id.toString()) return res.status(403).send({ message: 'Unauthorized' });

        await post.deleteOne();
        res.send({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});



module.exports = router;
