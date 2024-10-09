"use client";
import { useEffect, useState } from "react";
import SellBtn from "./Sellbtn/SellBtn";
import { usePathname, useRouter } from "next/navigation";
import { account, getUser, verifyLogin } from "../appwrite/api";
import Link from "next/link";
import BookAnimation from "./BookAnimation"; // Import the book animation component

function Nav() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showBookAnimation, setShowBookAnimation] = useState(false); // State for book animation
    const pathname = usePathname();
    const router = useRouter();

    // Effect to verify login and set user data
    useEffect(() => {
        async function fetch() {
            const res = await verifyLogin();
            if (res) {
                setLoggedIn(true);
                const user = await getUser(res.$id);
                setUser(user);
            }
        }
        fetch();
    }, [router]);

    // Scroll effect to toggle blur
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const shouldHideSellBtn =
        pathname === "/auth" ||
        pathname.startsWith("/book/") ||
        pathname.startsWith("/chat") ||
        pathname === "/sell";

    const handleSignUpClick = () => {
        setShowBookAnimation(true);
        setTimeout(() => {
            // Navigate to sign-up page or handle the form toggle here
            router.push("/auth/signup");
        }, 3000); // Adjust the timing to match the animation duration
    };

    const handleProfileClick = () => {
        setShowBookAnimation(true);
        // Navigate to profile page after animation
        setTimeout(() => {
            router.push("/profile"); // Change this to your profile route
        }, 3000);
    };

    const handleLogOutClick = async () => {
        setShowBookAnimation(true);
        await account.deleteSessions();
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    return (
        <>
            <nav
                className={`navbar ${pathname === "/auth" ? "hidden" : ""}
                    bg-[#d97f02] shadow-[0_3px_6px_0_rgba(50,50,50,0.3)]
                    fixed top-0 w-full z-50 transition-all duration-300
                    ${isScrolled ? "backdrop-blur-lg bg-opacity-80" : "bg-opacity-100"}`}
            >
                <div className="flex-1">
                    <Link className="btn btn-ghost text-xl" href="/">
                        BooksMall
                    </Link>
                    <input
                        type="text"
                        placeholder="Search"
                        className="search input input-bordered w-24 w-[62%] bg-[wheat] border-0 h-[2.7rem] ml-[13px]"
                    />
                </div>
                <div className="flex-none gap-2">
                    <div className={`${shouldHideSellBtn ? "hidden" : ""}`}>
                        <SellBtn />
                    </div>

                    <div className="dropdown dropdown-end m-2">
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
                        </div>
                        <section
                            tabIndex={0}
                            className="menu menu-sm dropdown-content rounded-md shadow-lg z-[1] mt-3 w-fit p-2 bg-[wheat]"
                        >
                            {!loggedIn ? (
                                <li className="px-2 hover:text-[grey] hover:cursor-pointer">
                                    <Link href="/auth" className="px-[18px] py-[4px] cursor-pointer hover:underline">
                                        Login
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <div className="flex gap-2 mb-4">
                                        <div className="avatar">
                                            <div className="w-12 rounded-full">
                                                <img src={user?.avatarUrl} alt="User avatar" />
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="font-bold">{user?.name}</h2>
                                            <span className="text-sm text-[rgba(0,47,52,0.64)]">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                    <li className="hover:text-[grey] hover:cursor-pointer">
                                        <Link href="/myselling" prefetch className="p-2">
                                            My sellings
                                        </Link>
                                    </li>
                                    <li className="hover:text-[grey] hover:cursor-pointer">
                                        <Link href="/chat" prefetch className="p-2">
                                            My Chats
                                        </Link>
                                    </li>
                                    <hr className="bg-[black] border-black mt-2" />
                                    <li className="pt-1">
                                        <button
                                            className="border-0 outline-0 hover:bg-[gray] hover:text-[white] py-0 px-2"
                                            onClick={handleLogOutClick} // Trigger animation on logout
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

            {/* Render book animation when triggered */}
            {showBookAnimation && <BookAnimation />}
        </>
    );
}

export default Nav;
