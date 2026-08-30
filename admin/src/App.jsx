import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Navigate, Route, Routes } from 'react-router-dom'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Add from './pages/Add/Add'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify'
import { io } from 'socket.io-client'

const App = () => {

<<<<<<< HEAD
  const url = "http://localhost:4000"
  // const url = "https://tomato-food-delivery-app-r3qy.onrender.com"
=======
  const url = "https://tomato-food-delivery-app-r3qy.onrender.com"
>>>>>>> b7be96d49b1d0f3bbc0428712d9bd8e9052ba125

  const token = localStorage.getItem("adminToken")

  // New order notification state
  const [newOrder, setNewOrder] = useState(null)

  // Socket.IO connection
  useEffect(() => {

    const socket = io(url)

    socket.on("connect", () => {
      console.log("Admin socket connected:", socket.id)
    })

    socket.on("new_order", (order) => {
      console.log("🔔 New order received in admin:", order)

      setNewOrder(order)

      // Hide notification after 5 seconds
      setTimeout(() => {
        setNewOrder(null)
      }, 5000)
    })

    socket.on("disconnect", () => {
      console.log("Admin socket disconnected")
    })

    return () => {
      socket.disconnect()
    }

  }, [])

  return (
    <div>

      <ToastContainer />

      {/* New Order Notification */}
      {newOrder && (
        <div className="new-order-notification">
          🔔 New Order Received!
        </div>
      )}

      {!token ? (

        <Routes>

          <Route
            path="/login"
            element={<Login url={url} />}
          />

          <Route
            path="*"
            element={<Navigate to="/login" />}
          />

        </Routes>

      ) : (

        <>

          <Navbar />

          <hr />

          <div className="app-content">

            <Sidebar />

            <Routes>

              <Route
                path="/add"
                element={<Add url={url} />}
              />

              <Route
                path="/list"
                element={<List url={url} />}
              />

              <Route
                path="/orders"
                element={<Orders url={url} />}
              />

              <Route
                path="*"
                element={<Navigate to="/add" />}
              />

            </Routes>

          </div>

        </>

      )}

    </div>
  )
}

export default App
<<<<<<< HEAD

=======
>>>>>>> b7be96d49b1d0f3bbc0428712d9bd8e9052ba125
