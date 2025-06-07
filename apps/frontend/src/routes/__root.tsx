import { createRootRoute, Outlet } from "@tanstack/react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../global.css";
export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
