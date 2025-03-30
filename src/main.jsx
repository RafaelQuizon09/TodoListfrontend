import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './AuthComponents/Login.jsx';
import Signup from './AuthComponents/Signup.jsx';
import ErrorLayout from './RootLayouts/ErrorLayout.jsx';
import Dashboard from './TodoComponents/Dashboard.jsx';
import Profile from './AuthComponents/Profile.jsx'; // Create this component

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />, 
    children: [
      { path: "profile", element: <Profile /> }, // Nested route: /dashboard/profile
    ],
  },
  {
    path: "*",
    element: <ErrorLayout />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

