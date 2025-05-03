import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{ backgroundColor: '#2B5782' }} className="p-2 shadow text-white tracking-wider">
            <div className="flex justify-between items-center">
                <div className="text-lg font-bold">stemdash</div>
                <div className="flex gap-4">
                    <Link to="/signup" className="hover:text-blue-300">Sign Up</Link>
                </div>
            </div>
        </nav>
    )
}