const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const postRoutes = require("./routes/post.route");

mongoose
	.connect(
		"mongodb+srv://advaithsurya:llOqvWR4HesCKm5K@cluster0.fzgoe.mongodb.net/mean-course-demo?retryWrites=true&w=majority"
	)
	.then((_) => {
		console.log("Connected to database!");
	})
	.catch((_) => {
		console.log("Connection failed");
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, DELETE, OPTIONS"
	);
	next();
});

app.use("/api/posts", postRoutes);

module.exports = app;
