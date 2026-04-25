import mongoose from "mongoose";

async function main() {
    const url=process.env.ATLAS_URL?.replace("<db_password>", process.env.ATLAS_PASSWORD || "")  || "" ;  
    console.log(url);
    // console.log(process.env.ATLAS_URL);
    // console.log(process.env.ATLAS_PASSWORD);
    await mongoose.connect(url);
}


export default main;