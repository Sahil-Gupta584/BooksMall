'use client';
import { useEffect, useState } from 'react';
import { getBook, getUser } from '@/app/actions/api';
import Carousel from '@/app/components/Carousel/Carousel';
import conditionIcon from '@/public/categories-img/conditionIco.webp';
import categoryIcon from '@/public/categoryIcon.png';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

function Page({ params }) {
    const [bookData, setBookData] = useState(null);
    const { data } = useSession();
    useEffect(() => {

        (async () => {
            const book = await getBook(params.bookId);
            console.log('book', book);

            const owner = await getUser(book.ownerId)
            setBookData({ ...book, seller: { ...owner } });
            console.log('book;', book);
        })()

    }, [params.bookId]);

    if (!bookData) {
        return <div className="loading universal loading-spinner h-[91vh] w-[100vw]"></div>;
    }




    if (bookData) {
        console.log('bookData', bookData)
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
                                        <span>Seller: {bookData.seller?.name || 'Unknown'}</span>
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

                            {!data?.user ?
                                <Link
                                    href='/chat'
                                    className="w-full bg-white hover:bg-[#d97f02] text-[#d97f02] hover:text-white font-semibold py-2 px-4 border border-[#d97f02] rounded transition"
                                >
                                    Chat With Seller
                                </Link> : (data?.user.id !== bookData.seller.id) ? <Link
                                    href='/chat'
                                    className="w-full bg-white hover:bg-[#d97f02] text-[#d97f02] hover:text-white font-semibold py-2 px-4 border border-[#d97f02] rounded transition"
                                >
                                    Chat With Seller
                                </Link> : <Link
                                    href={`/book/${bookData.id}/edit`}
                                    className="w-full bg-white hover:bg-[#d97f02] text-[#d97f02] hover:text-white font-semibold py-2 px-4 border border-[#d97f02] rounded transition"
                                >
                                    Edit
                                </Link>}
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md w-fit">
                            <h2 className="text-3xl font-bold mb-4">Seller</h2>
                            <div className="flex justify-start mb-6 items-center gap-2 ">
                                <div className="avatar">
                                    <div className="w-16 h-16 rounded-full">
                                        <img src={`https://api.multiavatar.com/${bookData.seller.email}.svg`} />
                                    </div>
                                </div>
                                <h2 className="font-bold ">
                                    {bookData.seller.name ? bookData.seller.name : bookData.seller.email}
                                </h2>
                            </div>

                            {!data?.user ?
                                <Link
                                    href='/chat'
                                    className="w-full bg-white hover:bg-[#d97f02] text-[#d97f02] hover:text-white font-semibold py-2 px-4 border border-[#d97f02] rounded transition"
                                >
                                    Chat With Seller
                                </Link> : (data?.user.id !== bookData.seller.id) ? <Link
                                    href='/chat'
                                    className="w-full bg-white hover:bg-[#d97f02] text-[#d97f02] hover:text-white font-semibold py-2 px-4 border border-[#d97f02] rounded transition"
                                >
                                    Chat With Seller
                                </Link> : ''
                            }
                        </div>
                    </div>
                </div>

            </div>

        )
    }
}

export default Page