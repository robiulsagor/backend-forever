import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRouter.js"
import productRouter from "./routes/productRouter.js"
import cartRouter from "./routes/cartRouter.js"
import orderRouter from "./routes/orderRoute.js"
import { verifyPayment } from "./controllers/orderController.js"
const app = express()
const PORT = process.env.PORT || 5000
connectDB()

app.use(cors())


// api endpoints
app.use('/api/user', app.use(express.json()), userRouter)
app.use('/api/product', app.use(express.json()), productRouter)
app.use('/api/cart', app.use(express.json()), cartRouter)
app.use('/api/order', app.use(express.json()), orderRouter)
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), verifyPayment)

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
    return res.json({ success: true, message: "Api is working!" })
})

app.listen(PORT, () => console.log("Server started"))