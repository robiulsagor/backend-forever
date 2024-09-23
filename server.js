import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRouter.js"

const app = express()
const PORT = process.env.PORT || 5000
connectDB()

app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user', userRouter)

app.get('/', (req,res)=> {
    return res.json({success: true, message: "Api is working!"})
})

app.listen(PORT, ()=> console.log("Server started")
)