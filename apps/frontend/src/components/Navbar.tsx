import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BiMenu, BiMessageSquare } from "react-icons/bi";
import {
  FaBook,
  FaBookOpen,
  FaCommentDots,
  FaSearch,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { FiMessageSquare } from "react-icons/fi";
import { signOut, useSession } from "../lib/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const { data } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/",
      search: (prev) => ({ ...prev, search: searchQuery }),
    });
    setIsMenuOpen(false); // hide menu after search
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaBookOpen className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-serif font-bold text-primary-700">
                BooksMall
              </span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for books..."
                  className="input pr-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/sell" className="btn btn-primary">
              Sell a Book
            </Link>
            {!data ? (
              // Show chats icon as redirect to login
              <Link
                to="/chats"
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <FiMessageSquare className="h-6 w-6 text-gray-600" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
              </Link>
            ) : null}

            {!data && (
              <Link
                to="/login"
                className="hover:bg-primary-400 p-2 rounded-md transition hover:text-white"
              >
                Login
              </Link>
            )}

            {data && (
              <Dropdown>
                <DropdownTrigger>
                  <button className="btn hover:btn-primary">
                    <FaUser />
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions">
                  <DropdownItem key="profile">
                    <div className="flex items-center gap-2 border-b-2 pb-2 border-b-gray-400">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={data.user.image as string}
                      />
                      <ul>
                        <li className="text-lg capitalize">{data.user.name}</li>
                        <li className="text-sm text-gray-500">
                          {data.user.email}
                        </li>
                      </ul>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="myListings"
                    startContent={<FaBook className="text-primary-500" />}
                  >
                    <Link to="/myListings" className="block w-full">
                      My Listings
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    key="chats"
                    startContent={
                      <FiMessageSquare className="text-primary-500" />
                    }
                  >
                    <Link to="/chats" className="block w-full">
                      Chats
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    key="feedbacks"
                    startContent={
                      <FaCommentDots className="text-primary-500" />
                    }
                  >
                    <Link to="/feedbacks" className="block w-full">
                      Feedbacks
                    </Link>
                  </DropdownItem>

                  <DropdownItem
                    key="logout"
                    startContent={<FaSignOutAlt className="text-red-500" />}
                    onPress={() =>
                      signOut({
                        fetchOptions: {
                          onSuccess: () => navigate({ to: "/login" }),
                        },
                      })
                    }
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            {!data && (
              <Link to="/sell" className="btn btn-primary">
                Sell a Book
              </Link>
            )}
            {data && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? (
                  <FaX className="block h-6 w-6" />
                ) : (
                  <BiMenu className="block h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for books..."
                  className="input pr-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </form>

            <Link
              to="/sell"
              className="btn btn-primary w-full flex justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Sell a Book
            </Link>

            <Link
              to="/chats"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <BiMessageSquare className="mr-3 h-6 w-6 text-gray-500" />
              Messages
            </Link>

            {data && (
              <div className="space-y-2 mt-2">
                <Link
                  to="/myListings"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaBook className="mr-2 text-primary-500" />
                  My Listings
                </Link>

                <Link
                  to="/feedbacks"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaCommentDots className="mr-2 text-primary-500" />
                  Feedbacks
                </Link>

                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
