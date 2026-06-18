import React from "react";
import { useRoutes } from "react-router-dom";

import Home from "./Home";
import Signup from "../../container/Auth/Signup";
import Login from "../../container/Auth/Login";
import Profile from "../../container/Profile";

import ProtectedRoute from "./ProtectedRoute";
import Company from "../../container/Company";
import CompanyBanks from "../../container/CompanyBanks";
import LoanApplication from "../../container/LoanApplication";
import DocumentUpload from "../../container/DocumentUpload";

export default function MainRoutes(props) {
    const routes = useRoutes([
        {
            path: "",
            element: <Home {...props} />,
        },
        {
            path: "/login",
            element: <Login {...props} />,
        },
        {
            path: "/signup",
            element: <Signup {...props} />,
        },
        {
            path: "/profile",
            element: (
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            ),
        },

        {
            path: "/company",
            element: (
                <ProtectedRoute>
                    <Company />
                </ProtectedRoute>
            ),
        },
     

        {
            path: "/company-banks",
            element: (
                <ProtectedRoute>
                    <CompanyBanks />
                </ProtectedRoute>
            ),
        },

           {
            path: "/loan-application",
            element: (
                <ProtectedRoute>
                    <LoanApplication />
                </ProtectedRoute>
            ),
        },

        {
            path: "/document-upload",
            element: (
                <ProtectedRoute>
                    <DocumentUpload/>
                </ProtectedRoute>
            ),
        },
    ]);

    return <div>{routes}</div>;
}