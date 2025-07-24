import mongoose from "mongoose"

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://harsh_18:wIdp1R3PmxC2P0WT@cluster0.fhdv9qp.mongodb.net/food-del').then(()=>console.log("DB connected"))
}