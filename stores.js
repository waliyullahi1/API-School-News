const fs = require('fs');
const axios = require('axios');
const path = require('path');
const url = require('url');
//  const save =  async () => {
//   try {
//     await client.connect();
//     const db = client.db('mydb'); // Replace with your database name

//     const imageUrl = 'https://i0.wp.com/schoolnewsng.com/wp-content/uploads/2017/02/UNIZIK-1.png';
//     const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

//     const fileName = 'my-image.png'; // Set your desired filename
//     const bucket = new GridFSBucket(db);

//     const uploadStream = bucket.openUploadStream(fileName);
//     uploadStream.end(response.data);

//    console.log('okay');
//   } catch (error) {
//     console.error('Error saving image:', error);
    
//   } finally {
//     await client.close();
//   }
// };




const save =  async (url) => {
// replace with your image url
    const imageUrl =`${url}`; // replace with your image url
  const parsedUrl = url.parse(imageUrl);
  const imageName = path.basename(parsedUrl.pathname);
  const imagePath = path.join(__dirname, 'uploads', imageName);
  axios({
    url: imageUrl,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        // Create the uploads directory if it doesn't exist
        fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

        response.data
          .pipe(fs.createWriteStream(path.join(__dirname, 'uploads', imageName)))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  ).then(() => {
    // save image in mongodb
    console.log(imagePath);
   
  return imagePath
  });
};


module.exports = save