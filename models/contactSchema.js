const mongoose = require('mongoose');
const AdminData = require('./adminSchema');

const  contactSchema = new mongoose.Schema({
    title: String,
    name : String,
    email : String,
    subject : String,
    discription : String,
    tnc : Boolean,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

})

const ContactData = mongoose.model('contactContent', contactSchema);
module.exports = ContactData;