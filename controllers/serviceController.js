// const ServiceData = require("../models/serviceSchema");

const { default: mongoose } = require("mongoose");
const {ServiceData,ServiceTypesData,ServiceAchivementsData} = require("../models/serviceSchema");
const populateFn = require("./populateController");


const servicepageGet = async (req,res) =>{
    try{
        // const fetchService = await ServiceData.find().populate({path : 'service_types achivements_type'});
        const fetchService = await ServiceData.aggregate([
            {
                $match : {userID : mongoose.Types.ObjectId(req.headers['user-id'])}
            },
            {
            $lookup : {
                from : ServiceTypesData.collection.name,
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
                as : 'service_type'
            },
         
        },
    {
        $lookup : {
            from : ServiceAchivementsData.collection.name,
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
            as : 'service_achivements'
        }
    }
    ]);

        if(fetchService){
            res.status(200).json({status:true, message:'success',data:fetchService})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const servicepagePost = async (req,res) =>{
    try{
      
        console.log(req.body)
        const count = await ServiceData.countDocuments();
        if(count>0){
            return res.status(404).json({status:false, message:'failed to create duplicate data'})
        }
        else{
       
            const newServicePage = new ServiceData(req.body)

            const createServicePage = await newServicePage.save();
            if(createServicePage){
                res.status(200).json({status:true, message:'success',data:createServicePage})
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

const servicepagePut = async (req,res) =>{
    try{
        console.log(req.body)
        let updateServicePage = await ServiceData.findOne({userID : req.rootId});
    
    //     let skillsTypeData = await ServiceTypesData.find().select(' _id')
    //     let skillsTypeStore;
    //     if(skillsTypeData){
    //         skillsTypeStore = skillsTypeData.map((val)=>{
    //            return val._id.toString();
    //        })
    //    }

    //    let achiveTypeData = await ServiceAchivementsData.find().select(' _id')
    //    let achiveTypeStore;
    //    if(achiveTypeData){
    //        achiveTypeStore = achiveTypeData.map((val)=>{
    //           return val._id.toString();
    //       })
    //   }


        if(updateServicePage){
            updateServicePage.title = req.body.title || updateServicePage.title ;

            // updateServicePage.service_types = skillsTypeStore || updateServicePage.service_types ;
            // updateServicePage.achivements_type = achiveTypeStore || updateServicePage.achivements_type ;

        
            updateServicePage.slug  = req.body.slug || updateServicePage.slug ;
            updateServicePage.meta_title  = req.body.meta_title || updateServicePage.meta_title ;
            updateServicePage.meta_keyword  = req.body.meta_keyword || updateServicePage.meta_keyword ;
            updateServicePage.meta_discription  = req.body.meta_discription || updateServicePage.meta_discription ;
            updateServicePage.userID  = req.rootId || updateServicePage.userID ;

            await updateServicePage.save();

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


const serviceTypesGet = async (req,res) =>{
    try{
        const fetchService = await ServiceTypesData.find({userID : req.rootId});
        const count = await ServiceTypesData.countDocuments();

        if(fetchService){
            res.status(200).json({status:true, message:'success', total_data:count, data:fetchService})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const serviceTypesPost = async (req,res) =>{
    try{
        const newServicePage = new ServiceTypesData({
            title: req.body.title,
            discription : req.body.discription,
            userID  : req.rootId
            
        })

        const createServicePage = await newServicePage.save();
        if(createServicePage){
            res.status(200).json({status:true, message:'success',data:createServicePage})
        }
        else{
            return res.status(400).json({status:false, message:'failed to create'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const serviceTypesPut = async (req,res) =>{
    try{

        let updateServiceType = await ServiceTypesData.updateOne({_id:req.params.id} , {
            $set : req.body
        });

        if(updateServiceType){
            res.status(200).json({status:true, message:'success' , data:updateServiceType })
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const serviceTypesDelete = async (req,res) =>{
    try{
        const deleteService = await ServiceTypesData.findByIdAndDelete({_id:req.params.id});

        if(deleteService){
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



const serviceAchivementsGet = async (req,res) =>{
    try{
        const fetchService = await ServiceAchivementsData.find({userID : req.rootId});
        const count = await ServiceAchivementsData.countDocuments();

        if(fetchService){
            res.status(200).json({status:true, message:'success', total_data:count, data:fetchService})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const serviceAchivementsPost = async (req,res) =>{
    try{
        const newServicePage = new ServiceAchivementsData({
            title: req.body.title,
            count : req.body.count,
            userID  : req.rootId
        })

        const createServicePage = await newServicePage.save();
        if(createServicePage){
            res.status(200).json({status:true, message:'success',data:createServicePage})
        }
        else{
            return res.status(400).json({status:false, message:'failed to create'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const serviceAchivementsPut = async (req,res) =>{
    try{

        let updateServiceType = await ServiceAchivementsData.updateOne({_id:req.params.id} , {
            $set : req.body
        });

        if(updateServiceType){
            res.status(200).json({status:true, message:'success' , data:updateServiceType })
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const serviceAchivementsDelete = async (req,res) =>{
    try{
        const deleteService = await ServiceAchivementsData.findByIdAndDelete({_id:req.params.id});

        if(deleteService){
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



module.exports = {servicepageGet,servicepagePost,servicepagePut,serviceTypesGet,serviceTypesPost,serviceTypesPut,serviceTypesDelete,
    serviceAchivementsGet,serviceAchivementsPost,serviceAchivementsPut,serviceAchivementsDelete
}