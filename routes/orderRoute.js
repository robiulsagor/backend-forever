import express from "express"
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateOrder } from "../controllers/orderController.js"
import auth from "../middleware/auth.js"
import adminAuth from "../middleware/adminAuth.js"

const orderRoute = express.Router()

// payment routes
orderRoute.post("/place-order", auth, placeOrder)
orderRoute.post("/place-order-stripe", auth, placeOrderStripe)
orderRoute.post("/place-order-razorpay", auth, placeOrderRazorpay)

// admin routes
orderRoute.get("/list", adminAuth, allOrders)
orderRoute.post("/status", adminAuth, updateOrder)

// user routes
orderRoute.get("/user-orders", auth, userOrders)

export default orderRoute