import Image from 'next/image'
import CoffeeTable from "../../public/categories-img/CoffeeTable.png";


function Card(props) {
    return (
        <div className='m-[8px] max-w-[303.725px] book-card w-[calc(25%_-_16px)] h-[270px] hover:shadow-[0px_0px_5px_0px_brown] rounded-md border-2 border-solid border-[#d97f02] transition-all duration-[0.4] ease-[ease-in-out]'>
            <a href="">
                <figure className='h-[149px] m-[8px] '>

                <img className='w-full object-cover h-full m-auto ' src={props.src} />
                </figure>
                <div className="card-info px-4 py-2">
                    <span className="card-title"> Atomic Habits </span>
                    <span className="card-price"> ₹ 200 </span>
                    <p className="card-desc text-ellipsis whitespace-nowrap overflow-hidden text-[14px] text-[rgba(0,47,52,0.64)]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Et nesciunt possimus ducimus, adipisci ipsum veritatis aperiam recusandae, est aliquid culpa voluptates obcaecati laudantium. Natus ratione a non distinctio dignissimos laborum!
                        Reiciendis qui, molestias eveniet blanditiis impedit voluptatum dignissimos quae laudantium fugit deserunt quia laboriosam temporibus, sint hic possimus omnis molestiae recusandae velit! Sed quod ipsum porro sunt odio quos impedit.
                        Minus, a. Quae ab ipsum laborum vitae, cumque a quas ipsa assumenda culpa nostrum, saepe aperiam debitis suscipit doloribus praesentium mollitia vero repudiandae aliquid iusto. Minima tenetur quaerat vero illo.</p>
                    <div className='flex text-[10px] text-[rgba(0,47,52,0.64)] justify-between'>
                        <span className="location">Mumbai, Maharashtra</span>
                        <span className="time">Yesterday</span>
                    </div>
                </div>
            </a>
        </div>
    )
}

export default Card