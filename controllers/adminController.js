const AdminData = require("../models/adminSchema");
const randomstring = require('randomstring');
const nodemailer = require('nodemailer')
const { MailService } = require("./contactController");
const deletefile = require("./deleteController");
const { default: mongoose } = require("mongoose");
const { PortfolioData } = require("../models/protfolioSchema");
const BlogsData = require("../models/blogsSchema");
const HomeData = require("../models/homeSchema");
const { ServiceData } = require("../models/serviceSchema");
const AboutData = require("../models/aboutSchema");
const SiteStatsData = require("../models/seoSchema");
const SiteData = require("../models/settingsSchema");
const { CmsDevData } = require("../models/communitySchema");
const userfoldercreate = require("./fileadder");

const login = async (req,res)=>{
    try{
        let {email,password} = req.body;
        if(!email || !password){
            return res.status(404).json({status:false, message:'email and password are required'});
        }
        else{
            let findEmail = await AdminData.findOne({email:email});
            if(findEmail){

                if(findEmail.password !==password){
                return res.status(406).json({status:false, message:`credentail didn't match`});
                }
                else{
                let token = await findEmail.generateAuthToken();
                res.status(200).json({status:true, message:`login success` , userID :findEmail._id, remember_state:req.body.rem , token : token});
                }
            }
            else{
            return res.status(405).json({status:false, message:`credentail didn't match`});
            }
        }
    }
    catch(err){
        res.send(err)
    }
}

const register = async (req,res)=>{
    try{
        let { email,password , cpassword , secretkey} = req.body;
        console.log(req.body)
        if(!email || !password|| !cpassword || !secretkey){
            return res.status(400).json({status:false, message:'some fields are missing'});
        }
  
        if(password !== cpassword){
            return res.status(404).json({status:false, message:`password & confirm password didn't match`});
        }

        else{
            let findEmail = await AdminData.findOne({email:email});
            if(findEmail){
                return res.status(405).json({status:false, message:`email already registred, try new email`});
            }

            if(process.env.SECRET_AUTH !== secretkey){
                return res.status(405).json({status:false, message:`Activation key didn't matched`});
            }

            else{
                let createAdmin  = new AdminData(req.body);
                await createAdmin.save();

                console.log(createAdmin , createAdmin._id , 'createAdmincreateAdmin')
                createUserOtherPages(createAdmin._id);

                let info =  ServiceWelcomeMail(createAdmin._id , createAdmin.email);

                let fileres = userfoldercreate(createAdmin._id);

                res.status(200).json({status:true, message:`account created`,info , fileres , activation_key : createAdmin._id});
                
            }
        }
    }
    catch(err){
        res.send(err)
    }
}

const forgetpassword  = async (req,res) =>{
    try{
        const {email} = req.body;

        if(!email) {
            return res.status(404).json({status:false , message:'email address is required'})
        }
        else{
            const validEmail = await AdminData.findOne({email})
            if(validEmail) {
                console.log('stage- 01')
                const ftoken = randomstring.generate();
                validEmail.forget_token = ftoken;
                const expireTime = new Date().getTime()+300*1000;
                validEmail.forget_token_expire = expireTime
               let saveForget =  await validEmail.save();
                
                if(saveForget) {
                   let info =  ServiceMail(ftoken, email ,expireTime, req.headers['base-url'])
                    res.status(200).json({status:true , message:'email address ' , ftoken : ftoken , info})
                }
            }
            else{
            return res.status(404).json({status:false , message:'email address not found'})
            }
        }
    }
    catch(err){
        res.send(err)
    }
}

const resetpassword = async (req,res) =>{
    try{

        console.log(req.body , 'eq.boeq.boeq.boeq.boeq.bo')
        const token = req.params.token;
        const currentTime = new Date().getTime();

        const findAccount = await AdminData.findOne({forget_token:token})

        if(findAccount){
            if(findAccount.forget_token_expire - currentTime > 0){
                findAccount.password = req.body.password;
                findAccount.forget_token = null;
                findAccount.forget_token_expire = null;
                findAccount.save();
                return res.status(200).json({status:true , message:'password reset success'})
            }
        }
        else{
            return res.status(404).json({status:false , message:'token is not valid'})
            
        }
    }
    catch(err){
        res.send(err)
    }
}


const adminMyAccount = async (req,res)=>{
    try{
            const provideAccount = await AdminData.aggregate([{
                $match : { _id : mongoose.Types.ObjectId(req.rootId)}
                
            },
            {
                $project : {
                    password : 0,
                    tokens:0,
                    forget_token : 0,
                    forget_token_expire : 0,
                    __v : 0
                    
                }
            }
        ])

        res.status(200).json({status:true , message: 'success' , data:provideAccount})
    }
    catch(err){
        res.send(err)
    }
}

const adminUpdate = async (req,res)=>{
    try{
            let {name , email,password , cpassword ,dob , phone, country , freelancer , degination  } = req.body;
            let findUser = await AdminData.findOne({_id:req.rootId});

            console.log(findUser , req.rootId)
            
            if(password !== cpassword){
                return res.status(404).json({status:false, message:`password & confirm password didn't match`});
            }
            let file1;
            if(req.file){
                file1 = process.env.UPLOADFILE+req.file.filename;
                if(findUser.image){deletefile(findUser.image)}
            }

            console.log('phase 2')

           
            if(email){
                console.log('phase 3')

                let checkEmailAvability = await AdminData.findOne({email:email});
                console.log(checkEmailAvability , 'checkEmailAvability')
                if(checkEmailAvability.email != req.rootUser.email){
                    return res.status(405).json({status:false, message:`email already been used`});
                }
            }
            
            else{
                console.log('phase 4')
                
                findUser.name = name  || findUser.name, 
                // findUser.email = email  || findUser.email, 
                findUser.password = password  || findUser.password, 
                findUser.dob = dob  || findUser.dob, 
                findUser.image = file1  || findUser.image, 
                findUser.phone  = phone  || findUser.phone,  
                findUser.country = country  || findUser.country, 
                findUser.freelancer = freelancer  || findUser.freelancer, 
                findUser.degination  = degination  || findUser.degination
                await findUser.save();
                res.status(200).json({status:true, message:`account updation success`});
                
            }
    }
    catch(err){
        res.send(err)
    }
}


const accountdelete = async (req,res) =>{
    try{
        let findAcc = await AdminData.findById({_id : req.params.id});
        if(findAcc){
        
            if(req.rootUser.super_admin===true){

                const newAdminpage = await AdminData.findOneAndDelete({
                    _id : req.params.id
                });
                if(newAdminpage){
                    console.log(newAdminpage , 'page status Deletion')
                }
                else{
                    console.log(newAdminpage , 'page status not Deletion')
                }

                const newHomepage = await HomeData.findOneAndDelete({
                    userID : mongoose.Types.ObjectId(req.params.id)
                });
                if(newHomepage){
                    console.log(newHomepage , 'page status Deletion')
                }
                else{
                    console.log(newHomepage , 'page status not Deletion')
                }
        
        
                const newPortfoliopage = await PortfolioData.findOneAndDelete({
                    userID : mongoose.Types.ObjectId(req.params.id)
                });
                if(newPortfoliopage){
                    console.log(newPortfoliopage , 'page status newd')
                }
                else{
                    console.log(newPortfoliopage , 'page status not newd')
                }
        
        
                const newBlogpage = await BlogsData.findOneAndDelete({
                    userID : mongoose.Types.ObjectId(req.params.id)
                });
                if(newBlogpage){
                    console.log(newBlogpage , 'page status newd')
                }
                else{
                    console.log(newBlogpage , 'page status not newd')
                }
        
        
        
                const newServicepage = await ServiceData.findOneAndDelete({
                    userID : mongoose.Types.ObjectId(req.params.id)
                });
                if(newServicepage){
                    console.log(newServicepage , 'page status newd')
                }
                else{
                    console.log(newServicepage , 'page status not newd')
                }
        
        
                const newAboutpage = await AboutData.findOneAndDelete({
                    userID : mongoose.Types.ObjectId(req.params.id)
                });
                if(newAboutpage){
                    console.log(newAboutpage , 'page status newd')
                }
                else{
                    console.log(newAboutpage , 'page status not newd')
                }
        
        
                const newStatspage = await SiteStatsData.findOneAndDelete({
                    userID : mongoose.Types.ObjectId(req.params.id),
                });
                if(newStatspage){
                    console.log(newStatspage , 'page status newd')
                }
                else{
                    console.log(newStatspage , 'page status not newd')
                }
        
        
                
                const newSitepage = await SiteData.findOneAndDelete({
                    userID : mongoose.Types.ObjectId(req.params.id)
                });
                if(newSitepage){
                    console.log(newSitepage , 'page status Deletion')
                }
                else{
                    console.log(newSitepage , 'page status not Deletion')
                }
        
        
                const newDevToolpage = await CmsDevData.findOneAndDelete({
                    userID : mongoose.Types.ObjectId(req.params.id)
                });
                if(newDevToolpage){
                    console.log(newDevToolpage , 'page status Deletion')
                }
                else{
                    console.log(newDevToolpage , 'page status not Deletion')
                }
        
    
                res.status(200).json({
                    status : true,
                    message : 'deletion success',
                    data: 'all'
                })
            }
            else{
                res.status(400).json({
                    status : false,
                    message : 'no  access',
                })
            }


        }
    }
    catch(err){
        console.log(err)
    }
}


module.exports = {login,register,forgetpassword,resetpassword, adminUpdate,adminMyAccount,accountdelete}  ;


