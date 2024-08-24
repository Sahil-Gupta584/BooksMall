// "use client";
// import { useState, useRef, useEffect } from "react";
// import addPhoto from "@/public/addphoto.png";
// import { database, updateBook } from "../../appwrite.js";
// import { useRouter } from "next/navigation";
// import { CurrentLocation, CustomLocation } from "@/app/components/Location";
// import Protect from "@/app/components/Protect";

// const Edit = ({ params }) => {
//     const [coverImageIndex, setCoverImageIndex] = useState(0);
//     const [images, setImages] = useState([]);
//     const router = useRouter();

//     const [bookData, setBookData] = useState({
//         title: "",
//         category: "",
//         price: "",
//         condition: "",
//         description: "",
//         state: "",
//         city: ""
//     });

//     const formRef = useRef(null);

//     useEffect(() => {
//         console.log(params)
//         const { bookId } = params;
//         async function getBook() {
//             try {

//                 const book = await database.getDocument(
//                     "669a4c190020bf9efea6",
//                     "669a4c290017ff62eeaa",
//                     bookId
//                 )
//                 console.log('book:', book)

//                 setBookData({
//                     title: book.title || "",
//                     category: book.category || "",
//                     price: book.price || "",
//                     condition: book.condition || "",
//                     description: book.description || "",
//                     state: book.state || '',
//                     city: book.city || ''
//                 });
//                 setImages([...book.bookImages]);
//                 setCoverImageIndex(book.coverImageIndex);
//                 console.log('done')
//                 console.log('bookData:', bookData)
//                 console.log('images:', images)
//             } catch (error) {
//                 console.log(error.message, error, 'from edit book')
//             }
//         }
//         getBook()
//         console.log(images)
//     }, [params.bookId])

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setBookData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handleImageUpload = (e) => {
//         const files = Array.from(e.target.files);
//         const remainingSlots = 5 - images.length;
//         const filesToAdd = files.slice(0, remainingSlots);
//         setImages((prevImages) => [...prevImages, ...filesToAdd]);
//         console.log
//     };

//     const handleSubmit = async (e) => {

//         e.preventDefault();
//         console.log(bookData,images,coverImageIndex)

//         if (formRef.current.checkValidity() && images.length > 0) {
//             try {
//                 console.log("started");
//                 // const res = await saveToDb(bookData, coverImageIndex, images);
//                 const res = await updateBook(params.bookId,bookData, coverImageIndex, images);
//                 console.log(res);
//                 if (res) router.push("/");
//             } catch (err) {
//                 console.log(err.message, err, "from handleSubmit");
//             }
//         } else {
//             // Show error message or highlight missing fields
//             formRef.current.reportValidity();
//         }
//     };

//     const handleRemoveImage = (index) => {
//         setImages((prevImages) => prevImages.filter((_, i) => i !== index));
//         if (coverImageIndex === index) {
//             setCoverImageIndex(0);
//         } else if (coverImageIndex > index) {
//             setCoverImageIndex(coverImageIndex - 1);
//         }
//     };

//     const handleSetCoverImage = (index) => {
//         setCoverImageIndex(index);
//     };

//     return (
//         <div className="max-w-2xl mx-auto p-4">
//             <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//                 Sell Your Book
//             </h1>
//             <form
//                 ref={formRef}
//                 onSubmit={handleSubmit}
//                 className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//             >
//                 <div className="mb-4">
//                     <label
//                         className="block text-gray-700 text-sm font-bold mb-2"
//                         htmlFor="title"
//                     >
//                         Book Title:
//                     </label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight form-input "
//                         id="title"
//                         type="text"
//                         name="title"
//                         value={bookData.title}
//                         onChange={handleChange}
//                         minLength="10"
//                         maxLength="70"
//                         required
//                         autoComplete="on"
//                     />
//                     <div className="flex text-[12px]">
//                         <span className="flex-1 text-red ">
//                             A minimum length of 10 characters is required.
//                         </span>
//                         <span className="rui-pzHe1 rui-DTzlG">
//                             {bookData.title.length} / 70
//                         </span>
//                     </div>
//                 </div>
//                 <div className="mb-4">
//                     <label
//                         className="block text-gray-700 text-sm font-bold mb-2"
//                         htmlFor="category"
//                     >
//                         Category:
//                     </label>
//                     <select
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight form-input focus:shadow-outline"
//                         id="category"
//                         name="category"
//                         value={bookData.category}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select a category</option>
//                         <option value="fiction">Fiction</option>
//                         <option value="non-fiction">Non-Fiction</option>
//                         <option value="mystery">Mystery</option>
//                         <option value="sci-fi">Science Fiction</option>
//                         <option value="biography">Biography</option>
//                         <option value="other">Other</option>
//                     </select>
//                 </div>
//                 <div className="mb-4">
//                     <label
//                         className="block text-gray-700 text-sm font-bold mb-2"
//                         htmlFor="price"
//                     >
//                         Price ($):
//                     </label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight form-input focus:shadow-outline"
//                         id="price"
//                         type="number"
//                         name="price"
//                         min="0"
//                         step="1"
//                         max="100000"
//                         value={bookData.price}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label
//                         className="block text-gray-700 text-sm font-bold mb-2"
//                         htmlFor="condition"
//                     >
//                         Condition:
//                     </label>
//                     <select
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight form-input focus:shadow-outline"
//                         id="condition"
//                         name="condition"
//                         value={bookData.condition}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select condition</option>
//                         <option value="new">New</option>
//                         <option value="like-new">Like New</option>
//                         <option value="very-good">Very Good</option>
//                         <option value="good">Good</option>
//                         <option value="acceptable">Acceptable</option>
//                     </select>
//                 </div>
//                 <div className="mb-6">
//                     <label
//                         className="block text-gray-700 text-sm font-bold mb-2"
//                         htmlFor="description"
//                     >
//                         Description:
//                     </label>
//                     <textarea
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight form-input focus:shadow-outline h-32"
//                         id="description"
//                         name="description"
//                         value={bookData.description}
//                         onChange={handleChange}
//                         minLength="10"
//                         maxLength="4076"
//                         required
//                     ></textarea>
//                     <div className="flex text-[12px]">
//                         <span className="flex-1 text-red ">
//                             A minimum length of 10 characters is required.
//                         </span>
//                         <span className="rui-pzHe1 rui-DTzlG">
//                             {bookData.description.length} / 4076
//                         </span>
//                     </div>
//                 </div>
//                 <div className="mb-4">
//           <h2 className="text-xl font-semibold mb-2">Confirm Your Location</h2>
//           <div role="tablist" className="tabs tabs-bordered grid-cols-2">
//             <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Custom" defaultChecked />
//             <div role="tabpanel" className="tab-content p-1">
//                 {bookData.state.length>0 && <CustomLocation location={{state: bookData.state, city:bookData.city}}/>}
//               {/* <CustomLocation location={{state: bookData.state.length>0 && bookData.state, city: bookData.city.length>0 && bookData.city}} /> */}
//             </div>

//             <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Get Current Location"  />
//             <div role="tabpanel" className="tab-content p-1 h-[245px]">
//               <CurrentLocation />
//             </div>

//           </div>
//         </div>
//                 <div className="mb-6">
//                     <h2 className="text-xl font-semibold mb-2">UPLOAD UP TO 5 PHOTOS</h2>
//                     <div className="grid grid-cols-4 gap-4">
//                         {images.length > 0 &&
//                             images.map((image, index) => {
//                                 // console.log(file)
//                                 console.log(image)
//                                 const fileBlob = image instanceof File ? URL.createObjectURL(image): false
//                                 const directUrl = typeof image === 'string'? image : false

//                                 return (
//                                     <div key={index} className="relative">
//                                         <img
//                                             src={fileBlob || directUrl}
//                                             alt={`Preview ${index + 1}`}
//                                             className={`w-full h-32 object-cover rounded ${index === coverImageIndex ? "ring-4 ring-[#d97f02]" : ""}`}
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => handleRemoveImage(index)}
//                                             className="absolute top-0 right-0 bg-[#d97f02] text-white rounded-full p-1 m-1"
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-4 w-4"
//                                                 viewBox="0 0 20 20"
//                                                 fill="currentColor"
//                                             >
//                                                 <path
//                                                     fillRule="evenodd"
//                                                     d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                                                     clipRule="evenodd"
//                                                 />
//                                             </svg>
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={() => handleSetCoverImage(index)}
//                                             className="absolute bottom-1 left-0 bg-[#d97f02] text-white text-xs px-2 py-1 m-1 rounded"
//                                         >
//                                             {index === coverImageIndex ? "Cover" : "Set as cover"}
//                                         </button>
//                                     </div>
//                                 );
//                             })}
//                         {images.length < 5 && (
//                             <label htmlFor="addimg">
//                                 <label
//                                     htmlFor="addimg"
//                                     className="border-2 border-gray-300 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-100 p-5"
//                                 >
//                                     <img
//                                         src={addPhoto.src}
//                                         alt="add photo"
//                                         className="w-8 h-8 object-cover rounded-lg"
//                                     />
//                                     <span className="text-bold mx-[-2px] pb-[30px]">+</span>
//                                 </label>
//                                 <input
//                                     id="addimg"
//                                     name="addimg"
//                                     type="file"
//                                     accept="image/*"
//                                     className="hidden"
//                                     multiple
//                                     onChange={(e) => handleImageUpload(e)}
//                                     min="1"
//                                     max="5"
//                                 />
//                             </label>
//                         )}
//                     </div>
//                     <p className="text-red-500 text-xs italic mt-2">
//                         This field is mandatory
//                     </p>
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <button
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded form-input focus:shadow-outline"
//                         type="submit"
//                         formNoValidate
//                     >
//                         Update Book for Sale
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Protect(Edit);
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page