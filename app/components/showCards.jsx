"use client";
import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import { getBooks, uploadAll } from "../actions/api";

function ShowCards() {
    const [books, setBooks] = useState([])

    useEffect(() => {

        (async () => {
            const allBooks = await getBooks();
            console.log('allbooks:',allBooks);
            
            setBooks(allBooks)
        })()
    }, [])


    return (
        // <div className="flex p-9">
        <section className="w-[100%] flex md:p-4 p-0 flex-col ">
            <div className="w-full">
                <p className="font-bold text-center md:text-start">Available Books</p>
                <div className="w-full flex flex-wrap justify-center md:justify-start">
                    {books.length > 0 && books.map((b, i) => (
                        <Card book={b} key={i} />
                    ))}
                </div>
            </div>
        </section>
        // </div>
    );
}

export default ShowCards;
