const scrapenews = require('./scrapefunctin')
const News = require('../model/news')
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_CLOUD  , // Replace with your actual AWS access key ID
    secretAccessKey:  process.env.SECURITY_KEY_CLOUD, // Replace with your actual AWS secret access key
    region: process.env.REGIONS_CLOUD,
  });

  const s3 = new AWS.S3();




const admissionDB = async  (req, res)=> {
    
   
        const title = /Admission/; // This is a regular expression that matches any string containing 'admission'
        const news = await News.find({title: title});
        res.json(news);
  
    
}

const admissionImage = async (req, res)=> {
    const fileName = req.params.fileName;
       console.log(fileName)
    const downlad  =  {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
     
    };


  
  const result =  s3.getObject(downlad).createReadStream()
    // Send an HTML response that displays the image
    result.pipe(res)
    
}


module.exports = { admissionDB, admissionImage}