// app/layout.js (or app/layout.jsx)
import { Inter } from "next/font/google";
import { ThemeProvider } from 'next-themes';  // Import ThemeProvider from next-themes
import "./globals.css";
import Nav from "./components/Nav";
import { SocketProvider } from "./context/socketContext";
import { ChatProvider } from "./context/chatContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Booksmall",
  description: "Sell and purchase second-hand books to increase productivity",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Wrap everything inside ThemeProvider */}
      <ThemeProvider attribute="class">
        <body className={`${inter.className} bg-[#f3eaea]`}>
          <SocketProvider>
            <ChatProvider>
              <Nav />
              {children}
            </ChatProvider>
          </SocketProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
