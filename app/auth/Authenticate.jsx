'use client';
import { useState } from 'react';
import styles from './Auth.module.css';
import { handleGoogleAuth, handleMagicLink } from '../actions/api';

function Authenticate() {

    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault(); 
        setError('')
        const formData = new FormData(event.target);
        try {

            await handleMagicLink(formData)
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
                        <button type="submit" className={styles.btn}>SignIn</button>
                        <div className='flex items-center gap-2'>
                            <div className='flex-grow bg-[#d971f0] h-[1px]'></div>
                            <span>or</span>
                            <div className='flex-grow bg-[#d971f0] h-[1px]'></div>
                        </div>
                    </form>
                    <button onClick={async ()=> handleGoogleAuth()} className={styles.btn}>
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
