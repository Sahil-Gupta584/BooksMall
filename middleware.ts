import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);
const protectedRoutes = [
    '/sell',
    '/myselling',
]

export default auth((req) => {
    const { nextUrl } = req;

    const isAuthenticated = !!req.auth;
    console.log("isAuthenticated:- ", isAuthenticated)
    const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);

    if (!isAuthenticated && isProtectedRoute) {
        console.log('not authenticated')
        return Response.redirect(new URL('/auth', nextUrl));
    }
    if (nextUrl.pathname === '/auth' && isAuthenticated) {
        console.log('Alreday authenticated')
        return Response.redirect(new URL('/', nextUrl));
    }
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',],
};