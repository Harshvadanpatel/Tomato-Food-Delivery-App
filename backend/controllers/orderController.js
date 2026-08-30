import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { getIO } from "../socket.js";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// placing user order from frontend
const placeOrder = async (req,res) => {

    const frontend_url = "http://localhost:5173";




    if (!stripe) {
        return res.status(500).json({ success: false, message: "Stripe is not configured" });
    }

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();

        const io = getIO();

        io.emit("new_order", {
            orderId: newOrder._id,
            amount: newOrder.amount,
            items: newOrder.items
        });

        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}



const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}
// user orders for frontend

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}
// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}
// api for updating order status
const updateStatus = async (req,res) => {
    try {

        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.body.orderId,
            { status: req.body.status },
            { new: true }
        );

        const io = getIO();

        io.emit("order_status_updated", {
            orderId: updatedOrder._id,
            status: updatedOrder.status
        });

        res.json({
            success: true,
            message: "Status Updated"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        });
    }
}


export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}