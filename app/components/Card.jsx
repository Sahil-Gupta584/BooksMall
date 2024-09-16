import { getTimeElapsed } from "../resource"

function Card({book ,src}) {

    return (
        <div className='m-[8px] max-w-[303.725px] book-card w-[calc(25%_-_16px)] h-fit hover:shadow-[0px_0px_5px_0px_brown] rounded-md border-2 border-solid border-[#d97f02] transition-all duration-[0.4] ease-[ease-in-out]'>
            <a href={`/book/${book?.$id}`}>
                <figure className='h-[149px] m-[8px] '>

                    <img className='w-full object-cover h-full m-auto ' src={src || book?.bookImages[book?.coverImageIndex]} />
                </figure>
                <div className="card-info px-4 py-2">
                    <span className="card-title"> {book?.title || 'Atomic Habits'} </span>
                    <span className="card-price"> {book?.price || '₹ 200'} </span>
                    <p className="card-desc text-ellipsis whitespace-nowrap overflow-hidden text-[14px] text-[rgba(0,47,52,0.64)]">
                        { book?.description ||"some random description of the book"}  
                    </p>
                    <div className='flex text-[10px] text-[rgba(0,47,52,0.64)] justify-between'>
                        <span className="location">{ `${book?.state}, ${book?.city}` ||'Mumbai, Maharashtra'}</span>
                        <span className="time">{getTimeElapsed(book?.timestamp)}</span>
                    </div>
                </div>
            </a>
        </div>
    )
}

export default Card