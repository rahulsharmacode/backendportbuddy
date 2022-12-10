const ContactData = require("../models/contactSchema");
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");
const SiteData = require("../models/settingsSchema");



const contactGet = async (req,res) =>{
    try{
        const fetchContact = await ContactData.find({userID : req.rootId});
        const countContact = await ContactData.countDocuments();
        if(fetchContact){
            res.status(200).json({status:true, message:'success',total_data:countContact,data:fetchContact})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const contactPost = async (req,res) =>{
    try{
  
            // console.log(req.body , req.headers['user-id'])
            // let uid =  mongoose.Types.ObjectId()

            console.log(req.body , 'called')
            const newContact = new ContactData({
                title: req.body.title,
                name : req.body.name,
                email : req.body.email,
                subject : req.body.subject,
                discription : req.body.discription,
                userID : req.headers['user-id']
                
            })

            const createContact = await newContact.save();
            if(createContact){
                // console.log(req.rootUser.name, 'name ok req.body.emailreq.body.email')
                let mailStatus = await MailService({
                    subject : req.body.subject || 'check subject with reqbody 01',
                    text : 'check test',
                    mailEmail : req.body.email,
                    AdminName : req.headers['user-name'] || 'CMS Admin',
                    mailHTML : req.body.discription


                });
                console.log(mailStatus)

                res.status(200).json({status:true, message:'success', mail_response :mailStatus.response ,data:createContact})

        
            }
            else{
                return res.status(400).json({status:false, message:'failed to create'})
            }
    

    }
    catch(err){
        res.send(err)
    }
}

const contactMailNow = async (req,res) =>{
    try{
  
            console.log(req.body , 'called')
 
                let mailStatus = await MailService({
                    subject : req.body.subject,
                    text : req.body.message,
                    mailEmail : req.body.email,
                    AdminName : req.rootUser.name || "",
                    mailHTML : `${req.body.message}`,
                });
                console.log(mailStatus)
                res.status(200).json({status:true, message:'success', mail_response :mailStatus.response})

    }
    catch(err){
        res.send(err)
    }
}

const contactDelete = async (req,res) =>{
    try{
        const deleteContact = await ContactData.findByIdAndDelete({_id:req.params.id});
        if(deleteContact){
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



const MailService = async ( mailData)=>{
    try{

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
            from: `"${mailData.AdminName}" <${process.env.MAIL_ID}>`, // sender address
            to: mailData.mailEmail, // list of receivers
            subject: mailData.subject, // Subject line
            text: mailData.text, // plain text body
            html: mailData.mailHTML, // html body
        });
//   res.status(200).json({status:true ,message : 'success' , data :info })
return info
    }
    catch(err){
        res.send(err)
    }
}


module.exports = {contactGet,contactPost,contactDelete,MailService, contactMailNow};