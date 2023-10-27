import { authMiddleware } from '@clerk/nextjs';

/**
 * Check which pages are public and which need to hide behind authentication.
 */
export default authMiddleware({
  publicRoutes: [
    '/',
    '/api/webhook',
    '/question/:id',
    '/tags',
    '/tags/:id',
    '/profile/:id',
    '/community',
    '/jobs'
  ],
  ignoredRoutes: ['/api/webhook', '/api/chatgpt']
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
