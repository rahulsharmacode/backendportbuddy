const AdminData = require("./adminSchema");

const  serviceContentSchema = new mongoose.Schema({
    title: String,
    paragraph: String,
    image: String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

},
{
    timeseries  : true
})

const ServiceContentData = mongoose.model('servicecontentpage', serviceContentSchema);
module.exports = ServiceContentData;




const  clientContentSchema = new mongoose.Schema({
    name: String,
    image: String,
    link: String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

},
{
    timeseries  : true
})

const ClientContentData = mongoose.model('clientContentpage', clientContentSchema);
module.exports = ClientContentData;


const  funfactSchema = new mongoose.Schema({
    title: String,
    count: Number,
    state: Boolean,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

},
{
    timeseries  : true
})

const funfactData = mongoose.model('funfactpage', funfactSchema);
module.exports = funfactData;