const mongoose = require('mongoose');
const AdminData = require('./adminSchema');
const BlogsData = require('./blogsSchema');

const  blogContentSchema = new mongoose.Schema({
    title: String,
    image : String,
    discription : String,
    category : String,
    likes : {
        type : Number,
        default : 0
    },
    tags : Array,

    userID: {
        type : mongoose.Schema.Types.ObjectId , ref : AdminData
    },
    slug : String,
    state : {
        type : Boolean,
        default : true
    },
    meta_title : String,
    meta_keyword : Array,
    meta_discription : String,

}, {
    timestamps : true
})

const BlogsContentData = mongoose.model('blogContent', blogContentSchema);


const  blogActivitySchema = new mongoose.Schema({
    likes: Number,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

})

const BlogsActivityData = mongoose.model('activity_page', blogActivitySchema);


const  blogCommentSchema = new mongoose.Schema({
    name: String,
    email: String,
    comment: String,
    userID: {
        type : mongoose.Schema.Types.ObjectId , ref : AdminData
    },
    blogID: {
        type : mongoose.Schema.Types.ObjectId , ref : BlogsData
    }
}, {
    timestamps : true
})

const BlogsCommentData = mongoose.model('blog_comment_page', blogCommentSchema);



const  blogCategorySchema = new mongoose.Schema({
    title: String,
    state:{
        type : Boolean,
        default : true
    },
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

            },
            {
                timestamps:true
            })

const BlogsCategoryData = mongoose.model('blog_category', blogCategorySchema);




module.exports = {BlogsContentData,BlogsActivityData,BlogsCommentData,BlogsCategoryData};