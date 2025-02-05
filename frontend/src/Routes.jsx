import React, { useEffect } from "react";
import { useNavigate, useRoutes } from 'react-router-dom';

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/user/CreateRepo";

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem("userId");

        // If a userId is found in localStorage and there's no currentUser in context, set the currentUser
        if (userIdFromStorage && !currentUser) {
            setCurrentUser(userIdFromStorage);
        }

        // If no userId is found and the user is not trying to access the auth or signup page, redirect to login
        if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
            navigate("/auth");
        }

        // If the user is logged in and tries to access the auth page, redirect to home
        if (userIdFromStorage && window.location.pathname === '/auth') {
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    // Define your routes
    let element = useRoutes([
        {
            path: "/",
            element: <Dashboard />
        },
        {
            path: "/auth",
            element: <Login />
        },
        {
            path: "/signup",
            element: <Signup />
        },
        {
            path: "/profile",
            element: <Profile />
        },
        {
            path: "/create",
            element: <CreateRepo />
        }
    ]);

    return element;
};

export default ProjectRoutes;
