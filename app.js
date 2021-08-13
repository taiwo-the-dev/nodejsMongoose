const express = require('express');
const { result } = require('lodash');
const mongoose = require('mongoose');
const BlogModel = require('./models/blog');

// express app
const app = express();

// database connection
const dbURI = 'mongodb+srv://johntizymoeasy:mybusiness1@cluster0.t9qu2.mongodb.net/nodetuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) =>{app.listen(5000);})
    .catch(err => console.log(err))

// app middleware
app.use(express.urlencoded({extended: true}));

//setting app view engine
app.set('view engine', 'ejs');

//home response
app.get('/', (req, res) => {
    BlogModel.find().sort({createdAt: -1}).then((result) =>{
        res.render('index', { title: 'all Blogs', blogs: result});
    }).catch(err => console.log(err));
});

//contact response
app.get('/create-blog', (req, res) => {
    res.render('create', { title: 'Add New Blog'});
});

// post request
app.post('/blogs-creation', (req, res) =>{
    const blog = new BlogModel(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/create-blog')
        })
        .catch(err => console.log(err))
})
// single blog detail request
app.get('/blogs/:id', (req, res) =>{
    const id = req.params.id;
    BlogModel.findById(id)
        .then((result) => {
            console.log(result);
            res.render('singlePost', {blog: result})
        })
        .catch(err => console.log(err))
})

// single blog detail delete request
app.delete('/blogs/:id', (req, res) =>{
    const id = req.params.id;
    BlogModel.findByIdAndDelete(id)
        .then(result => {
            res.json({redirect: '/'})
        })
        .catch(err => console.log(err))
})
//our middleware for 404 response
app.use((req, res) => {
    res.render('error');
});