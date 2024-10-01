import express from "express"
import { placeOrder, placeOrderStripe, allOrders, userOrders, updateOrder, verifyOrder, verifyPayment } from "../controllers/orderController.js"
import auth from "../middleware/auth.js"
import adminAuth from "../middleware/adminAuth.js"
import bodyParser from "body-parser"

const orderRoute = express.Router()

// payment routes
orderRoute.post("/place-order", auth, placeOrder)
orderRoute.post("/place-order-stripe", auth, placeOrderStripe)

// admin routes
orderRoute.get("/list", adminAuth, allOrders)
orderRoute.post("/status", adminAuth, updateOrder)

// user routes
orderRoute.get("/user-orders", auth, userOrders)
orderRoute.post("/verify", auth, verifyOrder)
orderRoute.post("/webhook", bodyParser.raw({ type: "application/json" }), verifyPayment)

export default orderRoute