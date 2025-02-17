"use client";
import { useEffect, useState } from "react";
import Card from "./Card";
import { getAllBooks } from "../actions/api";

function ShowCards() {
    const [books, setBooks] = useState([])

    useEffect(() => {

        (async () => {
            console.log('occured4')
            const allBooks = await getAllBooks();
            console.log('allbooks:', allBooks);

            setBooks(allBooks)
        })()


    }, [])


    return (
        <section className="">
            <p className="font-bold text-center md:text-start pl-4">Available Books</p>
            <div className="w-full grid grid-cols-2 gap-4 sm:gap-8 p-4 sm:flex flex-wrap justify-center md:justify-start ">
                {books.length > 0 && books.map((b, i) => (
                    <Card book={b} key={i} />
                ))}
            </div>
        </section>
    );
}

export default ShowCards;
