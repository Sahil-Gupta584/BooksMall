import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import { SocketProvider } from "./context/socketContext";
import { ChatProvider } from "./context/chatContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Booksmall",
  description: "Sell and purchase second hand books to increase productivity",
};

export default async function RootLayout({ children }) {

  return (
    <html lang="en" data-theme="light" className="bg-[#f3eaea]">
      <body className={inter.className}>

        <SocketProvider >
          <ChatProvider>
            <Nav />
            {children}
          </ChatProvider>
        </SocketProvider>

      </body>
    </html>
  );
}
