
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
<<<<<<< HEAD
    //const url = "https://tomato-food-delivery-app-r3qy.onrender.com";
    const url = "http://localhost:4000";

=======
    //const url = "https://tomato-food-delivery-app-r3qy.onrender.com" ;
     const url = "https://tomato-food-delivery-app-r3qy.onrender.com" ;
>>>>>>> b7be96d49b1d0f3bbc0428712d9bd8e9052ba125
    const [token, setToken] = useState("");
    const [food_list, setFood_list] = useState([]);

    // Socket.IO connection
    useEffect(() => {
        const socket = io(url);

        socket.on("connect", () => {
    console.log("Socket connected:", socket.id);

    socket.emit("new_order_test", {
        message: "Test order received!",
        orderId: "12345"
    });
});

        return () => {
            socket.disconnect();
        };
    }, []);


    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: prev[itemId] + 1
            }));
        }

        if (token) {
            await axios.post(
                url + "/api/cart/add",
                { itemId },
                { headers: { token } }
            );
        }
    };


    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1
        }));

        if (token) {
            await axios.post(
                url + "/api/cart/remove",
                { itemId },
                { headers: { token } }
            );
        }
    };


    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find(
                    (product) => product._id === item
                );

                totalAmount += itemInfo.price * cartItems[item];
            }
        }

        return totalAmount;
    };


    const fetchFoodList = async () => {
        const response = await axios.get(
            url + "/api/food/list"
        );

        setFood_list(response.data.data);
    };


    const loadCartData = async (token) => {
        const response = await axios.post(
            url + "/api/cart/get",
            {},
            { headers: { token } }
        );

        setCartItems(response.data.cartData);
    };


    useEffect(() => {

        async function loadData() {
            await fetchFoodList();

            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));

                await loadCartData(
                    localStorage.getItem("token")
                );
            }
        }

        loadData();

    }, []);


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;

