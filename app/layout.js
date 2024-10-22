// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import { SocketProvider } from "./context/socketContext";
import { ChatProvider } from "./context/chatContext";
import { ThemeProvider } from './context/themeContext';
import ThemeWrapper from './components/ThemeWrapper';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Booksmall",
  description: "Sell and purchase second hand books to increase productivity",
};

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <ThemeWrapper>
        <SocketProvider>
          <ChatProvider>
            <Nav />
            {children}
          </ChatProvider>
        </SocketProvider>
      </ThemeWrapper>
    </ThemeProvider>
  );
}