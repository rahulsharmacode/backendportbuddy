

const fs = require('fs');
const path = require('path')

const publicDirectoryPath = path.join(__dirname, '../public/uploads');

const userfoldercreate = (uid) =>{
    console.log(uid,'calledled')
    fs.mkdirSync(  `${publicDirectoryPath}/user${uid}` , (err)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log('=== folder created ===')
        }
    })

    console.log(publicDirectoryPath , 'publicDirectoryPathpublicDirectoryPath')
    return 'process done'
}

module.exports = userfoldercreate;