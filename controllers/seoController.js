const { default: mongoose } = require("mongoose");
const AdminData = require("../models/adminSchema");
const SiteStatsData = require("../models/seoSchema");
// const SiteStatsData = require("../models/seoSchema");

const siteStatsGet = async (req,res) =>{
    try{
        const vis = await SiteStatsData.findOne({
            userID : req.rootId
        });
        const regUser = await AdminData.countDocuments();
        res.status(200).json({status:true , message:'success' , data: vis , cms_downlaod : regUser})
    }
    catch(err){
        res.send(err)
    }
}

const siteStatsPost = async (req,res) =>{
    try{
        const count  = await SiteStatsData.countDocuments();
        if(count > 0) {
        res.status(400).json({status:false , message:'failed duplacted methoed not allowed'})

        }
        else{
            const vis = new SiteStatsData({
                visitor : 1,
            });
            
            await vis.save();
            res.status(200).json({status:true , message:'success' , data: vis})
        }
    }
    catch(err){
        res.send(err)
    }
}

const siteStatsPut = async (req,res) =>{
    try{
        console.log(req.headers['user-id'])
        const vis = await SiteStatsData.findOne({
            userID : req.headers['user-id']
        });
        console.log(vis , 'visvisvisvisvisvisvis')
        vis.visitor = vis.visitor+1;
        await vis.save();
        res.status(200).json({status:true , message:'success' , data: vis})
    }
    catch(err){
        res.send(err)
    }
}



module.exports = {siteStatsGet,siteStatsPost,siteStatsPut};