'use client';
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getFeedbacks, submitFeedback, toggleUpvote } from '../actions/api';
import { useEffect } from 'react';
import { useSocket } from '../context/socketContext';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([])
    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm()
    const { currUser } = useSocket()
    const router = useRouter()
    useEffect(() => {
        (async () => {
            const res = await getFeedbacks()
            res.sort((a, b) => b.upVotedBy.length - a.upVotedBy.length)
            console.log('feedbacks', res);

            setFeedbacks(res)
        })()
    }, [router])

    useEffect(() => {

        setFeedbacks(prev => prev.sort((a, b) => b.upVotedBy.length - a.upVotedBy.length))

    }, [feedbacks])

    async function onSubmit(data) {
        console.log('data', data);
        submitFeedback(data).then((res) => {
            console.log('res', res);

            setFeedbacks(prev => [...prev, res])
            console.log('Submitted');

        }).catch(err => { alert(err.message); console.log(err, 'err submitting feedback') });
    }


    return (
        <div className="flex flex-col md:flex-row gap-12 max-w-5xl min-w-screen w-full p-4 pt-8  justify-center mx-auto">
            <div className="h-fit md:max-w-sm md:sticky md:top-6 w-full flex flex-col gap-4 p-8 bg-[#fff] gap-4 rounded-box shadow-md hover:shadow-xl transition ">
                <h2 className='font-bold text-lg'>Suggest a feature</h2>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <label htmlFor="title" className='flex flex-col'>
                        Short, descriptive title
                        <input
                            {...register('title', {
                                minLength: { value: 3, message: "Dude dont play, enter valid title!" }
                            })}
                            id='title'
                            className='p-2 outline-none border-[gray] border-[1px] rounded-lg'
                            placeholder='Title'
                        />
                        {errors.title && <p className='text-red-500 text-sm '>{errors.title.message}</p>}
                    </label>

                    <label htmlFor="description" className='flex flex-col'>
                        Description
                        <textarea
                            {...register('description', {
                                minLength: { value: 3, message: "Dude dont play, enter valid description!" },
                                validate: {}
                            })}
                            name="description"
                            id="description"
                            placeholder='I wanted...'
                            className='p-2 outline-none border-[gray] border-[1px] rounded-lg'>
                        </textarea>
                        {errors.description && <p className='text-red-500 text-sm '>{errors.description.message}</p>}

                    </label>
                    <button
                        type='submit'
                        className='w-full text-white bg-[#d971f0] rounded-md py-2 text-center hover:bg-[#e16540] transition'>
                        {isSubmitting ? 'Submitting...' : 'Suggest a feature'}
                    </button>
                </form>
            </div>
            <div className="space-y-6 w-full">
                {feedbacks.map(feedback => {
                    return (

                        <div key={feedback._id} className="flex bg-base-100 rounded-box p-6 duration-200 hover:shadow-lg cursor-pointer justify-between items-center gap-4">
                            <div className='flex-grow'>
                                <h2 className='font-semibold '>{feedback.title}</h2>
                                <p className='text-[#605a57]'>
                                    {feedback.description}
                                </p>
                            </div>
                            <button
                                onClick={async () => {

                                    setFeedbacks(prev => prev.map((f) => {

                                        if (f._id === feedback._id)
                                            return {
                                                ...f,
                                                upVotedBy: f.upVotedBy.includes(currUser.email)
                                                    ? f.upVotedBy.filter(email => email !== currUser.email)
                                                    : [...f.upVotedBy, currUser.email],
                                                upVotes: f.up
                                            }

                                        return f
                                    }))

                                    await toggleUpvote(feedback._id, currUser.email)
                                }}
                                className={`px-4 py-2 rounded-box group text-center text-lg duration-150 border border-base-content/10 ${feedback.upVotedBy.includes(currUser.email) ? 'bg-[#d971f0] text-white' : 'bg-base-100'} text-base-content`} title="Upvote post">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5  ease-in-out duration-150 group-hover:-translate-y-0.5"><path d="m18 15-6-6-6 6"></path>
                                </svg>
                                {feedback.upVotedBy.length}
                            </button>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default Feedback