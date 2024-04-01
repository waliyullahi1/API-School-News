// require("dotenv").config();
// const express = require('express');
// const mongoose = require('mongoose');
// const axios = require('axios');

// const app = express();
// const port = 3000;

// // Configure MongoDB connection
// mongoose.connect(process.env.DATA_BASE, { useNewUrlParser: true, useUnifiedTopology: true });

// // Create a model for images
// const ImageModel = mongoose.model('Image', { data: Buffer }); // Adjust the schema as needed

// // Fetch image from URL and save to MongoDB
// app.post('/save-image', async (req, res) => {
//   try {
//     const imageUrl = 'https://i0.wp.com/schoolnewsng.com/wp-content/uploads/2017/03/ful-1.jpeg';
//     const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

//     // Save the image data to MongoDB
//     const image = new ImageModel({ data: response.data });
//     await image.save();

//     console.log('Image saved successfully!');
//     console.log(response.data);
//     res.status(200).send('Image saved successfully!');
//   } catch (error) {
//     console.error('Error saving image:', error);
//     res.status(500).send('Error saving image.');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

require("dotenv").config();


// Fetch image from URL and save to MongoDB
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;


app.post('/save-image', async (req, res) => {
  try {
    const imageUrl = 'https://i0.wp.com/schoolnewsng.com/wp-content/uploads/2017/02/UNIZIK-1.png?resize=300%2C165&ssl=1';
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Determine the file name and the local path
    const fileName = path.basename(new URL(imageUrl).pathname);
    const localPath = path.join(__dirname, 'uploads', fileName);

    // Check if uploads directory exists, if not create it
    if (!fs.existsSync(path.dirname(localPath))) {
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
    }

    // Save the image data to the local server
    fs.writeFileSync(localPath, response.data);

    res.status(200).send('Image saved successfully.');
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).send('Error saving image.');
  }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
