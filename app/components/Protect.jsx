'use client';
import React, { useEffect, useState } from 'react'
import { verifyLogin } from '../appwrite/api';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const Protect = (Component) => {

    return function ProtectedComponent(props) {
        const router = useRouter();
        const pathname = usePathname();
        const [isLoading, setIsLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [currentUser, setcurrentUser] = useState(false)

        useEffect(() => {
            async function checkAuth() {

                const user = await verifyLogin();
                console.log(user)
                setcurrentUser(user)

                if (user) {
                    setIsAuthenticated(true)
                    setIsLoading(false);

                } else {
                    router.push( `/auth?next=${pathname}`);
                }

            }
            checkAuth();
        }, [router, pathname]);

        if (isLoading) {
            return <div className="loading universal loading-spinner h-[91vh] w-[100vw] "></div>;
        }

        return isAuthenticated ? <Component {...props} currentUser={currentUser} /> : null;
    }
}

export default Protect;