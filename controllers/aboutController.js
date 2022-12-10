const { default: mongoose } = require("mongoose");
const AboutData = require("../models/aboutSchema");
const AdminData = require("../models/adminSchema");
const { SkillsData, ExperienceData, TestimonialData } = require("../models/skilllsSchema");
const SocialData = require("../models/socialSchema");
const deletefile = require("./deleteController");
const { homePut } = require("./homeController");

const aboutpageGet = async (req,res) =>{
    try{
        // const fetchabout = await AboutData.find().populate({path : 'social skills testimonials edu_exp'});

        const fetchabout = await AboutData.aggregate([
            {
                $match : {userID : mongoose.Types.ObjectId(req.headers['user-id'])}
            },
            {
                $lookup : {
                    from : SocialData.collection.name,
                    let : {uid : '$userID'},
                    pipeline : [{
                        $match : {
                            $expr : {
                                $and : [{$eq :  ['$userID' , '$$uid'] }]
                            }
                        }
                    },{
                        $project : {
                        
                            __v : 0,
                            userID : 0
                        }
                    }],
                    as : 'social_total'
                }
            },
            {
                $lookup : {
                    from : SkillsData.collection.name,
                    let : {uid : '$userID'},
                    pipeline : [{
                        $match : {
                            $expr : {
                                $and : [{$eq :  ['$userID' , '$$uid'] }]
                            }
                        }
                    },{
                        $project : {
                        
                            __v : 0,
                            userID : 0
                        }
                    }],
                    as : 'skills_total'
                }
            },
            {
                $lookup : {
                    from : ExperienceData.collection.name,
                    let : {uid : '$userID'},
                    pipeline : [{
                        $match : {
                            $expr : {
                                $and : [{$eq :  ['$userID' , '$$uid'] }]
                            }
                        }
                    },{
                        $project : {
                            __v : 0,
                            userID : 0
                        }
                    }],
                    as : 'eduexp_total'
                }
            },
            {
                $lookup : {
                    from : TestimonialData.collection.name,
                    let : {uid : '$userID'},
                    pipeline : [{
                        $match : {
                            $expr : {
                                $and : [{$eq :  ['$userID' , '$$uid'] }]
                            }
                        }
                    },{
                        $project : {
                            __v : 0,
                            userID : 0
                        }
                    }],
                    as : 'testimonial_total'
                }
            },
            {
                $lookup : {
                    from : AdminData.collection.name,
                    let : {uid : '$userID'},
                    pipeline : [{
                        $match : {
                            $expr : {
                                $and : [{$eq :  ['$_id' , '$$uid'] }]
                            }
                        }
                    },{
                        $project : {
                            __v : 0,
                            password : 0,
                            tokens : 0,
                            super_admin : 0,
                            social : 0,
                            roles : 0,
                            activation : 0
                        }
                    }],
                    as : 'profile_data'
                }
            }
        ]);


        if(fetchabout){
            res.status(200).json({status:true, message:'success',data:fetchabout})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const aboutpagePost = async (req,res) =>{
    try{
        console.log(req.body)
        const count = await AboutData.countDocuments();

        if(count>0){
            return res.status(404).json({status:false, message:'failed to create dupicate data'})
        }

        else{

            const newAboutPage = new AboutData(req.body)
            const createAboutPage = await newAboutPage.save();
            if(createAboutPage){
                res.status(200).json({status:true, message:'success',data:createAboutPage})
            }
            else{
                return res.status(400).json({status:false, message:'failed to create'})
            }

        }
    }
    catch(err){
        res.send(err)
    }
}

const aboutpagePut = async (req,res) =>{
    try{
        console.log(req.body)
        let updateAboutPage = await AboutData.findOne({userID : req.rootId});


        if(updateAboutPage){
            let file1 = null;
            if(req.file){
                file1 = process.env.UPLOADFILE+req.file.filename;
                if(updateAboutPage.profile_image) {
                    deletefile(updateAboutPage.profile_image);
                }
            }

            // let socialData = await SocialData.find().select(' _id')
            // let socialStore = socialData.map((val)=>{
            //     return val._id.toString();
            // })
            // let profilelData = await AdminData.findOne().select(' _id')
            // let profilelStore = profilelData.map((val)=>{
            //     return val._id.toString();
            // })
        //     let skillsData = await SkillsData.find().select(' _id')
        //     let skillsStore = skillsData.map((val)=>{
        //         return val._id.toString();
        //     })
        //     let edu_expData = await ExperienceData.find().select(' _id')
        //     let edu_expStore = edu_expData.map((val)=>{
        //         return val._id.toString();
        //     })
        //     let testimonialsData = await TestimonialData.find().select(' _id')
        //     let testimonialsStore;
        //     if(testimonialsData){
        //         testimonialsStore = testimonialsData.map((val)=>{
        //            return val._id.toString();
        //        })
        //    }


            updateAboutPage.title = req.body.title || updateAboutPage.title ;
            updateAboutPage.degination = req.body.degination || updateAboutPage.degination ;
            updateAboutPage.discription = req.body.discription || updateAboutPage.discription ;
            updateAboutPage.cv = req.body.cv || updateAboutPage.cv ;
            updateAboutPage.name = req.body.name || updateAboutPage.name ;
            updateAboutPage.profile_image = file1 || updateAboutPage.profile_image ;

            // updateAboutPage.profile  = profilelStore || updateAboutPage.profilelStore ;
            // updateAboutPage.social  = socialStore || updateAboutPage.social ;
            // updateAboutPage.skills  = skillsStore || updateAboutPage.skills ;
            // updateAboutPage.edu_exp  = edu_expStore || updateAboutPage.edu_exp ;
            // updateAboutPage.testimonials  = testimonialsStore || updateAboutPage.testimonials ;


            updateAboutPage.slug  = req.body.slug || updateAboutPage.slug ;
            updateAboutPage.meta_title  = req.body.meta_title || updateAboutPage.meta_title ;
            updateAboutPage.meta_keyword  = req.body.meta_keyword || updateAboutPage.meta_keyword ;
            updateAboutPage.meta_discription  = req.body.meta_discription || updateAboutPage.meta_discription ;
            updateAboutPage.userID  = req.rootId || updateAboutPage.userID ;

            await updateAboutPage.save();

            res.status(200).json({status:true, message:'update success'})
            
        }
       
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}


const skillsGet = async (req,res) =>{
    try{
        const fetchSkills = await SkillsData.find({userID : req.rootId});
        const count = await SkillsData.countDocuments();

        if(fetchSkills){
            res.status(200).json({status:true, message:'success', total_data:count, data:fetchSkills})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const skillsPost = async (req,res) =>{
    try{
        const newSkillsPage = new SkillsData({
            title: req.body.title,
            percent : req.body.percent,
            skill_type:req.body.skill_type,
            userID : req.rootId
        })

        const createSkillsPage = await newSkillsPage.save();
        if(createSkillsPage){
            res.status(200).json({status:true, message:'success',data:createSkillsPage})
        }
        else{
            return res.status(400).json({status:false, message:'failed to create'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const skillsPut = async (req,res) =>{
    try{

        let updateSkillsType = await SkillsData.updateOne({_id:req.params.id} , {
            $set : req.body
        });

        if(updateSkillsType){
            res.status(200).json({status:true, message:'success' , data:updateSkillsType })
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const skillsDelete = async (req,res) =>{
    try{
        const deleteSkills = await SkillsData.findByIdAndDelete({_id:req.params.id});

        if(deleteSkills){
            res.status(200).json({status:true, message:'deletion success'})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}


const expeduGet = async (req,res) =>{
    try{
        const fetchSkills = await ExperienceData.find({userID : req.rootId});
        const count = await ExperienceData.countDocuments();

        if(fetchSkills){
            res.status(200).json({status:true, message:'success', total_data:count, data:fetchSkills})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const expeduPost = async (req,res) =>{
    try{
        const newEduExpPage = new ExperienceData({
            company: req.body.company,
            degination : req.body.degination,
            start: req.body.start,
            end: req.body.end,
            type: req.body.type,
            userID : req.rootId,
        })

        const createEduExpPage = await newEduExpPage.save();
        if(createEduExpPage){
            res.status(200).json({status:true, message:'success',data:createEduExpPage})
        }
        else{
            return res.status(400).json({status:false, message:'failed to create'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const expeduPut = async (req,res) =>{
    try{

        let updateSkillsType = await ExperienceData.updateOne({_id:req.params.id} , {
            $set : req.body
        });

        if(updateSkillsType){
            res.status(200).json({status:true, message:'success' , data:updateSkillsType })
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const expeduDelete = async (req,res) =>{
    try{
        const deleteSkills = await ExperienceData.findByIdAndDelete({_id:req.params.id});

        if(deleteSkills){
            res.status(200).json({status:true, message:'deletion success'})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}



const testimonialGet = async (req,res) =>{
    try{
        const fetchtestimonial = await TestimonialData.find({userID : req.rootId});
        const count = await TestimonialData.countDocuments();

        if(fetchtestimonial){
            res.status(200).json({status:true, message:'success', total_data:count, data:fetchtestimonial})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const testimonialPost = async (req,res) =>{
    try{
        let file1 = null;
        if(req.file){
            file1 = process.env.UPLOADFILE+req.file.filename;
        }
        const newtestimonial = new TestimonialData({
            paragraph: req.body.paragraph,
            name :req.body.name,
            image: file1,
            degination: req.body.degination,
            userID : req.rootId
        })

        const createtestimonial = await newtestimonial.save();
        if(createtestimonial){
            res.status(200).json({status:true, message:'success',data:createtestimonial})
        }
        else{
            return res.status(400).json({status:false, message:'failed to create'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const testimonialPut = async (req,res) =>{
    try{

        let updatetestimonial = await TestimonialData.findById({_id:req.params.id});

        if(updatetestimonial){
            let file1 = null;
            if(req.file){
                file1 = process.env.UPLOADFILE+req.file.filename;
                if(updatetestimonial.image){deletefile(updatetestimonial.image)};
            }

            
            updatetestimonial.paragraph = req.body.paragraph || updatetestimonial.paragraph;
            updatetestimonial.name  =req.body.name || updatetestimonial.name;
            updatetestimonial.image = file1 || updatetestimonial.image;
            updatetestimonial.degination = req.body.degination || updatetestimonial.degination;
            await updatetestimonial.save();

            res.status(200).json({status:true, message:'updation success' , data:updatetestimonial })
        }
        else{
           return res.status(400).json({status:false, message:'updation failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const testimonialDelete = async (req,res) =>{
    try{
        const deletetestimonial = await TestimonialData.findByIdAndDelete({_id:req.params.id});

        if(deletetestimonial){
            res.status(200).json({status:true, message:'deletion success'})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}



const socialGet = async (req,res) =>{
    try{
    
        const fetchSocial = await SocialData.find({userID : req.rootId});
        const count = await SocialData.countDocuments();
     
        if(fetchSocial){
            res.status(200).json({status:true, message:'success', total_data:count, data:fetchSocial})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const socialPost = async (req,res) =>{
    try{
 
        const newSocial = new SocialData({
            icon: req.body.icon,
            link : req.body.link,
            state : req.body.state,
            userID : req.rootId
        })
        const createSocial = await newSocial.save();
        if(createSocial){
            
            res.status(200).json({status:true, message:'success',data:createSocial});
        }
        else{
            return res.status(400).json({status:false, message:'failed to create'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const socialPut = async (req,res) =>{
    try{

        let updateSocial = await SocialData.updateOne({_id:req.params.id} , {
            $set : req.body
        });

        if(updateSocial){
            res.status(200).json({status:true, message:'success' , data:updateSocial })
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const socialDelete = async (req,res) =>{
    try{
        const deleteSocial = await SocialData.findByIdAndDelete({_id:req.params.id});

        if(deleteSocial){
            res.status(200).json({status:true, message:'deletion success'})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}



module.exports = {aboutpageGet,aboutpagePost,aboutpagePut,skillsGet,skillsPost,skillsPut,skillsDelete
    ,expeduGet,expeduPost,expeduPut,expeduDelete,testimonialGet,testimonialPost,testimonialPut,testimonialDelete
    ,socialGet,socialPost,socialPut,socialDelete
}