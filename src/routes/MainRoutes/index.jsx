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
import Dashboard from "./Dashboard";
import DashboardProfile from "./Dashboard/components/DashboardProfile";
import DashboardCompany from "./Dashboard/components/DashboardCompany";
import DashboardBank from "./Dashboard/components/DashboardBank";
import DashboardLoan from "./Dashboard/components/DashboardLoan";
import DashboardDocuments from "./Dashboard/components/DashboardDocuments";

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
                    <DocumentUpload />
                </ProtectedRoute>
            ),
        },
        // Dashboard with nested routes
        {
            path: "/dashboard",
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "profile",
                    element: (
                        <ProtectedRoute>
                            <DashboardProfile />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "company",
                    element: (
                        <ProtectedRoute>
                            <DashboardCompany />
                        </ProtectedRoute>
                    ),
                },
                {
            path: "company-banks",
                    element: (
                        <ProtectedRoute>
                            <DashboardBank />
                        </ProtectedRoute>
                    ),
                },
                {
            path: "loan-application",
                    element: (
                        <ProtectedRoute>
                            <DashboardLoan />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "document-upload",
                    element: (
                        <ProtectedRoute>
                            <DashboardDocuments />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
    ]);

    return <div>{routes}</div>;
}