const ServiceMail = async (ftoken, email ,expireTime,baseUrl) =>{
    try{
        console.log(ftoken, email ,expireTime,baseUrl)
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.MAIL_ID, // generated ethereal user
              pass: process.env.MAIL_PASS, // generated ethereal password
            },
          });
            // send mail with defined transport object
          let info = await transporter.sendMail({
              from: `"Password Reset" <${process.env.MAIL_ID}>`, // sender address
              to: email, // list of receivers
              subject: "You have requested for CMS Password reset", // Subject line
              text: "ok text", // plain text body
              html: `Reset Link : <a href=${baseUrl}/reset-password/${ftoken}>${baseUrl}/reset-password/${ftoken}</a> expires in ${expireTime}ms `, // html body
          });
          return info
    }

    catch(err){
        console.log(err)
    }
}


const ServiceWelcomeMail = async (actkey , email) =>{
    try{
        console.log(actkey , email)
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.MAIL_ID, // generated ethereal user
              pass: process.env.MAIL_PASS, // generated ethereal password
            },
          });
            // send mail with defined transport object
          let info = await transporter.sendMail({
              from: `"CMS ADMIN" <${process.env.MAIL_ID}>`, // sender address
              to: email, // list of receivers
              subject: "Activation Key for Your Portfolio Website", // Subject line
              text: "ok text", // plain text body
              html: `Hi there, <br/>
              <strong>You have successfully created you Portfolio CMS Account, now  one more steps to go:</strong> <br/>
              Activation Key : <span style="color:red;">${actkey}</span><br/>
             Steps:<br/>
             (1) Please open the .env file from Your server.<br/>
             (2) Replace old REACT_APP_ACTKEY value with your new Activation Key<br/>
             (3) Save it and refresh / restart your web server.<br/>
             (4) Reday to go.<br/><br/>

             <i> If you are facing any issue then please contact us at Email: help@codexnepal.com , thankyou! </i>
              `, // html body
          });
          return info
    }

    catch(err){
        console.log(err)
    }
}


const createUserOtherPages = async (idd) =>{
    try{
        console.log('id page creation start')
        const newHomepage = new HomeData({
            userID : idd
        });
        const createHome = await newHomepage.save();
        if(createHome){
            console.log(createHome , 'page status created')
        }
        else{
            console.log(createHome , 'page status not created')
        }


        const newPortfoliopage = new PortfolioData({
            userID : idd
        });
        const createPortfolio = await newPortfoliopage.save();
        if(createPortfolio){
            console.log(createPortfolio , 'page status created')
        }
        else{
            console.log(createPortfolio , 'page status not created')
        }


        const newBlogpage = new BlogsData({
            userID : idd
        });
        const createBlog = await newBlogpage.save();
        if(createBlog){
            console.log(createBlog , 'page status created')
        }
        else{
            console.log(createBlog , 'page status not created')
        }



        const newServicepage = new ServiceData({
            userID : idd
        });
        const createService = await newServicepage.save();
        if(createService){
            console.log(createService , 'page status created')
        }
        else{
            console.log(createService , 'page status not created')
        }


        const newAboutpage = new AboutData({
            userID : idd
        });
        const createAbout = await newAboutpage.save();
        if(createAbout){
            console.log(createAbout , 'page status created')
        }
        else{
            console.log(createAbout , 'page status not created')
        }


        const newStatspage = new SiteStatsData({
            userID : idd,
            visitor : 1,
        });
        const createStats = await newStatspage.save();
        if(createStats){
            console.log(createStats , 'page status created')
        }
        else{
            console.log(createStats , 'page status not created')
        }


        
        const newSitepage = new SiteData({
            userID : idd
        });
        const createSite = await newSitepage.save();
        if(createSite){
            console.log(createSite , 'page status created')
        }
        else{
            console.log(createSite , 'page status not created')
        }


        const newDevToolpage = new CmsDevData({
            userID : idd
        });
        const createDevTool = await newDevToolpage.save();
        if(createDevTool){
            console.log(createDevTool , 'page status created')
        }
        else{
            console.log(createDevTool , 'page status not created')
        }

        



        // const newPortfoliopage = new PortfolioData({
        //     userID : createAdmin._id
        // });
        // const createPortfolio = await newPortfoliopage.save();
        // console.log(createPortfolio , 'page status start')


        // const newBlogpage = new BlogsData({
        //     userID : createAdmin._id
        // });
        // const createBlog = await newBlogpage.save();

        // const newServicepage = new ServiceData({
        //     userID : createAdmin._id
        // });
        // const createService = await newServicepage.save();


        // const newAboutpage = new AboutData({
        //     userID : createAdmin._id
        // });
        // const createAbout = await newAboutpage.save();

    }
    catch(err){
        return err
    }
}



