import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Navigate, Route, Routes } from 'react-router-dom'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Add from './pages/Add/Add'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify'

const App = () => {

  const url = "http://localhost:4000"

  const token = localStorage.getItem("adminToken")

  return (
    <div>

      <ToastContainer />

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