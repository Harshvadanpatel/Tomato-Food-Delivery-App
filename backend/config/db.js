import mongoose from "mongoose"
import { configDotenv } from "dotenv"

const connectDB = async ()=>{
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`).then(()=>console.log("DB connected"))
}
export {connectDB};