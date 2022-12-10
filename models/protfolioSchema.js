const mongoose = require('mongoose');
const AdminData = require('./adminSchema');

const portfolioSchema = new mongoose.Schema({
    title: String,
    // projects_types : [{type : mongoose.Schema.Types.ObjectId , ref : 'portfolioClientpage'}],
    // gallery : [{type : mongoose.Schema.Types.ObjectId , ref : 'portfolioGallerypage'}],
    slug : String,
    meta_title : String,
    meta_keyword : String,
    meta_discription : String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},


})

const PortfolioData = mongoose.model('portfoliopage',portfolioSchema);




const portfolioClientSchema = new mongoose.Schema({
    title: {
        type : String,
        trim : true
    },
    image: String,
    link: String,
    discription: String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

})

const PortfolioClientData = mongoose.model('portfolioClientpage',portfolioClientSchema);


const portfolioGallerySchema = new mongoose.Schema({
    sub: {
        type : String,
        trim : true
    },
    alt: {
        type : String,
        trim : true
    },
    desc: {
        type : String,
        trim : true
    },
    src: {
        type : String,
        trim : true,
        required : true
    },
    discription: String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

})

const PortfolioGalleryData = mongoose.model('portfolioGallerypage',portfolioGallerySchema);



module.exports = {PortfolioData,PortfolioClientData,PortfolioGalleryData};