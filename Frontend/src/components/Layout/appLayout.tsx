import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

 export default function AppLayout() {
    return (
        <div className="cc-shell">
            <Sidebar />
            <Outlet />
        </div>
    );
}