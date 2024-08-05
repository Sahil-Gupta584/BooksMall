'use client';
import React, { useEffect, useState } from 'react'
import { verifyLogin } from '../appwrite/api';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const Protect = (Component) => {
    // Return a new functional component
    return function ProtectedComponent(props) {
        const router = useRouter();
        const pathname = usePathname();
        const [isLoading, setIsLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            async function checkAuth() {

                const user = await verifyLogin();
                console.log(user)

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

        return isAuthenticated ? <Component {...props} /> : null;
    }
}

export default Protect;