
const mongoose = require('mongoose');
const AdminData = require('./adminSchema');


const homeSchema = new mongoose.Schema({
    title : String,
    name: String,
    discription: String,
    profile_image: String,
    // social: [{type: mongoose.Schema.Types.ObjectId, ref:'socialContent'}],
    slug : String,
    meta_title : String,
    meta_keyword : String,
    meta_discription : String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData}

})

const HomeData = mongoose.model('homepage',homeSchema);
module.exports = HomeData;