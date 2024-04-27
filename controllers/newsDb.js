const newsHistoryimage = async (req, res) => {
    const fileName = req.params.fileName;
    console.log(fileName)
   
  
    // Generate a signed URL for the image
    const url = s3.getSignedUrl('getObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
     
    });
  
    // Send an HTML response that displays the image
    res.send(`
     ${url}
    `);
  };
  