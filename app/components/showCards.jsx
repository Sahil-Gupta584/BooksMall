"use client";
import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import { getAllBooks } from "../appwrite/api";

function ShowCards() {
    const [imgUrls, setImgUrls] = useState([]);
    const [books, setBooks] = useState([])
    // fetch(
    //     "https://pixabay.com/api/?key=28620166-8e945f735596b182a40ab2809&q=book&image_type=photo&pretty=true",
    // )
    //     .then((res) => res.json())
    //     .then((data) => setImgUrls(data.hits.slice(0, 40)));

    useEffect(() => {

        (async () => {
            console.log('occured4')
            const allBooks = await getAllBooks()
            setBooks(allBooks)
            const res = await axios.get("https://pixabay.com/api/?key=28620166-8e945f735596b182a40ab2809&q=book&image_type=photo&pretty=true")
            setImgUrls(res.data.hits.slice(0, 40))
            // console.log(res.data.hits.slice(0, 40))
        })()


    }, [])


    return (
        // <div className="flex p-9">
        <section className="w-[100%] flex p-4 px-12 flex-col ">
            <div className="w-full">
                <p className="font-bold">Available Books</p>
                <div className="flex w-full flex-wrap">
                    {books.length > 0 && books.map((b, i) => (
                        <Card book={b} key={i} />
                    ))}
                </div>
            </div>
            <div className="w-full">
                <p className="font-bold">These are just some demo cards to see full funtional card Card make a new by cliking on SELL</p>
                <div className="flex w-full flex-wrap">
                    {imgUrls.map((e, i) => (
                        <Card src={e.previewURL} key={i} />
                    ))}
                </div>
            </div>
        </section>
        // </div>
    );
}

export default ShowCards;
