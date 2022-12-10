
const mongoose = require('mongoose');
const AdminData = require('./adminSchema');

const noticeSchema = new mongoose.Schema({

    title : String,
    discription : String,
    count : Number,
    link : String,
    image : String,
    state : {
        type : Boolean,
        default : true
    },
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData}

},
{
    timestamps: true
})

const NoticeData = mongoose.model('notice_page', noticeSchema);


module.exports = NoticeData