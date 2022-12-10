const { default: mongoose } = require("mongoose");
const AdminData = require("../models/adminSchema");
const {BlogsContentData,BlogsActivityData,BlogsCommentData, BlogsCategoryData} = require("../models/blogContentSchema");
const BlogsData = require("../models/blogsSchema");
const deletefile = require("./deleteController");


const blogpageGet = async (req,res) =>{
    try{
        // const fetchBlog = await BlogsData.find().populate({path : 'blog_all activity_all'});
        const fetchBlog = await BlogsData.aggregate([
            {
                $match : {userID : mongoose.Types.ObjectId(req.headers['user-id'])}
            },
            {
                $lookup : {
                    from : BlogsContentData.collection.name,
                    let : {uid : "$userID"},
                    pipeline : [
                        {
                        $match : {
                            $expr : {
                                $and: [
                                    {
                                      $eq: ["$userID", "$$uid"]
                                    },
                                  ],
                            }
                        }
                    }
                ],
                    as : 'all_blog_data'
                }
            }

        ]);

        if(fetchBlog){
            res.status(200).json({status:true, message:'success',data:fetchBlog})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const blogpagePost = async (req,res) =>{
    try{
      

        const count = await BlogsData.countDocuments();
        if(count>0){
            return res.status(404).json({status:false, message:'failed to create duplicate data'})
        }
        else{
       
            const newBlogPage = new BlogsData(req.body)

            const createBlogPage = await newBlogPage.save();
            if(createBlogPage){
                res.status(200).json({status:true, message:'success',data:createBlogPage})
            }
            else{
                return res.status(400).json({status:false, message:'failed to create'})
            }
        }

    }
    catch(err){
        res.send(err)
    }
}

const blogpagePut = async (req,res) =>{
    try{
        console.log(req.body)
        let updateBlogPage = await BlogsData.findOne({userID : req.rootId});
        

    //     let blogContentData = await BlogsContentData.find().select(' _id')
    //     let blogContentStore;
    //     if(blogContentData){
    //         blogContentStore = blogContentData.map((val)=>{
    //            return val._id.toString();
    //        })
    //    }

    //    let blogActivityData = await BlogsActivityData.find().select(' _id')
    //    let blogActivityStore;
    //    if(blogActivityData){
    //        blogActivityStore = blogActivityData.map((val)=>{
    //           return val._id.toString();
    //       })
    //   }

        if(updateBlogPage){
            updateBlogPage.title = req.body.title || updateBlogPage.title ;
            // updateBlogPage.blog_all  = blogContentStore || updateBlogPage.blog_all ;
            // updateBlogPage.activity_all  = blogActivityData || updateBlogPage.activity_all ;
            updateBlogPage.slug  = req.body.slug || updateBlogPage.slug ;
            updateBlogPage.meta_title  = req.body.meta_title || updateBlogPage.meta_title ;
            updateBlogPage.meta_keyword  = req.body.meta_keyword || updateBlogPage.meta_keyword ;
            updateBlogPage.meta_discription  = req.body.meta_discription || updateBlogPage.meta_discription ;
            updateBlogPage.userID  = req.rootId;

            await updateBlogPage.save();

            res.status(200).json({status:true, message:'update success'})
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}


const blogContentPublicGet = async (req,res) =>{
    try{
        console.log(req.headers['user-id'])
        const fetchBlog = await BlogsContentData.aggregate([ 

            {
                $match : {
                            $and : [{
                                userID : mongoose.Types.ObjectId(req.headers['user-id'])
                            } , 
                        {
                            state:true
                        }
                        ]
                         
                      
                        }
            },
   
            {
                $lookup : {
                    from : AdminData.collection.name,
                    let : {blopID : "$userID"},
                    pipeline :[
                        {
                            $match : {
                                $expr : {
                                    $and: [
                                        {
                                          $eq: ["$_id", "$$blopID"],
                                        },
                                      ],
                                }
                            }
                        },
                        {
                            $project : {
                                
                                tokens : 0,
                                password :0,
                                __v : 0,
                                social :0

                            }
                        }
                    ],
                    as : 'posteBy'
                }
            },
            {
                $sort : {
                    createdAt : -1
                }
            },
            {
                $lookup : {
                    from : BlogsCommentData.collection.name,
                    let : {myblogID : "$_id"},
                    pipeline :[
                        {
                            $match : {
                                $expr : {
                                    $and: [
                                        {
                                          $eq: ["$blogID", "$$myblogID"]
                                        },
                                      ],
                                }
                            }
                        },
                        {
                          $project: {
                            updatedAt: 0,
                            blogID : 0,
                            __v : 0
                          },
                        },

                        {
                            $sort : {
                                createdAt : -1
                            }
                        }

                    ],
                    as : 'result_comments'
                }
            },

            {
                $lookup : {
                    from : BlogsCommentData.collection.name,
                    let : {myblogID : "$_id"},
                    pipeline :[
                        {
                            $match : {
                                $expr : {
                                    $and: [
                                        {
                                          $eq: ["$blogID", "$$myblogID"]
                                        },
                                      ],
                                }
                            }
                        },
                        

                        {
                            $count : 'total_comment'
                        }

                    ],
                    as : 'total_comment'
                }
            }

        ])
        if(fetchBlog){
            res.status(200).json({status:true, message:'success',data:fetchBlog})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const blogContentGet = async (req,res) =>{
    try{
        const fetchBlog = await BlogsContentData.find({userID:req.rootId});
        
        // const fetchBlog = await BlogsContentData.aggregate([ 

        //     {
        //         $match : {userID : req.rootId}
        //     },
   
        //     // {
        //     //     $lookup : {
        //     //         from : AdminData.collection.name,
        //     //         let : {blopID : "$userID"},
        //     //         pipeline :[
        //     //             {
        //     //                 $match : {
        //     //                     $expr : {
        //     //                         $and: [
        //     //                             {
        //     //                               $eq: ["$_id", "$$blopID"],
        //     //                             },
        //     //                           ],
        //     //                     }
        //     //                 }
        //     //             },
        //     //             {
        //     //                 $project : {
                                
        //     //                     tokens : 0,
        //     //                     password :0,
        //     //                     __v : 0,
        //     //                     social :0

        //     //                 }
        //     //             }
        //     //         ],
        //     //         as : 'posteBy'
        //     //     }
        //     // },
        //     // {
        //     //     $sort : {
        //     //         createdAt : -1
        //     //     }
        //     // },
        //     // {
        //     //     $lookup : {
        //     //         from : BlogsCommentData.collection.name,
        //     //         let : {myblogID : "$_id"},
        //     //         pipeline :[
        //     //             {
        //     //                 $match : {
        //     //                     $expr : {
        //     //                         $and: [
        //     //                             {
        //     //                               $eq: ["$blogID", "$$myblogID"]
        //     //                             },
        //     //                           ],
        //     //                     }
        //     //                 }
        //     //             },
        //     //             {
        //     //               $project: {
        //     //                 updatedAt: 0,
        //     //                 blogID : 0,
        //     //                 __v : 0
        //     //               },
        //     //             },

        //     //             {
        //     //                 $sort : {
        //     //                     createdAt : -1
        //     //                 }
        //     //             }

        //     //         ],
        //     //         as : 'result_comments'
        //     //     }
        //     // },

        //     // {
        //     //     $lookup : {
        //     //         from : BlogsCommentData.collection.name,
        //     //         let : {myblogID : "$_id"},
        //     //         pipeline :[
        //     //             {
        //     //                 $match : {
        //     //                     $expr : {
        //     //                         $and: [
        //     //                             {
        //     //                               $eq: ["$blogID", "$$myblogID"]
        //     //                             },
        //     //                           ],
        //     //                     }
        //     //                 }
        //     //             },
                        

        //     //             {
        //     //                 $count : 'total_comment'
        //     //             }

        //     //         ],
        //     //         as : 'total_comment'
        //     //     }
        //     // }

        // ])
        if(fetchBlog){
            res.status(200).json({status:true, message:'success',data:fetchBlog})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

// const blogContentSingleGet = async (req,res) =>{
//     try{
//         const fetchBlog = await BlogsContentData.findById({_id:req.params.id}).populate({path :'comments_all'});
//         if(fetchBlog){
//             res.status(200).json({status:true, message:'success',data:fetchBlog})
//         }
//         else{
//             return res.status(400).json({status:false, message:'failed'})
//         }
//     }
//     catch(err){
//         res.send(err)
//     }
// }

const blogContentPost = async (req,res) =>{
    try{
        console.log(req.body)
        let file1 = null;
      

        if(req.file) {
            file1 = process.env.UPLOADFILE+req.file.filename;
        }

        console.log(req.body , '========reqbody========')
        console.log(file1)

        const newBlogContent = new BlogsContentData({
            title : req.body.title,
            image : file1 ,
            discription :  req.body.discription ,
            category : req.body.category,
            likes : req.body.likes,
            tags : req.body.tags,
            userID : req.rootId,
            slug :  req.body.slug ,
            meta_title :  req.body.meta_title ,
            meta_keyword :  req.body.meta_keyword ,
            meta_discription :  req.body.meta_discription 
        })

        const createBlogContent = await newBlogContent.save();
        if(createBlogContent){
            res.status(200).json({status:true, message:'success',data:createBlogContent})
        }
        else{
            return res.status(400).json({status:false, message:'failed to create'})
        }
    }
    catch(err){
        res.send(err)
    }
}


const blogContentPut = async (req,res) =>{
    try{
        console.log(req.params.id , 'req.param.idreq.param.id')
        let updateBlogContent = await BlogsContentData.findById({_id:req.params.id});

        if(updateBlogContent){
            let file1 = null;

            if(req.file) {
                file1 = process.env.UPLOADFILE+req.file.filename;
                if(updateBlogContent.image){deletefile(updateBlogContent.image);}
            }

        //     let blogCommentData = await BlogsCommentData.find().select(' _id')
        //     let blogCommentStore;
        //     if(blogCommentData){
        //         blogCommentStore = blogCommentData.map((val)=>{
        //            return val._id.toString();
        //        })
        //    }
            updateBlogContent.title = req.body.title || updateBlogContent.title,
            updateBlogContent.image  = file1  || updateBlogContent.image ,
            updateBlogContent.discription  = req.body.discription  || updateBlogContent.discription ,
            updateBlogContent.category  = req.body.category  || updateBlogContent.category ,
            updateBlogContent.likes  = req.body.likes || updateBlogContent.likes,
            updateBlogContent.tags  = req.body.tags  || updateBlogContent.tags ,
            // updateBlogContent.comments_all  = blogCommentStore || updateBlogContent.comments_all ,
            updateBlogContent.slug  = req.body.slug  || updateBlogContent.slug ,
            updateBlogContent.state  = req.body.state || updateBlogContent.state,
            updateBlogContent.meta_title  = req.body.meta_title  || updateBlogContent.meta_title ,
            updateBlogContent.meta_keyword  = req.body.meta_keyword  || updateBlogContent.meta_keyword ,
            updateBlogContent.meta_discription  = req.body.meta_discription  || updateBlogContent.meta_discription ,
            await updateBlogContent.save()

            res.status(200).json({status:true, message:'update success', data  : updateBlogContent})
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const blogContentDelete = async (req,res) =>{
    try{
        const deleteBlog = await BlogsContentData.findByIdAndDelete({_id:req.params.id});
        if(deleteBlog){
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



const blogContentLikePut = async (req,res) =>{
    try{
 
        let blogLikeUpdate = await BlogsContentData.findById({_id:req.params.id});

        if(blogLikeUpdate){

            blogLikeUpdate.likes  = blogLikeUpdate.likes+1,

            await blogLikeUpdate.save()

            res.status(200).json({status:true, message:'like success', data  : blogLikeUpdate})
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}



const blogIDCommentGet = async (req,res) =>{
    try{
        let findBlog = await BlogsContentData.findById({_id:req.params.id});
        console.log(findBlog , "========findBlog=========");
    
        if(findBlog){
            let BlogIDAllComment = await BlogsCommentData.find({blogID : req.params.id})
            let count = await BlogsCommentData.countDocuments({blogID : req.params.id})

    
            console.log(req.params.id, 'req.params.idreq.params.id')
            return res.status(200).json({status:true , message: 'success',total_comment:count , all_comment : BlogIDAllComment});
        }
        else{
            return res.status(404).json({status:false , message: 'blog not found'});
        }
    }
    catch(err){
        res.send(err)
    }
}

const blogCommentPost = async (req,res) =>{
    try{
            const {name,email,comment,blogID} = req.body;

            if(!name  || !email  || !comment || !blogID){
                return res.status(404).json({status:false , message: 'some fields are missing'});
            }
            else{
                let findBlog = await BlogsContentData.findById({_id:blogID})
                if(findBlog){
                    let newComment = new BlogsCommentData({name,email,comment,blogID})
                    await newComment.save();
                    return res.status(200).json({status:true , message: 'comment saved'});
                }
            }
    }
    catch(err){
        res.send(err)
    }
}



const blogCategoryGet = async (req,res) =>{
    try{
        let fetchBlog = await BlogsCategoryData.find({userID : req.rootId});
        if(fetchBlog){
            res.status(200).json({status:true , message: 'success', data :fetchBlog });
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}


const blogCategoryPost = async (req,res) =>{
    try{
        let postBlog = new BlogsCategoryData({
            title : req.body.title,
            state : req.body.state,
            userID : req.rootId
        });
        await postBlog.save();
        if(postBlog){
            res.status(200).json({status:true , message: 'success'});
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}

const blogCategoryPut = async (req,res) =>{
    try{
        let PutBlog = await BlogsCategoryData.updateOne({_id:req.params.id},{
            $set : req.body
        });

        if(PutBlog){
            res.status(200).json({status:true , message: 'updation success'});
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }

    }
    catch(err){
        res.send(err)
    }
}


const blogCategoryDelete = async (req,res) =>{
    try{
        let deleteBlog = await BlogsCategoryData.findOneAndDelete({_id:req.params.id});
        if(deleteBlog){
            res.status(200).json({status:true , message: 'deletion success'});
        }
        else{
           return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}







const searchPost = async (req,res) =>{
    try{
        const fetchBlog = await BlogsContentData.aggregate([
            {
                $lookup :  {
                   from : 'adminpage',
                   let : {buserID : "$userID" },
                   pipeline : [{
                    $match: {
                        $expr: {
                          $and: [
                            {
                              $eq: ["$_id", "$$buserID"],
                            },
                          ],
                        },
                      },
                   }]
                }
               
            }
        ]);
        if(fetchBlog){
            res.status(200).json({status:true, message:'success',data:fetchBlog})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}


const testfn = ()=>{
    try{
        deletefile('apple.png')
    }
    catch(err){
        console.log(err)
    }
}








/* lookup */

const blogContentSingleGet = async (req,res) =>{
    try{
        console.log(req.params.id);
        const fetchBlog = await BlogsContentData.aggregate([ 
            {
                $match : {
                    _id : mongoose.Types.ObjectId(req.params.id)
                }
            },

            {
                $lookup : {
                    from : AdminData.collection.name,
                    let : {blopID : "$userID"},
                    pipeline :[
                        {
                            $match : {
                                $expr : {
                                    $and: [
                                        {
                                          $eq: ["$_id", "$$blopID"],
                                        },
                                      ],
                                }
                            }
                        },
                        {
                            $project : {
                                
                                tokens : 0,
                                password :0,
                                __v : 0,
                                social :0

                            }
                        }
                    ],
                    as : 'posteBy'
                }
            },
            {
                $sort : {
                    createdAt : -1
                }
            },
            {
                $lookup : {
                    from : BlogsCommentData.collection.name,
                    let : {myblogID : "$_id"},
                    pipeline :[
                        {
                            $match : {
                                $expr : {
                                    $and: [
                                        {
                                          $eq: ["$blogID", "$$myblogID"]
                                        },
                                      ],
                                }
                            }
                        },
                        {
                          $project: {
                            createdAt: 0,
                            updatedAt: 0,
                            
                            blogID : 0,
                            __v : 0
                          },
                        },

                        {
                            $sort : {
                                createdAt : -1
                            }
                        }

                    ],
                    as : 'result_comment_outer'
                }
            },

            {
                $lookup : {
                    from : BlogsCommentData.collection.name,
                    let : {myblogID : "$_id"},
                    pipeline :[
                        {
                            $match : {
                                $expr : {
                                    $and: [
                                        {
                                          $eq: ["$blogID", "$$myblogID"]
                                        },
                                      ],
                                }
                            }
                        },
                        

                        {
                            $count : 'total_comment'
                        }

                    ],
                    as : 'total_comment'
                }
            },
           

        ])
        if(fetchBlog){
            res.status(200).json({status:true, message:'success',data:fetchBlog})
        }
        else{
            return res.status(400).json({status:false, message:'failed'})
        }
    }
    catch(err){
        res.send(err)
    }
}








module.exports = {searchPost,blogpageGet,blogpagePost,blogpagePut,blogContentGet,blogContentSingleGet,blogContentPost,blogContentPut,blogContentDelete,testfn
    ,blogIDCommentGet,blogCommentPost,blogCategoryGet,blogCategoryPost,blogCategoryPut,blogCategoryDelete

,blogContentLikePut , blogContentPublicGet};