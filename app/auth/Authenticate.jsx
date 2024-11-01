'use client';
import { useEffect, useState } from 'react';
import styles from './Auth.module.css';
import { handleGoogleAuth, handleMagicLink } from '../appwrite/api';
import { useRouter } from 'next/navigation';

function Authenticate({ params }) {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState('');

    const router = useRouter();
    useEffect(() => {

        // async function fetch(params) {
        //     const user = await verifyLogin();
        //     if (user) {
        //         console.log('redirecting fro login');
        //         router.push('/')
        //     }
        // }
        // fetch()

    }, [params, router])



    async function handleSubmit(event) {
        event.preventDefault(); // Prevent form submission from refreshing the page
        setError('')
        const formData = new FormData(event.target);
        const email = formData.get("email");
        try {

            await handleMagicLink({ email })
        } catch (error) {
            console.log(error, 'err in HandleMagicLink');
            setError(error.message)

        }
    }



    return (
        <div className={`${styles.container} bg-[#d97f02] h-[100vh] text-[#d97f02] overflow-scroll`} suppressHydrationWarning >
            <div className={styles.form}>
                <div className={styles.form_front}>
                    <div className={styles.form_details}>Login</div>
                    <form className='flex flex-col gap-5' onSubmit={handleSubmit} >
                        <input type="email" name="email" className={styles.input} placeholder="example@gmail.com" required />
                        <button type="submit" className={styles.btn} disabled={loading}> {loading ? <div className="loading loading-spinner"></div> : 'SignIn'} </button>
                        <div className='flex items-center gap-2'>
                            <div className='flex-grow bg-[#d971f0] h-[1px]'></div>
                            <span>or</span>
                            <div className='flex-grow bg-[#d971f0] h-[1px]'></div>
                        </div>


                    </form>
                    <button onClick={async ()=> handleGoogleAuth()} className={styles.btn} disabled={loading}>
                        <img src="https://img.clerk.com/static/google.svg?width=160" />
                        <span>Google</span>
                    </button>
                    {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default Authenticate;
