// const multer = require('multer');
// const FullNewss = require('../model/Fullnews')

// const savingImage = async (req, res, next)=>{
   

    
       
//         // Everything went fine and file has been stored
//         const newIma = new FullNewss({
//             Name : req.body.name,
//             Image:{
//                 data: req.body.filename,
//                 contentType:"image/png"
//             }
//         })
//         newIma.save()


// }

// module.exports= savingImage
const axios = require('axios');
const mongoose = require('mongoose');
const Image = require('../model/Fullnews')


// Create a model from the schema


// Function to download and save an image
// async function saveImage(req, res) {
//     // Download the image
//     const url = 'https://myschoolnews.ng/uploads/images/202401/image_380x226_65b269e260bea.jpg'
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
  
//     // Create a new image document
//     const image = new Image({
//       name: 'waliu',
//       img: {
//         data: Buffer.from(response.data, 'binary'),
//         contentType: response.headers['content-type']
//       }
//     });
  
//     // Save the image document
//     await image.save();
//   }
  
 // Use the function
  // saveImage('https://myschoolnews.ng/uploads/images/202401/image_380x226_65b269e260bea.jpg', 'My Image')
  //   .then(() => console.log('Image saved successfully!'))
  //   .catch(err => console.error(err));

  async function saveImage(req, res) {
    // Download the image
    const storage = new GridFsStorage({
      url: 'mongodb://localhost/mydb',
      file: (req, file) => {
        return {
          bucketName: 'photos', // Collection name for storing images
          filename: file.originalname // Use the original filename
        };
      }
    });

    upload.single('image')

    axios.get('https://i0.wp.com/schoolnewsng.com/wp-content/uploads/2017/02/UNIZIK-1.png', { responseType: 'arraybuffer' })
  .then(response => {
    const imageBuffer = Buffer.from(response.data, 'binary');
    const newImage = new Image({ img: { data: imageBuffer, contentType: 'image/png' } });
    newImage.save();
  })
  .catch(error => {
    console.error('Error downloading image:', error.message);
  });


  }



     module.exports= saveImage