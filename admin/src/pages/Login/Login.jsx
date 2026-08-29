import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ url }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post(
                `${url}/api/user/login`,
                {
                    email,
                    password
                }
            );

            if (response.data.success) {

                if (!response.data.isAdmin) {
                    alert("Access denied. Admin account required.");
                    return;
                }

                localStorage.setItem(
                    "adminToken",
                    response.data.token
                );

                window.location.href = "/add";

            } else {
                alert(response.data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Login failed");
        }
    };

    return (
        <div className="login">

            <form
                onSubmit={onSubmitHandler}
                className="login-container"
            >

                <h2>Admin Login</h2>

                <div className="login-inputs">

                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                </div>

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
};

export default Login;