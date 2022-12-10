const { default: mongoose } = require("mongoose");
const AdminData = require("../models/adminSchema");
const {CommunitypostData,CommunitypageData} = require("../models/communitySchema");
const deletefile = require("./deleteController");




const communityPageGet = async (req,res) =>{
    try{
            let findCommnunityPage = await CommunitypageData.find();
            if(findCommnunityPage){
                res.status(200).json({status:true,message:'success',data:findCommnunityPage})
            }
            else{
                res.status(400).json({status:false,message:'failed'})
            }
    }
    catch(err){
        res.send(err)
    }
}
const communityPagePost = async (req,res) =>{
    try{

        if(req.rootUser.super_admin === true){
            let count = await CommunitypageData.countDocuments();
            if(count>0){
             res.status(404).json({status:false,message:'duplicate methode error'})
            }
            else{
             let newCommunityPage = await CommunitypageData(req.body);
             await newCommunityPage.save();
             res.status(200).json({status:true,message:'success',data:newCommunityPage})
            }
        }
        
          

           else{
            return res.status(404).json({status:false, message:'access denied'})
         }
    }
    catch(err){
        res.send(err)
    }
}

const communityPagePut = async (req,res) =>{
    try{

        if(req.rootUser.super_admin === true){
            let communityData = await CommunitypageData.findOne();
            if(communityData){
                communityData.title = req.body.title || communityData.title;
                communityData.paragraph = req.body.paragraph || communityData.paragraph;
                communityData.state = req.body.state || communityData.state;
                await communityData.save();
                res.status(200).json({status:true,message:'updation success',data:communityData})
            }
            else{
                res.status(400).json({status:false,message:'failed'})
            }
        }
        else{
           return res.status(404).json({status:false, message:'access denied'})
        }

           
           
    }
    catch(err){
        res.send(err)
    }
}






const communityPostGet = async (req,res) =>{
    try{
            let findCommnunityPost = await CommunitypostData.aggregate([
                {$lookup : {
                    from : AdminData.collection.name,
                    let : {uid : "$userID"},
                    pipeline : [
                    
                    {
                        $match : {
                            $expr : {
                                $and : [{
                                    $eq : ["$_id" , "$$uid"]
                                }]
                            }
                        }
                    },{
                        $project : {
                        
                            __v : 0,
                            email : 0,
                            forget_token : 0,
                            tokens : 0,
                            password : 0,
                            social : 0,
                            forget_token_expire : 0
                        }
                    }
                ],
                    
                    as : 'posted_by'
                }}
                ,
                    {
                        $sort : {
                            createdAt : -1
                        }
                    },
                    
            ]);

            if(findCommnunityPost){
                res.status(200).json({status:true,message:'success',data:findCommnunityPost})
            }
            else{
                res.status(400).json({status:false,message:'failed'})
            }
    }
    catch(err){
        res.send(err)
    }
}

const communityPostGetUser = async (req,res) =>{
    try{
        // console.log(req.headers['user-id'])
            let findCommnunityPost = await CommunitypostData.aggregate([
                {
                    $match : {
                        userID : mongoose.Types.ObjectId(req.rootId)
                    }
                },
                {$lookup : {
                    from : AdminData.collection.name,
                    let : {uid : "$userID"},
                    pipeline : [{
                        $match : {
                            $expr : {
                                $and : [{
                                    $eq : ["$_id" , "$$uid"]
                                }]
                            }
                        }
                    },{
                        $project : {
                        
                            __v : 0,
                            email : 0,
                            forget_token : 0,
                            tokens : 0,
                            password : 0,
                            social : 0,
                            forget_token_expire : 0
                        }
                    }],
                    as : 'posted_by'
                }}
            ]);

            if(findCommnunityPost){
                res.status(200).json({status:true,message:'success',data:findCommnunityPost})
            }
            else{
                res.status(400).json({status:false,message:'failed'})
            }
    }
    catch(err){
        res.send(err)
    }
}

const communityPostPost = async (req,res) =>{
    try{
            let file1;
            if(req.file) {
                file1 = process.env.UPLOADFILE+req.file.filename;
            }

            

            let findCommnunityPost = new CommunitypostData({
                post_title : req.body.post_title,
                post_discription :req.body.post_discription,
                post_image : file1,
                userID : req.rootId
            });
            await findCommnunityPost.save()

            if(findCommnunityPost){
                res.status(200).json({status:true,message:'success',data:findCommnunityPost})
            }
            else{
                res.status(400).json({status:false,message:'failed'})
            }
    }
    catch(err){
        res.send(err)
    }
}

const communityPostPut = async (req,res) =>{
    try{
            const findPost = await CommunitypostData.findOne({_id:req.params.id}) 
            console.log(findPost)
            if(findPost){
                let file1;
                if(req.file) {
                    file1 = process.env.UPLOADFILE+req.file.filename;
                    if(findPost.post_image) {deletefile(findPost.post_image)}
                }
                console.log(file1)
                  findPost.post_title = req.body.post_title || findPost
                  findPost.post_discription = req.body.post_discription || findPost.post_discription
                  findPost.post_image = file1 || findPost.post_image
                  findPost.upvote = req.body.upvote || findPost.upvote
                  findPost.downvote = req.body.downvote || findPost.downvote
                  findPost.trending = null || findPost.trending
             
                await findPost.save()
                res.status(200).json({status:true,message:'updation success',data:findPost})
              
            }
            
            else{
                res.status(400).json({status:false,message:'failed'})
            }
    }
    catch(err){
        res.send(err)
    }
}

const communityPostDelete = async (req,res) =>{
    try{
            const deletePost = await CommunitypostData.findByIdAndDelete({_id:req.params.id}) 
            if(deletePost){
                res.status(200).json({status:true,message:'deletion success'})
            }
            
            else{
                res.status(400).json({status:false,message:'failed'})
            }
    }
    catch(err){
        res.send(err)
    }
}


const communityPostLike = async (req,res) =>{
    try{
            const findPost = await CommunitypostData.findOne({_id:req.params.id}) 
            console.log(findPost , 'findd')
            if(findPost){

                if(findPost.upvote.filter(like => like.user.toString () === req.rootId).length > 0){
                    return res.status(206).json({status:true,message:'already liked'})
                }
                else{
                    findPost.upvote.unshift({user :  req.rootId})   
                }

                await findPost.save()
                res.status(200).json({status:true,message:'updation success',data:findPost})
              
            }
            
            else{
                res.status(400).json({status:false,message:'failed'})
            }
    }
    catch(err){
        res.send(err)
    }
}

const communityPostdisLike = async (req,res) =>{
    try{
            const findPost = await CommunitypostData.findOne({_id:req.params.id}) 
            console.log(findPost , 'findd')
            if(findPost){

                if(findPost.upvote.filter(like => like.user.toString () === req.rootId).length === 0){
                    return res.status(400).json({status:true,message:'post hasnot been liked'})
                }

                const removeIndex = findPost.upvote.map((like)=>{
                    like.user.toString()
                }).indexOf(req.rootId)
                findPost.upvote.splice(removeIndex , 1);
               

                await findPost.save()
                res.status(200).json({status:true,message:'updation success',data:findPost})
              
            }
            
            else{
                res.status(400).json({status:false,message:'failed'})
            }
    }
    catch(err){
        res.send(err)
    }
}


module.exports = {communityPostGet,communityPostPost,communityPostPut,communityPostDelete,communityPostGetUser,communityPostLike,communityPostdisLike,
    communityPageGet,communityPagePost,communityPagePut
}