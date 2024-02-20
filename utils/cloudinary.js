import {v2 as cloudinary} from 'cloudinary';
          

// configuration
cloudinary.config({ 
  cloud_name: 'dl1ru15me', 
  api_key: '618321172373116', 
  api_secret: 'Laco4G0dv7C8ijypWE0Qv5JoBxs' 
});

// file upload to cloudinary
export const fileUploadToCloudinary = async(path)=>{
    const data = await cloudinary.uploader.upload(path);
    return data
}

// file delete to cloudinary
export const fileDeleteToCloudinary = async(publicId)=>{
    await cloudinary.uploader.destroy(publicId);
}