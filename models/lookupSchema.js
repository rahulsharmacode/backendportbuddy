const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    teacher:String,
    batch:String
})


const TeacherData = mongoose.model('teacherpage' ,teacherSchema);
module.exports = TeacherData;

const StudentSchema = new mongoose.Schema({
    name:String,
    batch:String
})


const StudentData = mongoose.model('studentpage' ,StudentSchema);
module.exports = StudentData;



const edufn = async (req,res) =>{
    try{

        const std = await StudentData.aggregate([
            {
                $lookup : {
                    // from : TeacherData.collection.name,
                    from : TeacherData.collection.name,
                    let : {techCode : "$tech"},
                    pipeline : [
                       {
                        $match : { $expr : {
                            $and : [
                               { $eq : ["$batch" , "$$techCode"]}
                            ]
                        }}
                       }
                    ],
                    as : 'anything'
                }
            }
        ])
        res.status(200).json({
            status:true,
            message:'success',
        
            data2 : std
        })

    }
    catch(err){
        console.log(err)
    }
} 

module.exports = edufn;
