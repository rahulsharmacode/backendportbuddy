const mongoose = require('mongoose');
const AdminData = require('./adminSchema');

const  SkillsSchema = new mongoose.Schema({
    title: String,
    percent : Number,
    skill_type:String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},

})

const SkillsData = mongoose.model('skills_data', SkillsSchema);



// const  programmingSkillsSchema = new mongoose.Schema({
//     title: String,
//     percent : Number,
//     skill_type:String
// })

// const ProgrammingSkillsData = mongoose.model('programming_skills_progess', programmingSkillsSchema);




// const  otherSkillsSchema = new mongoose.Schema({
//     title: String,
//     percent : Number,
// })

// const OtherSkillsData = mongoose.model('other_skills_progess', otherSkillsSchema);



// const  knowledgeSchema = new mongoose.Schema({
//     title: String,
//     percent : Number,
// })

// const KnowledgeData = mongoose.model('knowledgepage', knowledgeSchema);


// const  intrestesSchema = new mongoose.Schema({
//     title: String,
//     percent : Number,
// })

// const IntrestesData = mongoose.model('intrestespage', intrestesSchema);



// const  educationSchema = new mongoose.Schema({
//     school: String,
//     degree : Number,
//     start: String,
//     end: String
// })

// const EducationData = mongoose.model('educationpage', educationSchema);


// const  experienceSchema = new mongoose.Schema({
//     company: String,
//     degination : Number,
//     start: String,
//     end: String
// })

// const ExperienceData = mongoose.model('experiencepage', experienceSchema);



const eduexpSchema = new mongoose.Schema({
    company: String,
    degination : String,
    start: String,
    end: String,
    type: String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},
})

const ExperienceData = mongoose.model('edu_exp_page', eduexpSchema);




const  testimonialSchema = new mongoose.Schema({
    paragraph: String,
    name : String,
    image: String,
    degination: String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : AdminData},
},
{
    timeseries  : true
})

const TestimonialData = mongoose.model('testimonials_page', testimonialSchema);


module.exports = {ExperienceData,TestimonialData,SkillsData}