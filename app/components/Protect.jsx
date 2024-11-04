'use client';
import  { useEffect, useState } from 'react'
import { getUser, verifyLogin } from '../actions/api';
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
            
            (async()=>{

                const user = await verifyLogin();
                const res = await getUser(user.$id);
                console.log('user:', res);
                setcurrentUser(res);

                if (user) {
                    setIsAuthenticated(true)
                    setIsLoading(false);

                } else {
                    router.push( `/auth?next=${pathname}`);
                }
                
            })()
        }, [router, pathname]);

        if (isLoading) {
            return <div className="loading universal loading-spinner h-[91vh] w-[100vw] "></div>;
        }

        return isAuthenticated ? <Component {...props} currentUser={currentUser} /> : null;
    }
}

export default Protect;