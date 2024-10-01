import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRouter.js"
import productRouter from "./routes/productRouter.js"
import cartRouter from "./routes/cartRouter.js"
import orderRouter from "./routes/orderRoute.js"
const app = express()
const PORT = process.env.PORT || 5000
connectDB()

const allowedOrigins = ['https://frontend-forever-lac.vercel.app', 'http://localhost:5173'];

app.options('*', cors());  // Allow preflight requests

app.use(cors({
    origin: true,  // Replace with your frontend URL when deployed
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // List allowed methods if needed
    credentials: true  // If you are sending cookies or authorization headers
}));

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.json())

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
    return res.json({ success: true, message: "Api is working!" })
})

app.listen(PORT, () => console.log("Server started"))