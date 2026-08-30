import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from 'axios';
import { assets } from '../../assets/assets';
import './MyOrders.css'
import { io } from 'socket.io-client';


const MyOrders = () => {

    const [data, setData] = useState([]);

    const { url, token } = useContext(StoreContext);


    const fetchOrders = async () => {
        const response = await axios.post(
            url + "/api/order/userorders",
            {},
            { headers: { token } }
        );

        setData(response.data.data);
        console.log(response.data.data);
    }


    // Fetch orders
    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);


    // Socket.IO - Real-time order status
    useEffect(() => {

        const socket = io(url);

        socket.on("connect", () => {
            console.log("Customer socket connected:", socket.id);
        });

        socket.on("order_status_updated", (updatedOrder) => {

            console.log("Order status updated:", updatedOrder);

            setData((prevData) =>
                prevData.map((order) =>
                    order._id === updatedOrder.orderId
                        ? {
                            ...order,
                            status: updatedOrder.status
                        }
                        : order
                )
            );

        });

        socket.on("disconnect", () => {
            console.log("Customer socket disconnected");
        });


        return () => {
            socket.disconnect();
        };

    }, [url]);


    return (
        <div className='my-orders'>

            <h2>My Orders</h2>

            <div className="container">

                {data.map((order, index) => {

                    return (

                        <div
                            key={index}
                            className='my-orders-order'
                        >

                            <img
                                src={assets.parcel_icon}
                                alt=""
                            />

                            <p>
                                {order.items.map((item, index) => {

                                    if (index === order.items.length - 1) {

                                        return item.name + " x " + item.quantity

                                    }
                                    else {

                                        return item.name + " x " + item.quantity + ","

                                    }

                                })}
                            </p>

                            <p>
                                ₹{order.amount}.00
                            </p>

                            <p>
                                Items: {order.items.length}
                            </p>

                            <p>
                                <span>&#x25cf;</span> <b>{order.status}</b>
                            </p>

                            <button onClick={fetchOrders}>
                                Track Order
                            </button>

                        </div>

                    )

                })}

            </div>

        </div>
    )
}

export default MyOrders

