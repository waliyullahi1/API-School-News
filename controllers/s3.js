const AWS = require('aws-sdk');
const axios = require('axios');
const path = require('path');

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_CLOUD ,
  secretAccessKey: process.env.SECURITY_KEY_CLOUD, 
  region: process.env.REGIONS_CLOUD,
});

const s3 = new AWS.S3();

const saveImageToS3 = async (imageurls) => {
  while (true) {
    try {
      const imageUrl = imageurls;

      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      })
      .catch((error) => {
        console.error('Error fetching image:', error);
        throw error; 
      });

      
      const fileName = path.basename(new URL(imageUrl).pathname);

   
      const params = {
        Bucket: process.env.BUCKET_NAME, 
        Body: response.data,
        ContentType: 'image/png', 
        Key:fileName
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, function(err, data) {
          if (err) {
            console.error('Error uploading image to S3:', err);
            throw err; 
          } else {
            console.log('Image uploaded to S3 successfully.');
            resolve(params.Key); 
          }
        });
      });
    } catch (error) {
      console.error('Error saving image:', error);
      continue; 
    }
  }
}

module.exports = saveImageToS3;
