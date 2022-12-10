
const mongoose = require('mongoose');
const AdminData = require('./adminSchema');


const aboutSchema = new mongoose.Schema({
    title : String,
    name: String,
    degination : String,
    profile_image : String,
    discription: String,
    // profile : [{type : mongoose.Schema.Types.ObjectId , ref : 'adminpage'}],
    cv : String,
    // skills : [{type : mongoose.Schema.Types.ObjectId , ref : 'skills_data'}],
    // edu_exp : [{type : mongoose.Schema.Types.ObjectId , ref : 'edu_exp_page'}],
    // testimonials : [{type : mongoose.Schema.Types.ObjectId , ref : 'testimonials_page'}],
    // social : [{type : mongoose.Schema.Types.ObjectId , ref : 'socialContent'}],
    slug : String,
    meta_title : String,
    meta_keyword : String,
    meta_discription : String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

})

const AboutData = mongoose.model('aboutpage',aboutSchema);
module.exports = AboutData;