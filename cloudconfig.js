const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


const storage = new cloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlust_Dev',
      allowedformats: ["png","jpg", "jped"],
      
    },
  });


  module.exports={
    cloudinary, storage
  }