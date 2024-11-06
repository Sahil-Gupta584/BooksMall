import { Inter,Baloo_2 } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import { SocketProvider } from "./context/socketContext";
import { ChatProvider } from "./context/chatContext";


const inter = Inter({ subsets: ["latin"] });
const baloo = Baloo_2({ subsets: ["latin"] });

export const metadata = {
  title: "Booksmall",
  description: "Sell and purchase second hand books to increase productivity",
};

export default async function RootLayout({ children }) {

  return (
    <html lang="en" data-theme="light" className="bg-[#f3eaea]">
      <body className={baloo.className}>

        <SocketProvider>
          <ChatProvider>
            <Nav />
            {children}
          </ChatProvider>
        </SocketProvider>

      </body>
    </html>
  );
}
