
const mongoose = require('mongoose');
const AdminData = require('./adminSchema');

const settingsSchema = new mongoose.Schema({
    site_title : String,
    site_discription : String,
    site_estd : String,
    site_phone : String,
    site_address : String,
    site_email : String,
    site_gmap : String,
    site_favicon : String,
    site_copyright_name : {
        type : String,
        default : "Rahul Sharma"
    },
    site_copyright_link : {
        type : String,
        default : "http://rahulsharma.com.np/"
    },

    site_font_family : String,
    site_font_color : String,


    site_theme_color1 : {
        type: String,
        default : '#222222'
    },
    site_theme_color2 : {
        type: String,
        default : '#333333'
    },
    site_theme_color3 : String,
    site_theme_color4 : String,

    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},


})


const SiteData = mongoose.model('sitepage', settingsSchema);
module.exports = SiteData;
