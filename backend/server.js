import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"





// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// DB connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))


app.get("/",(req,res)=>{
    res.send("API WORKING")

})

app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`)
})

// mongodb+srv://harsh_18:wIdp1R3PmxC2P0WT@cluster0.fhdv9qp.mongodb.net/?
// retryWrites=true&w=majority&appName=Cluster0

// mongodb+srv://harsh_18:wIdp1R3PmxC2P0WT@cluster0.fhdv9qp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0