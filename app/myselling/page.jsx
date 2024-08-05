"use client";
import { useEffect, useState } from "react";
import { account, database } from "../appwrite/api";
import Link from "next/link";
import { getTimeElapsed } from "../resource";
import Protect from "../components/Protect";
import { Query } from "appwrite";

function MySellings() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    async function fetchUserBooks() {
      try {
        const user = await account.get();
        console.log("user:", user);
        const response = await database.listDocuments(
          "669a4c190020bf9efea6",
          "669a4c290017ff62eeaa",
          [Query.equal("userId", user.$id), Query.orderDesc("$createdAt")]
        );
        console.log(response);
        setBooks(response.documents);
        console.log("books:", books);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load your books. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserBooks();
  }, [books.length]);

  const deletePost = async (book) => {

    try {
      
      console.log(book.$id)
      const res = await database.deleteDocument(
        "669a4c190020bf9efea6",
        "669a4c290017ff62eeaa",
        book.$id
      )
      console.log(res);
      setBooks(prev => prev.filter((b) => b.$id != book.$id))
    } catch (error) {
      console.log(error.message,error,'from deletPost')
    }
  }


  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#d97f02]">My Sellings</h1>
      {/* <p className="text-center">You haven't listed any books yet.</p> */}
      <div className="p-1">
        {books.length > 0 &&
          books.map((book, i) =>
          (<div className="card bg-white m-[1rem] relative card-side shadow-xl h-[13rem] border-2 border-[orange]" key={i} >
            <label htmlFor="my_modal_7" className=" absolute right-2 ">
              <svg
                preserveAspectRatio="xMidYMin"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="cross h-[28px] w-[28px] rotate-90 text-[16px] rounded-xl hover:bg-[#d0c8c8] cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </label>

            <input type="checkbox" id="my_modal_7" className="modal-toggle" />
            <div className="modal" role="dialog">
              <div className="modal-box bg-[wheat] text-[black] mt-1">
                <h2 className="text-center font-bold">Confirm</h2>
                <p className="text-[14px] ">
                  Are you sure you want remove your product from selling? You
                  won't be able to undo this.
                </p>
                <div className="py-4 flex justify-end gap-2">
                  <label
                    htmlFor="my_modal_7"
                    className="btn py-0 px-2 h-[2rem] min-h-[2rem] hover:text-[gray]"
                  >
                    Cancel
                  </label>
                  <label
                    htmlFor="my_modal_7"
                    className="btn border-0 h-[2rem] min-h-[2rem] bg-[red] py-0 px-2 text-[wheat] hover:bg-[palevioletred]"
                    onClick={() => deletePost(book)}
                  >
                    Remove
                  </label>
                </div>
              </div>
              <label className="modal-backdrop" htmlFor="my_modal_7">
                Close
              </label>
            </div>

            <div className=" p-4 card-img-div">
              <img
                src={book.bookImages[book.coverImageIndex]}
                alt="Movie"
                className="w-full h-full object-cover shadow-[0_0_7px_1px_grey]"
              />
            </div>
            <div className="card-divider h-full bg-[gray] w-[1px] "></div>
            <div className="card-body">
              <h2 className="text-600 text-ellipsis whitespace-nowrap">{book.title}</h2>
              <span className="text-lg font-bold text-[#d97f02] block">
                {book.price}
              </span>

              <span className="text-ellipsis whitespace-nowrap text-[rgba(0,47,52,0.64)]">{book.description}</span>
              <div className="card-actions justify-between items-center">
                <div className=" text-xs text-gray-500 mt-2">
                  <p className="my-2">{`${book.state}, ${book.city}`}</p>
                  <p>{getTimeElapsed(book.timestamp)}</p>
                </div>
                <button className="btn border-[black] h-[33px] min-h-[33px] border-2 text-[black] hover:text-[white] hover:bg-[black]">
                  <Link href={`/book/${book.$id}/edit`}>
                  Edit
                  </Link>
                </button>
              </div>
            </div>
          </div>
          ))}
      </div>
    </section>
  );
}

export default Protect(MySellings);
