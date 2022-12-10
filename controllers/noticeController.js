const NoticeData = require("../models/notificationSchema");


const noticeGet = async (req,res) =>{
    try{
        
        const fetchNotice = await NoticeData.aggregate([
            {
                $match : {
                    state : true
                }
            }
        ]);

        const CountNotice = await NoticeData.find({state:true}).countDocuments();

        // const CountNotice = await NoticeData.aggregate([
        //     {
        //         $match : {
        //             state : true
        //         }
        //     },
        //     {
        //         $count : 'total'
        //     }
        // ]);

        if(fetchNotice){
            res.status(200).json({status:true, message:'success',data:fetchNotice, active_total : CountNotice})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const noticePut = async (req,res) =>{
    try{
        
        const addNotice = await NoticeData.findOne({
            _id:req.params.id
        });
        if(addNotice){
            addNotice.state = false;
            await addNotice.save();
        res.status(200).json({status:true, message:'success',data:addNotice})

        }
        else{
        res.status(400).json({status:false, message:'failed'})
        }

      
    }
    catch(err){
        res.send(err)
    }
}

const noticePost = async (req,res) =>{
    try{
        if(req.rootUser.super_admin === true){
            const addNotice = new NoticeData(req.body);
            await addNotice.save();
            res.status(200).json({status:true, message:'success',data:addNotice})
        }
        else{
           return res.status(404).json({status:false, message:'access denied'})
        }
   
      
    }
    catch(err){
        res.send(err)
    }
}

const noticeDelete = async (req,res) =>{
    try{

        if(req.rootUser.super_admin === true){
        const addNotice = await NoticeData.findByIdAndDelete({_id:req.params.id});
        res.status(200).json({status:true, message:'deletion success'})
        }
        else{
            res.status(404).json({status:false, message:'access denied'})
        }

    }
    catch(err){
        res.send(err)
    }
}


module.exports = {noticeGet,noticePost,noticePut,noticeDelete};