const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Upload file buffer to Cloudinary
 * Used for multer file uploads: req.file.buffer
 */
const uploadToCloudinary = (file, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

/**
 * Upload image from remote URL to Cloudinary
 * Used for crawler/scraper image URLs
 */
const uploadImageUrlToCloudinary = async (imageUrl, folder = "uploads") => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error("❌ URL upload failed:", error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary using public_id
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("publicId is required");
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image"
    });

    if (result.result === "ok") {
      console.log(`🗑️ Deleted: ${publicId}`);
    } else {
      console.warn("⚠️ Delete response:", result);
    }

    return result;
  } catch (error) {
    console.error("❌ Delete failed:", error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  uploadImageUrlToCloudinary,
  deleteFromCloudinary
};