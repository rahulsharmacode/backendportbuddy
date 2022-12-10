const fs = require('fs')
const deletefile = (filename) =>{
    fs.unlink(filename.replace(process.env.UPLOADFILE , 'public/uploads/') , (err)=>{
        if(err){
            console.log(` file deletion failed :  ${err}`)
        }
        else{
            console.log(`${filename} file deleted success`)
        }
    })
}

module.exports = deletefile;