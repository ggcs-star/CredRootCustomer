import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./container/Navbar/index";
import Routes from "./routes";
import Footer from "./container/Footer/index";
import { Toaster } from "react-hot-toast";

const MainApp = (props) => {
    return (
        <>
            <Router>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            minWidth: "300px",
                            padding: "18px 22px",
                            borderRadius: "18px",
                            fontSize: "15px",
                            fontWeight: "500",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                            border: "1px solid rgba(255,255,255,0.08)",
                        },
                    }}
                />

                <div className="relative min-h-[100vh] flex flex-col">
                    <Navbar {...props} />

                    <div className="flex-1">
                        <Routes {...props} />
                    </div>

                    <Footer />
                </div>
            </Router>
        </>
    );
};

export default MainApp;