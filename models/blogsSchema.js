const mongoose = require('mongoose');
const AdminData = require('./adminSchema');

const  blogsSchema = new mongoose.Schema({
    title: String,
    // blog_all : [{type : mongoose.Schema.Types.ObjectId , ref : 'blogContent'}],
    // activity_all : [{type : mongoose.Schema.Types.ObjectId , ref : 'activity_page'}],
    slug : String,
    meta_title : String,
    meta_keyword : String,
    meta_discription : String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

})

const BlogsData = mongoose.model('blogspage', blogsSchema);
module.exports = BlogsData;