const mongoose = require('mongoose');
const AdminData = require('./adminSchema');

const  socialSchema = new mongoose.Schema({
    icon: String,
    link : String,
    state : Boolean,
    userID : {
        type : mongoose.Schema.Types.ObjectId , ref : AdminData
    }
})

const SocialData = mongoose.model('socialContent', socialSchema);
module.exports = SocialData;