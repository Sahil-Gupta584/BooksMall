"use client";
import { useState } from "react";
import Card from "./Card";

function ShowCards() {
    const [imgUrls, setImgUrls] = useState([]);
    fetch(
        "https://pixabay.com/api/?key=28620166-8e945f735596b182a40ab2809&q=book&image_type=photo&pretty=true",
    )
        .then((res) => res.json())
        .then((data) => setImgUrls(data.hits.slice(0, 40)));
    // const result = await res.json()
    // setImgUrls(result.hits.slice(0, 50))
    // database
    //     .listDocuments("669a4c190020bf9efea6", "669a4c290017ff62eeaa")
    //     .then((res) => console.log(res))
    //     .catch((err) => console.log(err, "from then"));

    return (
        // <div className="flex p-9">
        <ul className="w-[100%] flex p-9 px-12 justify-center flex-wrap">
            {imgUrls.map((e, i) => (
                <Card src={e.previewURL} key={i} />
            ))}
            {/* <Card /> */}
        </ul>
        // </div>
    );
}

export default ShowCards;
