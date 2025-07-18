import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <header>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                </nav>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    );
}
