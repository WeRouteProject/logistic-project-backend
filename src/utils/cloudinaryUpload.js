import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';

cloudinary.config({
  cloud_name: "dkv2ptzep",
  api_key:    "447645633855624",
  api_secret: "n4dOXwg74d-dyrocDIOxUwRDgK8"
});

// CLOUDINARY_CLOUD_NAME=dkv2ptzep
// CLOUDINARY_API_KEY=447645633855624
// CLOUDINARY_API_SECRET=n4dOXwg74d-dyrocDIOxUwRDgK8

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
