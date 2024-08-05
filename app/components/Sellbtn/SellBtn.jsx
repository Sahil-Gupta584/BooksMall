'use client';
import styles from './SellBtn.module.css';
import { useRouter } from 'next/navigation';
import { verifyLogin } from '../../appwrite/api';
import LoadingBtn from '../LoadingBtn';
import { useState } from 'react';
import Link from 'next/link';

function SellBtn() {
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    
    const handelClick = async() => {
        setLoading(true)
        const user = await verifyLogin();
        console.log(user);
        if (!user) {
            console.log('redirecting fro login');
            router.push('/auth');
        } 
        if(user){

            router.push('/sell')
        }
    }
    return (
        <Link prefetch href='/sell' className="sell-btn" >
        {/* <a href='/sell'>  */}
            <div className={styles['container-button']}>
                <div className={`${styles.hover} ${styles['bt-1']}`}></div>
                <div className={`${styles.hover} ${styles['bt-2']}`}></div>
                <div className={`${styles.hover} ${styles['bt-3']}`}></div>
                <div className={`${styles.hover} ${styles['bt-4']}`}></div>
                <div className={`${styles.hover} ${styles['bt-5']}`}></div>
                <div className={`${styles.hover} ${styles['bt-6']}`}></div>
                <button className={`${styles['button']} before:bg-[#f5ae51]`}>{ loading ?<LoadingBtn /> : null}</button>
            </div>
        </Link>
    );
}

export default SellBtn;

