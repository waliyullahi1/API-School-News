const AWS = require('aws-sdk');
const axios = require('axios');
const path = require('path');

AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY', // Replace with your actual AWS access key ID
  secretAccessKey: 'YOUR_SECRET_KEY', // Replace with your actual AWS secret access key
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
        throw error; // This will stop the function execution
      });

      // Determine the file name
      const fileName = path.basename(new URL(imageUrl).pathname);

      // Prepare data for S3 upload
      const params = {
        Bucket: process.env.BUCKET_NAME, // Replace with your S3 bucket name
        Key: fileName,
        Body: response.data,
        ContentType: 'image/png', // Or whatever the actual image type is
      };

      // Upload image to S3
      return new Promise((resolve, reject) => {
        s3.upload(params, function(err, data) {
          if (err) {
            console.error('Error uploading image to S3:', err);
            throw err; // This will stop the function execution
          } else {
            console.log('Image uploaded to S3 successfully.');
            resolve(params.Key); // This is the file name of the uploaded image
          }
        });
      });
    } catch (error) {
      console.error('Error saving image:', error);
      continue; // This will retry the function
    }
  }
}

module.exports = saveImageToS3;
