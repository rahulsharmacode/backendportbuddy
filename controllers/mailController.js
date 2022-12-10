const nodemailer = require("nodemailer");


// const MailBox = async ( mailData)=>{
//     try{
//         console.log(mailData , 'mailDatamailDatamailDatamailData')
//         let transporter = nodemailer.createTransport({
//           host: process.env.MAIL_HOST,
//           port: 465,
//           secure: true, // true for 465, false for other ports
//           auth: {
//             user: process.env.MAIL_ID, // generated ethereal user
//             pass: process.env.MAIL_PASS, // generated ethereal password
//           },
//         });

//           // send mail with defined transport object
//         let info = await transporter.sendMail({
//             from: `"${mailData.AdminName}" <${process.env.MAIL_ID}>`, // sender address
//             to: mailData.mailEmail, // list of receivers
//             subject: mailData.subject, // Subject line
//             text: mailData.text, // plain text body
//             html: mailData.mailHTML, // html body
//         });
// //   res.status(200).json({status:true ,message : 'success' , data :info })
// return info
//     }
//     catch(err){
//         return err
//     }
// }


const mailBox = async (holder)=>{
    try{
        console.log(holder,'clicked')
    }
    catch(err){
        console.log('err')
        
    }
}

module.exports = mailBox