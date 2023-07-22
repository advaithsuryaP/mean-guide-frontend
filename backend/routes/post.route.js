const express = require("express");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
	"image/png": "png",
	"image/jpeg": "jpeg",
	"image/jpg": "jpg",
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		let error = new Error("invalid mime type");
		if (isValid) error = null;
		cb(error, "backend/images");
	},
	filename: (req, file, cb) => {
		const name = file.originalname.toLowerCase().split(" ").join("-");
		const ext = MIME_TYPE_MAP[file.mimetype];
		cb(null, name + "-" + Date.now() + "." + ext);
	},
});

const Post = require("../models/post.model");

// POST: Create Post
router.post(
	"",
	multer({ storage: storage }).single("image"),
	(req, res, next) => {
		const url = req.protocol + "://" + req.get("host");
		const post = new Post({
			title: req.body.title,
			content: req.body.content,
			imagePath: url + "/images/" + req.file.filename,
		});
		post.save().then((result) => {
			res.status(201).json({
				message: "Post created successfully",
				data: {
					id: result._id,
					title: result.title,
					content: result.content,
					imagePath: result.imagePath,
				},
			});
		});
	}
);

// GET: Fetch All Posts
router.get("", (req, res, next) => {
	const pageSize = +req.query.pageSize;
	const currentPage = +req.query.page;
	const postQuery = Post.find();
	let fetchedPosts;
	if (pageSize && currentPage) {
		postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
	}
	postQuery
		.then((result) => {
			fetchedPosts = result;
			return Post.count();
		})
		.then((count) => {
			res.status(200).json({
				message: "Posts fetched successfully",
				data: fetchedPosts,
				totalPosts: count,
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
					imagePath: result.imagePath,
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
router.put(
	"/:id",
	multer({ storage: storage }).single("image"),
	(req, res, next) => {
		let imagePath = req.body.imagePath;
		if (req.file) {
			const url = req.protocol + "://" + req.get("host");
			imagePath = url + "/images/" + req.file.filename;
		}
		const newPost = new Post({
			_id: req.body.id,
			title: req.body.title,
			content: req.body.content,
			imagePath: imagePath,
		});
		Post.updateOne({ _id: req.params.id }, newPost).then((result) => {
			res.status(200).json({
				message: "Post edited successfully",
				data: {
					id: newPost._id,
					title: newPost.title,
					content: newPost.content,
					// imagepath: newPost.imagePath
				},
			});
		});
	}
);

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
