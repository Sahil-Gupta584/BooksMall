"use client";
import { useEffect, useState } from "react";
import SellBtn from "./Sellbtn/SellBtn";
import { usePathname, useRouter } from "next/navigation";
import {  getCurrUser, logOut, verifyLogin } from "../actions/api";
import Link from "next/link";
import { getBooks } from "../actions/api"; // Ensure this is imported
import { useSocket } from "../context/socketContext";

function Nav() {
    const [books, setBooks] = useState([]); // To store all books
    const [searchQuery, setSearchQuery] = useState(""); // To store search input
    const [filteredBooks, setFilteredBooks] = useState([]); // To store filtered books
    const pathname = usePathname();
    const {currUser}= useSocket();


    useEffect(() => {
        async function fetchBooks() {
            const allBooks = await getBooks();
            setBooks(allBooks);
        }
        fetchBooks();
    }, []);

    // Filter books based on the search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredBooks([]); // No query, no filtered books
        } else {
            const filtered = books.filter((book) =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.city.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBooks(filtered);
        }
    }, [searchQuery, books]);

    const shouldHideSellBtn =
        pathname === "/auth" ||
        pathname.startsWith("/book/") ||
        pathname.startsWith("/chat") ||
        pathname === "/sell";


    return (
        <nav className={`navbar ${pathname == "/auth" ? "hidden" : ""} bg-[#d97f02] shadow-[0_3px_6px_0_rgba(50,50,50,0.3)] `}>
            <div className="flex items-center w-full relative">
                <Link className="btn btn-ghost text-xl" href="/">
                    BooksMall
                </Link>
                <div className="relative w-[62%] ml-[13px]">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                        className="search input input-bordered w-full bg-[wheat] border-0 h-[2.7rem] pl-4"
                    />
                    <div className={`dropdown-content absolute bg-white shadow mt-2 p-2 w-full z-50 ${filteredBooks.length > 0 || searchQuery ? "block" : "hidden"}`}>
                        {filteredBooks.length > 0 ? (
                            <ul>
                                {filteredBooks.map((book, i) => (
                                    <li key={i} className="p-2 border-b border-gray-200">
                                        <Link href={`/book/${book.$id}`}>
                                            <div>
                                                <p className="font-bold">{book.title}</p>
                                                <p className="text-sm text-gray-600">
                                                    {book.category}, {book.state} - {book.city}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : searchQuery && (
                            <p className="p-2 text-gray-500">No results found</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-none gap-2">
                <div className={`${shouldHideSellBtn ? "hidden" : ""}`} >

                    <SellBtn />
                </div>

                <div className="dropdown dropdown-end m-2" >
                    <div>
                        <a
                            tabIndex={0}
                            role="button"
                            className="profile-lg flex items-center group justify-start w-42 px-3 py-2 transition-all duration-150 ease-in-out hover:bg-hover hover:text-base-content active:bg-active active:text-base-content h-[47px] bg-[#ffdfa4] rounded-md border-2 border-solid border-[orange]"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-base-content w-[20px] h-[20px] group-hover:scale-125 group-hover:-rotate-3 duration-150 ease-in-out"
                            >
                                <circle cx="12" cy="8" r="5"></circle>
                                <path d="M20 21a8 8 0 0 0-16 0"></path>
                            </svg>
                            <span className="font-medium text-base-content text-sm">
                                My Profile
                            </span>
                        </a>
                        <a
                            tabIndex={0}
                            role="button"
                            className="profile-sm hidden flex items-center group justify-start transition-all duration-150 ease-in-out text-base-content/60 hover:bg-hover hover:text-base-content active:bg-active active:text-base-content h-[47px] bg-[#ffdfa4]"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-base-content w-[20px] h-[20px] group-hover:scale-125 group-hover:-rotate-3 duration-150 ease-in-out"
                            >
                                <circle cx="12" cy="8" r="5"></circle>
                                <path d="M20 21a8 8 0 0 0-16 0"></path>
                            </svg>
                        </a>
                    </div>
                    <section
                        tabIndex={0}
                        className="menu menu-sm dropdown-content rounded-md shadow-[rgba(0,0,0,0.25)_0px_54px_55px,rgba(0,0,0,0.12)_0px_-12px_30px,rgba(0,0,0,0.12)_0px_4px_6px,rgba(0,0,0,0.17)_0px_12px_13px,rgba(0,0,0,0.09)_0px_-3px_5px] z-[1] mt-3 w-fit p-2 bg-[wheat]"
                    >
                        {!currUser ?
                            (
                                <li className="px-2 hover:text-[grey] hover:cursor-pointer">
                                    <Link
                                        prefetch
                                        href="/auth"
                                        className=" px-[18px] py-[4px] cursor-pointer hover:underline"
                                    >
                                        Login
                                    </Link>
                                </li>
                            ) :
                            (
                                <>
                                    <div className="flex gap-2 mb-4">
                                        <div className="avatar">
                                            <div className="w-12 rounded-full">
                                                <img src={`https://api.multiavatar.com/${currUser.email}.svg`} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h2 className="font-bold ">{currUser?.name}</h2>
                                            <p className="font-semibold  text-sm text-[rgba(0,47,52,0.64)]">{currUser?.email}</p>

                                        </div>
                                    </div>
                                    <li className=" hover:text-[grey] hover:cursor-pointer">
                                        <Link href='/myselling' prefetch >
                                            My sellings
                                        </Link>
                                    </li>
                                    <li className=" hover:text-[grey] hover:cursor-pointer">
                                        <Link href='/chat' prefetch >
                                            My Chats
                                        </Link>
                                    </li>
                                    <li className=" hover:text-[grey] hover:cursor-pointer">
                                        <Link href='/feedback' prefetch >
                                            Give us Feedback 🤗
                                        </Link>
                                    </li>
                                    <hr className="bg-[black] border-black mt-2" />
                                    <li className="pt-1">
                                        <button
                                            className="border-0 outline-0 hover:bg-[gray] hover:text-[white] py-0 px-2"
                                            onClick={async () => {
                                                await logOut();
                                            }}
                                        >
                                            Log out
                                        </button>
                                    </li>
                                </>
                            )}
                    </section>
                </div>

            </div>
        </nav>
    );
}

export default Nav;
