import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

const placeOrder = async (req, res) => {
    try {
        const { userId, items, address, amount } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const order = await orderModel.create(orderData)

        await userModel.findByIdAndUpdate(userId, { cartData: [] })
        return res.status(200).send({
            success: true,
            message: "Order placed successfully",
            order
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in place order",
            error,
            stack: error.stack
        })
    }

}

const placeOrderStripe = async (req, res) => { }

const placeOrderRazorpay = async (req, res) => { }

// for adming panel
const allOrders = async (req, res) => { }

// for user
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        return res.status(200).send({
            success: true,
            message: "Orders fetched successfully",
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in user orders",
            error,
            stack: error.stack
        })
    }
}

// update order status from admin panel
const updateOrder = async (req, res) => { }

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateOrder }