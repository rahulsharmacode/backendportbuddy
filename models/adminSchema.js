
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const adminSchema = new mongoose.Schema({

    name: String,
    email : String,
    password: String,
    phone: Number,
    dob : String,
    degination : {
        type : String,
        default : 'Student'
    },
    image : String,
    country : String,
    freelancer : {
        type : Boolean,
        default : false
    },
    cv : String,
    super_admin : {
        type : Boolean,
        default : false
    },
    activation : {
        type : Boolean,
        default : true
    },
    roles : Array,
    social : [{type : mongoose.Schema.Types.ObjectId , ref : 'social_page'}],
    tokens : [
        {
            token : {
                type:String
            }
        }
    ],
    forget_token : String,
    forget_token_expire : String,
    verified : {
        type : Boolean,
        default : false
    },
})


adminSchema.methods.generateAuthToken  = async function(){
    const user = this;
    const token = jwt.sign( { _id : user._id} , process.env.SECRET_KEY);
    user.tokens  = user.tokens.concat({token:token});
    await user.save();
    return token;
}


const AdminData = mongoose.model('adminpage',adminSchema);
module.exports = AdminData;