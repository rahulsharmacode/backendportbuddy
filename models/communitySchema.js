
const mongoose = require('mongoose');
const AdminData = require('./adminSchema');

const communityPostSchema = new mongoose.Schema({

    post_title : String,
    post_discription : String,
    post_image : String,
    post_images : Array,

    upvote : Array,
    downvote : Array,

    trending : String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},
},
{
    timestamps: true
})

const CommunitypostData = mongoose.model('community_post', communityPostSchema);


const communityPageSchema = new mongoose.Schema({
        title: String,
        paragraph: String,
        state: {
            type : Boolean,
            default : true
        }
})
const CommunitypageData = mongoose.model('community_page', communityPageSchema);




const cmsDevSchema = new mongoose.Schema({
    web_theme_pri: String,
    web_theme_sec: String,

    cms_theme_pri: String,
    cms_theme_sec: String,

    fontfamily: String,

    btnpadx : Number,
    btnpady : Number,
    btnbg : String,
    btntx : String,
    btnhovbg : String,
    btnhovtx : String,
    btnsd1 : Number,
    btnsd2 : Number,
    btnsd3 : Number,
    btnsd4 : String,
    btnradi : Number,
    btnbd : Number,
    state: {
        type : Boolean,
        default : false
    },
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData}

})
const CmsDevData = mongoose.model('community_dev_page', cmsDevSchema);



module.exports = {CommunitypostData,CommunitypageData,CmsDevData};