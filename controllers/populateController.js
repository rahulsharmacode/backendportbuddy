const AboutData = require("../models/aboutSchema");
const AdminData = require("../models/adminSchema");
const { SkillsData, ExperienceData, TestimonialData } = require("../models/skilllsSchema");
const SocialData = require("../models/socialSchema");
const HomeData = require("../models/homeSchema");
const {ServiceData,ServiceTypesData,ServiceAchivementsData} = require("../models/serviceSchema");


 const populateFn = async (dbName) =>{
    try{
        
            let StoreName = dbName.map((val)=>{
                return val._id.toString();
            })
    }
    catch(err){
        console.log(err)
    }
}

module.exports = populateFn