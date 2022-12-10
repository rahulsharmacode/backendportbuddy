const mongoose = require('mongoose');
const AdminData = require('./adminSchema');

const serviceSchema = new mongoose.Schema({
    title: String,
    // service_types : [{type : mongoose.Schema.Types.ObjectId , ref : 'service_types'}],
    // clients_types : [{type : mongoose.Schema.Types.ObjectId , ref : 'clients_types'}],
    // achivements_type : [{type : mongoose.Schema.Types.ObjectId , ref : 'achivements_type'}],
    slug : String,
    meta_title : String,
    meta_keyword : String,
    meta_discription : String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},


})


const ServiceData = mongoose.model('servicepage',serviceSchema);




const serviceTypesSchema = new mongoose.Schema({
    title: String,
    discription : String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},
})
const ServiceTypesData = mongoose.model('service_types',serviceTypesSchema);

const serviceAchivementsSchema = new mongoose.Schema({
    title: String,
    count : Number,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},
})
const ServiceAchivementsData = mongoose.model('achivements_type',serviceAchivementsSchema);

module.exports = {ServiceData,ServiceTypesData,ServiceAchivementsData} ;