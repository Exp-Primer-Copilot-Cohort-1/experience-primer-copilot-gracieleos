// Created web server
// Created by: Mario Suarez
// Created on: 09/10/2020
// Last edited on: 09/10/2020

// Importing modules

const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// @route   GET api/comments
// @desc    Get all comments
// @access  Public

router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    }
);

// @route   POST api/comments
// @desc    Add new comment
// @access  Private

router.post('/', [auth, [
    check('comment', 'Comment is required').not().isEmpty(),
    check('user', 'User is required').not().isEmpty(),
    check('post', 'Post is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({ errors: errors.array() });
    }
    const { comment, user, post } = req.body;
    try {
        const newComment = new Comment({
            comment,
            user,
            post
        });
        const comment = await newComment.save();
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    }
);

// @route   PUT api/comments/:id
// @desc    Update comment
// @access  Private

router.put('/:id', auth, async (req, res) => {
    const { comment, user, post } = req.body;
    // Build comment object
    const commentFields = {};
    if (comment) commentFields.comment = comment;
    if (user) commentFields.user = user;
    if (post) commentFields.post = post;
    try {
        let comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ msg: 'Comment not found' });
        comment = await Comment.findByIdAndUpdate(req.params.id, 
            { $set: commentFields },
            { new: true }
        );
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    }
);

// @route   DELETE api/comments/:id
// @desc    Delete comment
// @access  Private

router.delete('/:id', auth, async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ msg: 'Comment not found' });
        await Comment.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Comment removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    }
);

module.exports = router;
