import { Inter } from "next/font/google";

import Nav from "./components/Nav";
import { ChatProvider } from "./context/chatContext";
import { SocketProvider } from "./context/socketContext";

import "./globals.css";
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
            <div className="container mx-auto flex justify-between items-center">
             
             <p className="italic"></p>
             </div>
           <footer className="bg-[#d97f02] text-white p-6"> {/* Assuming navbar color is #333 */}
           <div className="container mx-auto flex justify-between items-center">
               <div>
                 <h5 className="font-bold text-lg">Booksmall</h5>
                 <p>© 2023 Booksmall. All rights reserved.</p>
               </div>
               <div>
                 <h5 className="font-bold text-lg">Quick Links</h5>
                 <ul>
                   <li><a href="/about" className="hover:underline">About Us</a></li>
                   <li><a href="/contact" className="hover:underline">Contact</a></li>
                   <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                 </ul>
               </div>
               <div>
                 <h5 className="font-bold text-lg">Follow Us</h5>
                 <div className="flex space-x-4">
                   <a href="https://facebook.com" className="hover:underline">
                     <img src="./image.png" alt="Facebook" className="w-6 h-6" />
                   </a>
                   <a href="https://twitter.com" className="hover:underline">
                     <img src="./X.png" alt="Twitter" className="w-6 h-6" />
                   </a>
                   <a href="https://instagram.com" className="hover:underline">
                     <img src="./insta.png" alt="Instagram" className="w-6 h-6" />
                   </a>
                 </div>
               </div>
               <div>
                 <h5 className="font-bold text-lg">Contact Us</h5>
                 <p>Email: support@booksmall.com</p>
                 <p>Phone: +123 456 7890</p>
                 </div>
                 </div>
               </footer>
            
          </ChatProvider>
        </SocketProvider>

      </body>
    </html>
  );
}
