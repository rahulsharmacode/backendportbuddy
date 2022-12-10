const jwt = require('jsonwebtoken');
const AdminData = require('../models/adminSchema');

const authentication = async (req,res,next)=>{
    try{
        const token = req.headers['auth-token'];
        console.log(token, 'token recived=========')
        const verifyToken = jwt.verify(token , process.env.SECRET_KEY);

        if(!verifyToken){
            return res.status(404).json({status:false, message:'token verification failed'});
        }

        else{
        const rootUser = await AdminData.findById({_id:verifyToken._id})
        req.rootUser = rootUser;
        req.rootId = verifyToken._id;
        req.token = token
        }
        next();
    }
    catch(err){
        return res.status(404).json({status:false, message:'token verification failed' , error : err});
    }
}

module.exports = authentication;