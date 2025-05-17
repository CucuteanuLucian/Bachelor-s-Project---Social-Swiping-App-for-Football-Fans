import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import ClosestUsers from "../../Components/ClosestUsers/ClosestUsers";

function Dashboard() {
    return(
        <div>
            <NavBar />
            <p>This is the Dashboard Page</p>
            <ClosestUsers />
        </div>
    )

}

export default Dashboard;