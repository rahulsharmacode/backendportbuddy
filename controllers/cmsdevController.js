const { CmsDevData } = require("../models/communitySchema");




const cmsDevToolGet = async (req,res) =>{
    try{
            let devtoolfind = await CmsDevData.findOne({userID : req.rootId});

            if(devtoolfind){
                res.status(200).json({status:true,message:'success',data:devtoolfind})
            }
            else{
                res.status(400).json({status:false,message:'failed'})
            }
    }
    catch(err){
        res.send(err)
    }
}



const cmsDevToolPut = async (req,res) =>{
    try{
            let findDevTool = await CmsDevData.findOne({userID : req.rootId});
            if(findDevTool){
                findDevTool.web_theme_pri = req.body.web_theme_pri  || findDevTool.web_theme_pri,
                findDevTool.web_theme_sec = req.body.web_theme_sec  || findDevTool.web_theme_sec,
                findDevTool.cms_theme_pri = req.body.cms_theme_pri  || findDevTool.cms_theme_pri,
                findDevTool.cms_theme_sec = req.body.cms_theme_sec  || findDevTool.cms_theme_sec,
                findDevTool.fontfamily = req.body.fontfamily  || findDevTool.fontfamily,
                findDevTool.btnpadx  = req.body.btnpadx  || findDevTool.btnpadx,
                findDevTool.btnpady  = req.body.btnpady  || findDevTool.btnpady,
                findDevTool.btnbg  = req.body.btnbg  || findDevTool.btnbg,
                findDevTool.btntx  = req.body.btntx  || findDevTool.btntx,
                findDevTool.btnhovbg  = req.body.btnhovbg  || findDevTool.btnhovbg,
                findDevTool.btnhovtx  = req.body.btnhovtx  || findDevTool.btnhovtx,
                findDevTool.btnsd1  = req.body.btnsd1  || findDevTool.btnsd1,
                findDevTool.btnsd2  = req.body.btnsd2  || findDevTool.btnsd2,
                findDevTool.btnsd3  = req.body.btnsd3  || findDevTool.btnsd3,
                findDevTool.btnsd4  = req.body.btnsd4  || findDevTool.btnsd4,
                findDevTool.btnradi  = req.body.btnradi  || findDevTool.btnradi,
                findDevTool.btnbd  = req.body.btnbd  || findDevTool.btnbd,
                findDevTool.state = req.body.state  || findDevTool.state,
                
                await findDevTool.save()
                res.status(200).json({status:true,message:'updation success',data:findDevTool})
            }
            
            else{
                res.status(400).json({status:false,message:'failed'})
            }
    }
    catch(err){
        res.send(err)
    }
}


module.exports = {cmsDevToolGet,cmsDevToolPut}