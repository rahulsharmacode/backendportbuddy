const cors = require('cors');


require('dotenv').config();
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());
require('./db/config');
app.use(express.static('./public/'));

const userRouter = require('./routers/userRouter');

app.use(userRouter)


app.get(`/` , (req,res)=>{
    res.send('server tested')
})

app.listen(process.env.PORT , ()=>{
    console.log(`server running at port ${process.env.PORT}`)
})

