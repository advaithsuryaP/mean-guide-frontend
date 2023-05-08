const express = require("express");

const router = express.Router();

const Post = require("../models/post.model");

// POST: Create Post
router.post("", (req, res, next) => {
	const post = new Post({
		title: req.body.title,
		content: req.body.content,
	});
	post.save().then((result) => {
		res.status(201).json({
			message: "Post created successfully",
			data: {
				id: result._id,
				title: result.title,
				content: result.content,
			},
		});
	});
});

// GET: Fetch All Posts
router.get("", (req, res, next) => {
	Post.find().then((result) => {
		res.status(200).json({
			message: "Posts fetched successfully",
			data: result,
		});
	});
});

// GET: Fetch single Post
router.get("/:id", (req, res, next) => {
	Post.findById(req.params.id).then((result) => {
		if (result) {
			res.status(200).json({
				message: "Post fetched successfully",
				data: {
					id: result._id,
					title: result.title,
					content: result.content,
				},
			});
		} else {
			res.status(404).json({
				message: `Post not found`,
			});
		}
	});
});

// PUT: Update Post
router.put("/:id", (req, res, next) => {
	const newPost = new Post({
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content,
	});
	Post.updateOne({ _id: req.params.id }, newPost).then((result) => {
		res.status(200).json({
			message: "Post edited successfully",
			data: {
				id: newPost._id,
				title: newPost.title,
				content: newPost.content,
			},
		});
	});
});

// DELETE: Delete Post
router.delete("/:id", (req, res, next) => {
	Post.deleteOne({ _id: req.params.id }).then((result) => {
		res.status(200).json({
			message: "Post deleted successfully",
			data: req.params.id,
		});
	});
});

module.exports = router;
