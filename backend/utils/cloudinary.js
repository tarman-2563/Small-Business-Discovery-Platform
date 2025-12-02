const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async filePath => {
  try {
    return await cloudinary.uploader.upload(filePath, {
      folder: "locallens",
      resource_type: "auto"
    })
  } catch (error) {
    throw new Error("Error uploading to Cloudinary: " + error.message)
  }
}

const deleteFromCloudinary = async publicId => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    throw new Error("Error deleting from Cloudinary: " + error.message)
  }
}

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
}
