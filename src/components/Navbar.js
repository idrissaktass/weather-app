import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import Logo from "../data/logo.png";

const Navbar = () => {
    
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <AppBar sx={{ display: "flex", alignItems: "center", backgroundColor: "#296573" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: { xs: "90%", sm: "80%" }, padding: "10px" }}>
                <Typography fontSize={{ xs: "20px", sm: "24px" }} fontWeight={"700"} onClick={handleRefresh} sx={{ cursor: "pointer" }}>
                    Enos Weather Forecaster
                </Typography>
                <img src={Logo} alt="Logo" />
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
