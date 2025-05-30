import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


export const uploadToCloudinary = (fileBuffer, folder, filename = 'image.jpg') => {
  return new Promise((resolve, reject) => {
    const ext = filename.split('.').pop().toLowerCase();
    const validFormats = ['jpg', 'jpeg', 'png'];

    if (!validFormats.includes(ext)) {
      console.error(`Rejected file with invalid format: .${ext}`);
      return reject(new Error('Only JPG, JPEG, PNG formats are allowed.'));
    }

    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: ext
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    bufferStream.pipe(uploadStream);
  });
};
