import Link from "next/link";
import { BsMailbox, BsTwitterX } from "react-icons/bs";
import { FaBookOpen, FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <FaBookOpen className="h-8 w-8 text-primary-300" />
              <span className="ml-2 text-xl font-serif font-bold text-white">
                BooksMall
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              A marketplace for book lovers to buy and sell used and new books.
              Find rare books, textbooks, and bestsellers at great prices.
            </p>
            <div className="flex mt-6 space-x-4">
              <a
                href="https://x.com/sahil_builds"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://x.com/sahil_builds"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <BsTwitterX size={20} />
              </a>
              <a
                href="https://x.com/sahil_builds"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://x.com/sahil_builds"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <BsMailbox size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Browse</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  All Books
                </Link>
              </li>
              <li>
                <Link
                  href="/?search=Fiction"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/?search=Non-Fiction"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/?search=Classic"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Classics
                </Link>
              </li>
              <li>
                <Link
                  href="/?search=New"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  New Books
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sell"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sell Books
                </Link>
              </li>
              <li>
                <Link
                  href="/chats"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  My Messages
                </Link>
              </li>
              <li>
                <a
                  href="https://x.com/sahil_builds"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  My Orders
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/sahil_builds"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  My Listings
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/sahil_builds"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  My Profile
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://x.com/sahil_builds"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/sahil_builds"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/sahil_builds"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Return Policy
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/sahil_builds"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/sahil_builds"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} BooksMall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
