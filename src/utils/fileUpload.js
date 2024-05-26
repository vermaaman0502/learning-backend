import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return console.error('Could not find');
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : 'auto'
        })
        console.log("The file is uploaded on cloudinary", response.url);
        return response
    } catch (error) {
        FileSystem.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}


const uploadResult = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", {
        public_id: "shoes"
    }).catch((error)=>{console.log(error)});