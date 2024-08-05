'use client';
import { useEffect, useState } from 'react';
import { getBook } from '@/app/appwrite/api';
import Carousel from '@/app/components/Carousel/Carousel';
import conditionIcon from '@/public/categories-img/conditionIco.webp';
import categoryIcon from '@/public/categoryIcon.png';

export default function Component({ params }) {
    const [bookData, setBookData] = useState(null);

    useEffect(() => {
        console.log(params)
        getBook(params.bookId).then(res => {
            console.log(res);
            setBookData(res);
        });
    }, [params]);

    if (!bookData) {
        return <div className="loading universal loading-spinner h-[91vh] w-[100vw]"></div>;
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 w-full">
                <Carousel images={bookData.bookImages} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-3xl font-bold mb-2 break-words">{bookData.title}</h1>
                        <div className="border-t-[2px] border-gray-200 pt-4 mt-4">
                            <h2 className="text-xl font-semibold mb-2">Overview</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                                    </svg>
                                    <span>Seller: {bookData.seller.name || 'Unknown'}</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                                    </svg>
                                    Location:
                                    <span> {bookData.city}, {bookData.state}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className='h-[20px] w-[20px] '>
                                        <img src={conditionIcon.src} className='object-cover' alt='' />
                                    </span>
                                    <span>Condition: {bookData.condition}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-[20px] h-[20px] ">
                                        <img src={categoryIcon.src} alt="" />
                                    </span>
                                    <span>Category: {bookData.category}</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t-[2px] border-gray-200 pt-4 mt-4">
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p className="text-gray-600">{bookData.description}</p>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold mb-4">₹ {bookData.price}</h2>
                        <button className="w-full bg-[#d97f02] hover:bg-[#bd6f02] text-white font-bold py-2 px-4 rounded mb-4">
                            Make offer
                        </button>
                    </div>
                </div>
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold mb-4">Seller</h2>
                        <div className="flex justify-start mb-4 items-center gap-2">
                            <div className="avatar">
                                <div className="w-16 h-16 rounded-full">
                                    <img src={bookData.seller.avatarUrl} />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold ">
                                {bookData.seller.name}
                            </h2>
                        </div>

                        <button className="w-full bg-white hover:bg-gray-100 text-[#d97f02] font-semibold py-2 px-4 border border-[#d97f02] rounded">
                            Chat with seller
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}