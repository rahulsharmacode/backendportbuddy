
const { default: mongoose } = require("mongoose");
const HomeData = require("../models/homeSchema");
const SocialData = require("../models/socialSchema");
const deletefile = require("./deleteController");


const homeGet = async (req,res) =>{
    try{
        // const fetchHome = await HomeData.find().populate({path : 'social'});
        const fetchHome = await HomeData.aggregate([
            {
                $match : {userID : mongoose.Types.ObjectId(req.headers['user-id'])}
            },
            
            {
            $lookup : {
                from : SocialData.collection.name,
                let : {newuserID : '$userID'},
                pipeline : [{
                    $match : {
                        $expr : {
                            $and : [{$eq :  ['$userID' , '$$newuserID'] }]
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
        }
    ]);

        if(fetchHome.length){
            res.status(200).json({status:true, message:'success',data:fetchHome , user : req.rootUser})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        return res.status(404).json({status:false, message:'failed', error:err})

    }
}

const homePost = async (req,res) =>{
    try{
        console.log(req.body)
        const count = await HomeData.countDocuments();
        console.log(count , '=======page count=========')
        if(count>0){
            return res.status(404).json({status:false, message:'failed to create duplicate data'})
        }
        else{
            
    
            const newHome = new HomeData(req.body);

            const createHome = await newHome.save();
            if(createHome){
                res.status(200).json({status:true, message:'success',data:createHome})
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

const homePut = async (req,res) =>{

    try{
        
        let updateHome = await HomeData.findOne({userID : req.rootId});
        if(updateHome){

            console.log('user' , updateHome)
            let file1;
            
            if(req.file){
                file1 = process.env.UPLOADFILE+req.file.filename;
                if(updateHome.profile_image) {
                    deletefile(updateHome.profile_image);
                }
            }

            console.log(file1 , '===file1===');

            updateHome.title= req.body.title || updateHome.title ;
            updateHome.name= req.body.name || updateHome.name ;
            updateHome.discription= req.body.discription || updateHome.discription ;
            updateHome.profile_image= file1 || updateHome.profile_image ;
            // updateHome.social = socialStore || updateHome.social;
            updateHome.slug= req.body.slug || updateHome.slug ;
            updateHome.meta_title= req.body.meta_title || updateHome.meta_title ;
            updateHome.meta_keyword= req.body.meta_keyword || updateHome.meta_keyword ;
            updateHome.meta_discription= req.body.meta_discription || updateHome.meta_discription ;

            console.log('===phase 2===')

           let datasave =  await updateHome.save();
           if(datasave){
            res.status(200).json({status:true, message:'update success'})
           }
           else{
            res.status(405).json({status:false, message:'failed to save'})
           }

        }
        else{
           return res.status(404).json({status:false, message:'failed'})
        }
    }
    catch(err){

        return res.status(400).json({status:false, message:'failed', error : err})


    }
}

module.exports = {homeGet,homePost,homePut};