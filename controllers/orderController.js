import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

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

const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address, amount } = req.body
        const { origin } = req.headers

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const order = await orderModel.create(orderData)

        const line_items = items.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Shipping fee"
                },
                unit_amount: 10
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items,
            success_url: `${origin}/verify?success=true&orderId=${order._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${order._id}`
        })

        return res.status(200).send({
            success: true,
            message: "Order placed successfully",
            session_url: session.url
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
}

const verifyOrder = async (req, res) => {
    try {
        const { orderId, success, userId } = req.body

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: [] })
            return res.status(200).json({
                success: true,
                message: "Order verified successfully"
            })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            return res.status(200).json({
                success: false,
                message: "Order verification failed"
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
}

const verifyPayment = async (req, res) => {
    console.log("hook");
    console.log("body", req.body)
    const sig = req.headers["stripe-signature"]; // Signature to verify the event
    console.log("sig", sig)

    let event;
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    console.log("endpointSecret", endpointSecret)

    try {
        // Verify the webhook signature using the Stripe secret and event payload
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("event", event)
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event based on its type
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            // Handle successful payment here
            console.log("Payment successful for session:", session);
            // You can update your database, send emails, etc.
            break;

        case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            console.log("PaymentIntent was successful!");
            // Handle other events here if needed
            break;

        default:
            console.warn(`Unhandled event type ${event.type}`);
    }

    // Acknowledge receipt of the event
    res.status(200).send("Received webhook");
}


// for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
        return res.status(200).send({
            success: true,
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
}

// for admin
const updateOrder = async (req, res) => {
    try {
        const { id, status } = req.body
        const order = await orderModel.findByIdAndUpdate(id, { status })
        return res.status(200).send({
            success: true,
            message: "Order status updated successfully",
            order
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message

        })
    }
}

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


export { verifyOrder, placeOrder, placeOrderStripe, allOrders, userOrders, updateOrder, verifyPayment }