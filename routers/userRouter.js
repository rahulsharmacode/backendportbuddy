const express = require('express');
const { blogpageGet, blogpagePost, blogpagePut,blogContentGet,blogContentPost,blogContentPut,blogContentDelete, testfn, searchPost, blogIDCommentGet, blogCommentPost, blogContentSingleGet, blogCategoryDelete, blogCategoryPut, blogCategoryPost, blogCategoryGet, blogContentLikePut, blogContentPublicGet } = require('../controllers/blogsController');
const {homeGet,homePost,homePut} = require('../controllers/homeController');

const userRouter = new express.Router();






const multer  = require('multer');
const { contactGet, contactPost, contactDelete, contactMailNow} = require('../controllers/contactController');
const { portfoliopageGet, portfoliopagePost, portfoliopagePut, portfolioClientGet, portfolioClientPost, portfolioClientPut, portfolioClientDelete, portfolioGalleryGet, portfolioGalleryPost, portfolioGalleryPut, portfolioGalleryDelete } = require('../controllers/protfolioController');
const { servicepageGet, servicepagePost, servicepagePut, serviceTypesDelete, serviceTypesPut, serviceTypesPost, serviceTypesGet, serviceAchivementsGet, serviceAchivementsPost, serviceAchivementsPut, serviceAchivementsDelete } = require('../controllers/serviceController');
const { aboutpageGet, aboutpagePost, aboutpagePut, skillsGet, skillsPost, skillsPut, skillsDelete, expeduGet, expeduPost, expeduPut, expeduDelete, testimonialGet, testimonialPost, testimonialPut, testimonialDelete, socialGet, socialPost, socialPut, socialDelete,
} = require('../controllers/aboutController');
const { login, register, forgetpassword, resetpassword, adminUpdate, adminMyAccount, accountdelete } = require('../controllers/adminController');
const authentication = require('../middelware/authentication');
const {siteStatsGet,siteStatsPost, siteStatsPut} = require('../controllers/seoController');
const edufn = require('../models/lookupSchema');
const {siteSettingsGet,siteSettingsPost, siteSettingsPut, siteSettingsPublicGet} = require('../controllers/settingsController');
const { communityPostGet, communityPostPost, communityPostPut, communityPostDelete, communityPostGetUser, communityPostLike, communityPostdisLike, communityPageGet, communityPagePost, communityPagePut } = require('../controllers/communityController');
const { noticeGet, noticePost, noticeDelete, noticePut } = require('../controllers/noticeController');
const { cmsDevToolGet, cmsDevToolPut } = require('../controllers/cmsdevController');
const userfoldercreate = require('../controllers/fileadder');

/* section - Disk storage engien by multer  */

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads/`)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
     
    }
  });

  const fileFilter=(req, file, cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
        cb(null,true);
    }else{
        cb(null, false);
    }
 
   }
 
 var upload = multer({ storage:storage })

/* -- section - Disk storage engien by multer ends -- */

/* -- section - home multiple image multer start -- */
//    var homeMultiple = upload.fields([{name:'section1_card1_img'},{name:'section1_card2_img'},{name:'section1_card3_img'},{name:'section2_about_img'},{name:'section3_whyChoose_bgimg'},{name:'section4_card1_img'},{name:'section4_card2_img'},{name:'section4_card3_img'},{name:'section4_card4_img'}])
//    var aboutMultiple = upload.fields([{name:'section1_about_img'},{name:'section2_whatwesay_img'},{name:'section4_teaching_img'}])

   /* -- section - home multiple image multer ends -- */



userRouter.get(`/api/stats`,authentication , siteStatsGet );
userRouter.post(`/api/stats`,authentication , siteStatsPost );
userRouter.put(`/api/stats` , siteStatsPut );


userRouter.get(`/api/notification`,authentication , noticeGet );
userRouter.post(`/api/notification` ,authentication, noticePost );
userRouter.put(`/api/notification/:id`,authentication , noticePut );
userRouter.delete(`/api/notification/:id`,authentication , noticeDelete );


userRouter.post(`/api/login` , login );
userRouter.post(`/api/register` , register );
userRouter.post(`/api/forget-password` , forgetpassword );
userRouter.post(`/api/reset-password/:token` , resetpassword );
userRouter.delete(`/api/force-delete/:id`,authentication , accountdelete );
userRouter.get(`/api/my-account`,authentication , adminMyAccount );



userRouter.put('/api/admin',upload.single('image'), authentication ,adminUpdate );
userRouter.delete('/api/admin/:id' , blogContentDelete );


userRouter.get(`/api/home` , homeGet );
userRouter.post(`/api/home` , authentication  , homePost );
userRouter.put(`/api/home`, upload.single('profile_image') , authentication  , homePut );

userRouter.get(`/api/blog-page` , blogpageGet );
userRouter.post(`/api/blog-page` , authentication , blogpagePost );
userRouter.put(`/api/blog-page` , authentication , blogpagePut );


userRouter.get(`/api/settings`  , authentication, siteSettingsGet );
userRouter.get(`/api/settings-public` , siteSettingsPublicGet );
userRouter.post(`/api/settings`,upload.single('fav_icon') , authentication , siteSettingsPost );
userRouter.put(`/api/settings`,upload.single('fav_icon') , authentication , siteSettingsPut );

userRouter.get(`/api/all-blogs-public`  , blogContentPublicGet );
userRouter.get(`/api/all-blogs` , authentication  , blogContentGet );
userRouter.get(`/api/blogs/:id`   , blogContentSingleGet );
userRouter.post(`/api/blogs` , authentication  , upload.single('blog_image'),blogContentPost );
userRouter.put('/api/blogs/:id' , authentication  , upload.single('blog_image'),blogContentPut );
userRouter.delete('/api/blogs/:id' , authentication  , blogContentDelete );


userRouter.get('/api/blogs-all-comment/:id' , authentication  , blogIDCommentGet );
userRouter.post('/api/blogs-add-comment'   , blogCommentPost );
userRouter.put('/api/blogs-like/:id'  ,blogContentLikePut );


userRouter.get('/api/blogs-category' , authentication , blogCategoryGet );
userRouter.post('/api/blogs-category' , authentication  , blogCategoryPost );
userRouter.put('/api/blogs-category/:id' , authentication  , blogCategoryPut );
userRouter.delete('/api/blogs-category/:id' , authentication  , blogCategoryDelete );



userRouter.get(`/api/contact` , authentication , contactGet );
userRouter.post(`/api/contact` , contactPost );
userRouter.delete('/api/contact/:id' , authentication  , contactDelete );
userRouter.post('/api/contact-reply' , authentication  , contactMailNow );



userRouter.get(`/api/portfolio-page` , portfoliopageGet );
userRouter.post(`/api/portfolio-page` , authentication ,portfoliopagePost );
userRouter.put('/api/portfolio-page' , authentication ,portfoliopagePut );

userRouter.get(`/api/portfolio-client`, authentication , portfolioClientGet );
userRouter.post(`/api/portfolio-client` , authentication  , upload.single('logo'),portfolioClientPost );
userRouter.put('/api/portfolio-client/:id' , authentication  , upload.single('logo'),portfolioClientPut );
userRouter.delete('/api/portfolio-client/:id' , authentication  , portfolioClientDelete );

userRouter.get(`/api/portfolio-gallery`, authentication , portfolioGalleryGet );
userRouter.post(`/api/portfolio-gallery` , authentication  , upload.single('gallery_image'),portfolioGalleryPost );
userRouter.put('/api/portfolio-gallery/:id' , authentication  , upload.single('gallery_image'),portfolioGalleryPut );
userRouter.delete('/api/portfolio-gallery/:id' , authentication  , portfolioGalleryDelete );


userRouter.get(`/api/service-page` , servicepageGet );
userRouter.post(`/api/service-page` , authentication ,servicepagePost );
userRouter.put('/api/service-page' , authentication ,servicepagePut );


userRouter.get(`/api/service-type`, authentication , serviceTypesGet );
userRouter.post(`/api/service-type` , authentication ,serviceTypesPost );
userRouter.put('/api/service-type/:id' , authentication ,serviceTypesPut );
userRouter.delete('/api/service-type/:id' , authentication ,serviceTypesDelete );


userRouter.get(`/api/service-achivements`, authentication , serviceAchivementsGet );
userRouter.post(`/api/service-achivements` , authentication ,serviceAchivementsPost );
userRouter.put('/api/service-achivements/:id' , authentication ,serviceAchivementsPut );
userRouter.delete('/api/service-achivements/:id' , authentication ,serviceAchivementsDelete );


userRouter.get(`/api/about-page` , aboutpageGet );
userRouter.post(`/api/about-page` , authentication ,aboutpagePost );
userRouter.put('/api/about-page' , authentication , upload.single('pp_image'),aboutpagePut );


userRouter.get(`/api/about-skills`, authentication , skillsGet );
userRouter.post(`/api/about-skills` , authentication ,skillsPost );
userRouter.put('/api/about-skills/:id' , authentication ,skillsPut );
userRouter.delete('/api/about-skills/:id' , authentication ,skillsDelete );

userRouter.get(`/api/about-eduexp`, authentication , expeduGet );
userRouter.post(`/api/about-eduexp` , authentication ,expeduPost );
userRouter.put('/api/about-eduexp/:id' , authentication ,expeduPut );
userRouter.delete('/api/about-eduexp/:id' , authentication ,expeduDelete );

userRouter.get(`/api/testimonial`, authentication , testimonialGet );
userRouter.post(`/api/testimonial` , authentication , upload.single('image'),testimonialPost );
userRouter.put('/api/testimonial/:id' , authentication , upload.single('image'),testimonialPut );
userRouter.delete('/api/testimonial/:id' , authentication ,testimonialDelete );


userRouter.get(`/api/social-links`, authentication , socialGet );
userRouter.post(`/api/social-links` , authentication ,socialPost );
userRouter.put('/api/social-links/:id' , authentication ,socialPut );
userRouter.delete('/api/social-links/:id' , authentication ,socialDelete );


userRouter.get(`/api/community-post`, authentication , communityPostGet );
userRouter.get(`/api/community-post-user`,authentication , communityPostGetUser );
userRouter.post(`/api/community-post`, upload.single('post_img'), authentication ,communityPostPost );
userRouter.put('/api/community-post/:id', upload.single('post_img'), authentication ,communityPostPut );
userRouter.delete('/api/community-post/:id' , authentication ,communityPostDelete );

userRouter.put('/api/community-post-like/:id' , authentication ,communityPostLike );
userRouter.put('/api/community-post-dislike/:id' , authentication ,communityPostdisLike );




userRouter.get(`/api/community-page`,authentication , communityPageGet );
userRouter.post(`/api/community-page`,authentication , communityPagePost );
userRouter.put(`/api/community-page`, authentication ,communityPagePut );



userRouter.get(`/api/devtool`,authentication , cmsDevToolGet );
userRouter.put(`/api/devtool`, authentication ,cmsDevToolPut );



userRouter.post(`/api/search` , searchPost );



userRouter.get(`/api/test` ,testfn );


userRouter.get(`/api/look` , edufn );


userRouter.post(`/api/filetest` , userfoldercreate);



module.exports = userRouter;
