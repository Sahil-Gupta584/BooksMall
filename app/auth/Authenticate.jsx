'use client';
import { useEffect, useState } from 'react';
import styles from './Auth.module.css';
import { account, verifyLogin, createUser } from '../appwrite/api';
import { useRouter } from 'next/navigation';
import PasswordStrengthBar from 'react-password-strength-bar';

function Authenticate({ params }) {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState('');

    const router = useRouter();
    useEffect(() => {

        async function fetch(params) {
            const user = await verifyLogin();
            if (user) {
                console.log('redirecting fro login');
                router.push('/')
            }
        }
        fetch()

    }, [params, router])



    const handleSubmit = async (e, type) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = e.target;
        const email = form.elements['email']?.value;
        const name = form.elements['name']?.value;

        try {

            if (type == 'login') {
                const res = await account.createEmailPasswordSession(email, password);
                localStorage.setItem('currentUserId',res.userId)
                console.log('res;', res);
                console.log('Logged in successfully');
                const { original } = router?.query || {};
                router.push(original ? `/${original}` : '/');

            } else if (type == 'signup') {
                const res = await createUser(email, password, name);
                console.log(res)
                if (res) {

                    console.log('Signed up successfully');
                    const { original } = router?.query || {};
                    router.push(original ? `/${original}` : '/');
                }
                if(!res) setError("failed");
        }

        } catch (err) {
            console.log(err.message, err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className={`${styles.container} bg-[#d97f02] h-[100vh] text-[#d97f02] overflow-scroll`} suppressHydrationWarning >
            <input id="signup_toggle" type="checkbox" className={styles.signup_toggle} />
            <div className={styles.form}>
                <div className={styles.form_front}>
                    <div className={styles.form_details}>Login</div>
                    <form className='flex flex-col gap-5' onSubmit={(e) => handleSubmit(e, 'login')} method="POST">
                        <input type="email" name="email" className={styles.input} placeholder="example@gmail.com" required />
                        <input type={showPass ? 'text' : 'password'} name="password" className={styles.input} placeholder="Password" required />
                        <div className="flex gap-2 mt-1 cursor-pointer" >

                            <input className="cursor-pointer hue-rotate-[76deg] " type="checkbox" name='checkbox' id="checkbox" onClick={() => setShowPass(!showPass)} />
                            <label
                                htmlFor="checkbox"
                                className="block text-[#d971f0]-700  font-medium cursor-pointer ">
                                Show Password
                            </label>
                        </div>
                        <button type="submit" className={styles.btn} disabled={loading}> {loading ? <div className="loading loading-spinner"></div> : 'Login'} </button>
                    </form>
                    {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                    <span className={styles.switch}>
                        Don't have an account?
                        <label htmlFor="signup_toggle" className={styles.signup_tog}>Sign Up</label>
                    </span>
                </div>
                <div className={styles.form_back}>
                    <div className={styles.form_details}>SignUp</div>
                    <form className='flex flex-col gap-5' onSubmit={(e) => handleSubmit(e, 'signup')}>
                        <input type="text" name="name" className={styles.input} placeholder="First and Last Name" required />
                        <input type="email" name="email" className={styles.input} placeholder="example@gmail.com" required />
                        <input type={showPass ? 'text' : 'password'} name="password" className={styles.input} placeholder="Password" value={password} onChange={handlePasswordChange} required />
                        <PasswordStrengthBar password={password} />
                        <input type={showPass ? 'text' : 'password'} className={styles.input} placeholder="Confirm Password" required />
                        <div className="flex gap-2 mt-1 cursor-pointer" >

                            <input className="cursor-pointer hue-rotate-[76deg] " type="checkbox" name='checkbox' id="checkbox" onClick={() => setShowPass(!showPass)} />
                            <label
                                htmlFor="checkbox"
                                className="block text-[#d971f0]-700  font-medium cursor-pointer ">
                                Show Password
                            </label>
                        </div>
                        <button type="submit" className={styles.btn} disabled={loading}> {loading ? <div className="loading loading-spinner"></div> : 'SignUp'} </button>
                    </form>
                    {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                    <span className={styles.switch}>
                        Already have an account?
                        <label htmlFor="signup_toggle" className={styles.signup_tog}>LogIn</label>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Authenticate;
