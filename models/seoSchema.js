const mongoose = require('mongoose');
const AdminData = require('./adminSchema');

const siteStatsSchema = new mongoose.Schema({
    visitor: Number,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

});

const SiteStatsData = mongoose.model('sitestats', siteStatsSchema);
module.exports = SiteStatsData;