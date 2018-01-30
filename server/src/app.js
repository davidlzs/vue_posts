var Post = require("../models/post");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const mongoose = require('mongoose')
//mongoose.connect('mongodb://localhost/posts')
/*
Use environment variables:
  MONGODB_POSTS_USER
  MONGODB_POSTS_PWD
  MONGODB_POSTS_URL ds117848.mlab.com:17848
*/

mongoose.connect('mongodb://' + process.env.MONGODB_POSTS_USER + ':' + process.env.MONGODB_POSTS_PWD + '@' + process.env.MONGODB_POSTS_URL + '/posts_vuejs')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
  .once("open", function(callback) {
    console.log("Connection Succeed");
  })

// Fetch all posts
app.get('/posts', (req, res) => {
  Post.find({}, 'title description', function (error, posts) {
    if (error) { console.error(error); }
    res.send({
      posts: posts
    })
  }).sort({_id:-1})
})

// Add new post
app.post('/posts', (req, res) => {
  var db = req.db;
  var title = req.body.title;
  var description = req.body.description;
  var new_post = new Post({
    title: title,
    description: description
  })

  new_post.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!'
    })
  })
})

// Update post
app.put('/posts/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) { console.error(error);}

    post.title = req.body.title
    post.description = req.body.description
    post.save(function(error) {
      if (error) {
        conole.log(error);
      }

      res.send({
        success: true
      })
    })
  })
})

// Get a post
app.get('/post/:id', (req, res) => {
  Post.findById(req.params.id, 'title description', function(error, post) {
    if (error) {console.error(error)}
    console.log(post)
    res.send(post)
  })
})

// Delete a post
app.delete('/posts/:id', (req, res) => {
  var db = req.db
  Post.remove({
    _id: req.params.id
  }, function(error, post) {
    if (error) {
      res.send(error)
    } else {
      res.send({
        success: true
      })
    }
  })
})

app.listen(process.env.PORT || 8083)
