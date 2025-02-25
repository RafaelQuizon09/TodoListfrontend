import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import Login from './AuthComponents/Login.jsx'
import Signup from './AuthComponents/Signup.jsx'
import ErrorLayout from './RootLayouts/errorLayout.jsx'
import { RouterProvider } from 'react-router-dom'
import Dashboard from './TodoComponents/Dashboard.jsx'

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
},
{
  path: "/login",
  element: <Login />,
},
{ path: "/signup",
  element: <Signup />
},
{
  path: "/dashboard",
  element: <Dashboard />
},
{
  path: "*",
  element: <ErrorLayout />
}]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
