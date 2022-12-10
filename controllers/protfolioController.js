
const { default: mongoose } = require("mongoose");
const {PortfolioData,PortfolioClientData,PortfolioGalleryData} = require("../models/protfolioSchema");
const deletefile = require("./deleteController");

const portfoliopageGet = async (req,res) =>{
    try{
        // const fetchPortfolio = await PortfolioData.find().populate({path : 'projects_types gallery'});
        const fetchPortfolio = await PortfolioData.aggregate([
            {
                $match : {userID : mongoose.Types.ObjectId(req.headers['user-id'])}
            },
            {
            $lookup : {
                from : PortfolioClientData.collection.name,
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
                as : 'client_total'
            },
         
        },
    {
        $lookup : {
            from : PortfolioGalleryData.collection.name,
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
            as : 'gallery_total'
        }
    }
    ]);

        if(fetchPortfolio){
            res.status(200).json({status:true, message:'success',data:fetchPortfolio})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const portfoliopagePost = async (req,res) =>{
    try{
      
        console.log(req.body)
        const count = await PortfolioData.countDocuments();
        if(count>0){
            return res.status(404).json({status:false, message:'failed to create duplicate data'})
        }
        else{
       
            const newPortfolioPage = new PortfolioData(req.body)

            const createPortfolioPage = await newPortfolioPage.save();
            if(createPortfolioPage){
                res.status(200).json({status:true, message:'success',data:createPortfolioPage})
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

const portfoliopagePut = async (req,res) =>{
    try{
        console.log(req.body)
        let updatePortfolioPage = await PortfolioData.findOne({userID : req.rootId});
        console.log(updatePortfolioPage, 'updatePortfolioPage' , req.body.title)

    //     let clientTypeData = await PortfolioClientData.find().select(' _id')
    //     let clientypeStore;
    //     if(clientTypeData){
    //         clientypeStore = clientTypeData.map((val)=>{
    //            return val._id.toString();
    //        })
    //    }

    //    let galleryTypeData = await PortfolioGalleryData.find().select(' _id')
    //    let galleryTypeStore;
    //    if(galleryTypeData){
    //        galleryTypeStore = galleryTypeData.map((val)=>{
    //           return val._id.toString();
    //       })
    //   }


        if(updatePortfolioPage){
            updatePortfolioPage.title = req.body.title || updatePortfolioPage.title ;
        
            // updatePortfolioPage.projects_types = clientypeStore || updatePortfolioPage.projects_types ;
            // updatePortfolioPage.gallery = galleryTypeStore || updatePortfolioPage.gallery ;

            updatePortfolioPage.slug  = req.body.slug || updatePortfolioPage.slug ;
            updatePortfolioPage.meta_title  = req.body.meta_title || updatePortfolioPage.meta_title ;
            updatePortfolioPage.meta_keyword  = req.body.meta_keyword || updatePortfolioPage.meta_keyword ;
            updatePortfolioPage.meta_discription  = req.body.meta_discription || updatePortfolioPage.meta_discription ;
            updatePortfolioPage.userID  = req.rootId || updatePortfolioPage.userID ;

            await updatePortfolioPage.save();

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



const portfolioClientGet = async (req,res) =>{
    try{
        const fetchPortfolioClient = await PortfolioClientData.find({userID : req.rootId});
        const countData = await PortfolioClientData.find({userID : req.rootId}).countDocuments();

        if(fetchPortfolioClient){
            res.status(200).json({status:true, message:'success',total_data:countData,data:fetchPortfolioClient})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const portfolioClientPost = async (req,res) =>{
    try{
        let file1 = null;
        if(req.file){
            file1 = process.env.UPLOADFILE+req.file.filename;
        }
        const newPortfolioClient = new PortfolioClientData({
            title: req.body.title,
            image: file1,
            link: req.body.link,
            discription: req.body.discription,
            userID : req.rootId
        })

        const createPortfolioPage = await newPortfolioClient.save();
        if(createPortfolioPage){
            res.status(200).json({status:true, message:'success',data:createPortfolioPage})
        }
        else{
            return res.status(400).json({status:false, message:'failed to create'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const portfolioClientPut = async (req,res) =>{
    try{

        let findClient = await PortfolioClientData.findById({_id:req.params.id})

        if(findClient){

            let file1 = null;
            if(req.file){
                file1 = process.env.UPLOADFILE+req.file.filename;
                deletefile(findClient.image);
            }

           findClient.title =  req.body.title || findClient.title;
           findClient.image =  file1 || findClient.image;
           findClient.link =  req.body.link || findClient.link;
           findClient.discription =  req.body.discription || findClient.discription;
           await findClient.save();
           res.status(200).json({status:true, message:'updation success',data:findClient})

        }
        else{
            return res.status(400).json({status:false, message:'failed to update'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const portfolioClientDelete = async (req,res) =>{
    try{
        const deletePortfolioClient = await PortfolioClientData.findByIdAndDelete({_id:req.params.id});
        if(deletePortfolioClient){
            res.status(200).json({status:true, message:'deletion success'})
        }
        else{
            return res.status(400).json({status:false, message:'deletion failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}



const portfolioGalleryGet = async (req,res) =>{
    try{
        const fetchPortfolioClient = await PortfolioGalleryData.find({userID : req.rootId});
        const countData = await PortfolioGalleryData.countDocuments();

        if(fetchPortfolioClient){
            res.status(200).json({status:true, message:'success',total_data:countData,data:fetchPortfolioClient})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const portfolioGalleryPost = async (req,res) =>{
    try{
        let file1 = null;
        if(req.file){
            file1 = process.env.UPLOADFILE+req.file.filename;
        }
        const newPortfolioClient = new PortfolioGalleryData({
            sub: req.body.title,
            src: file1,
            link: req.body.link,
            desc: req.body.discription,
            userID : req.rootId 
        })

        const createPortfolioPage = await newPortfolioClient.save();
        if(createPortfolioPage){
            res.status(200).json({status:true, message:'success',data:createPortfolioPage})
        }
        else{
            return res.status(400).json({status:false, message:'failed to create'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const portfolioGalleryPut = async (req,res) =>{
    try{

        let findClient = await PortfolioGalleryData.findById({_id:req.params.id})

        if(findClient){

            let file1 = null;
            if(req.file){
                file1 = process.env.UPLOADFILE+req.file.filename;
                if(findClient.image){deletefile(findClient.image);}
            }

           findClient.sub =  req.body.title || findClient.title;
           findClient.src =  file1 || findClient.image;
           findClient.desc =  req.body.discription || findClient.discription;
           await findClient.save();
           res.status(200).json({status:true, message:'updation success',data:findClient})

        }
        else{
            return res.status(400).json({status:false, message:'failed to update'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const portfolioGalleryDelete = async (req,res) =>{
    try{
        const deletePortfolioClient = await PortfolioGalleryData.findOneAndDelete({_id:req.params.id});
        if(deletePortfolioClient){
            res.status(200).json({status:true, message:'deletion success'})
        }
        else{
            return res.status(400).json({status:false, message:'deletion failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}


module.exports = {portfoliopageGet,portfoliopagePost,portfoliopagePut,portfolioClientGet,portfolioClientPost,portfolioClientPut,portfolioClientDelete,
    portfolioGalleryGet,portfolioGalleryPost,portfolioGalleryPut,portfolioGalleryDelete

}