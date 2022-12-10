const AdminData = require("../models/adminSchema")
const SiteData = require("../models/settingsSchema")
const deletefile = require("./deleteController")


const siteSettingsPublicGet = async (req,res) =>{
    try{
        const contactdata = await SiteData.findOne({userID : req.headers['user-id']})

        res.status(200).json({status:true, message:'success',data:contactdata})

    }
    catch(err){
        res.send(err)
    }
}


const siteSettingsGet = async (req,res) =>{
    try{

        const fetchSite = await SiteData.findOne({userID : req.rootId})
        if(fetchSite){
            res.status(200).json({status:true,message:'success',data:fetchSite})
        }
        else{
            res.status(400).json({status:false,message:'failed'})
        }
    }   
    catch(err){
        res.send(err)
    }
}

const siteSettingsPost = async (req,res) =>{
    try{

        const countUser = await SiteData.findOne({userID : req.rootId}).countDocuments();
        console.log(countUser)
        if(countUser <= 0){
            console.log('ok')
            const createSettings = new SiteData(req.body);
            await createSettings.save();

            res.status(200).json({status:true,message:'success',data:createSettings})
        }
        else{
         
            res.status(400).json({status:false,message:'failed'})
        }
    }   
    catch(err){
        res.send(err)
    }
}

const siteSettingsPut = async (req,res) =>{
    try{

        console.log(req.body,'called ==========')

        const fetchSite = await SiteData.findOne({userID : req.rootId})
        if(fetchSite){
            let file1;
            if(req.file) {
                file1 = process.env.UPLOADFILE+req.file.filename;
                if(fetchSite.site_favicon) {deletefile(fetchSite.site_favicon)}
            }
           fetchSite.site_title = req.body.site_title || fetchSite.site_title , 
           fetchSite.site_discription = req.body.site_discription || fetchSite.site_discription , 
           fetchSite.site_estd = req.body.site_estd || fetchSite.site_estd , 
           fetchSite.site_phone = req.body.site_phone || fetchSite.site_phone , 
           fetchSite.site_address = req.body.site_address || fetchSite.site_address , 
           fetchSite.site_email = req.body.site_email || fetchSite.site_email , 
           fetchSite.site_gmap = req.body.site_gmap || fetchSite.site_gmap , 
           fetchSite.site_favicon = file1 || fetchSite.site_favicon , 
           fetchSite.site_copyright_name = req.body.site_copyright_name || fetchSite.site_copyright_name , 
           fetchSite.site_copyright_link = req.body.site_copyright_link || fetchSite.site_copyright_link , 
           fetchSite.site_font_family = req.body.site_font_family || fetchSite.site_font_family , 
           fetchSite.site_font_color = req.body.site_font_color || fetchSite.site_font_color , 
           fetchSite.site_theme_color1 = req.body.site_theme_color1 || fetchSite.site_theme_color1 , 
           fetchSite.site_theme_color2 = req.body.site_theme_color2 || fetchSite.site_theme_color2 , 
           fetchSite.site_theme_color3 = req.body.site_theme_color3 || fetchSite.site_theme_color3 , 
           fetchSite.site_theme_color4 = req.body.site_theme_color4 || fetchSite.site_theme_color4 , 
           fetchSite.userID = req.rootId || fetchSite.userID 

           await fetchSite.save();

           res.status(200).json({status:true,message:'success',data:fetchSite})
        }
        else{
            res.status(400).json({status:false,message:'failed'})
        }
    }   
    catch(err){
        res.send(err)
    }
}


module.exports = {siteSettingsPublicGet,siteSettingsGet,siteSettingsPost,siteSettingsPut}