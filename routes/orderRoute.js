import express from "express"
import { placeOrder, placeOrderStripe, allOrders, userOrders, updateOrder, verifyOrder, handleCheckout, deleteUnPaidStripeOrder } from "../controllers/orderController.js"
import auth from "../middleware/auth.js"
import adminAuth from "../middleware/adminAuth.js"

const orderRoute = express.Router()

// payment routes
orderRoute.post("/place-order", auth, placeOrder)
orderRoute.post("/place-order-stripe", auth, placeOrderStripe)
orderRoute.post("/handle-checkout", auth, handleCheckout)
orderRoute.post("/delete-order", auth, deleteUnPaidStripeOrder)

// admin routes
orderRoute.get("/list", adminAuth, allOrders)
orderRoute.post("/status", adminAuth, updateOrder)

// user routes
orderRoute.get("/user-orders", auth, userOrders)
orderRoute.post("/verify", auth, verifyOrder)

export default orderRoute