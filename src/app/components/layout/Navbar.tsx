'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

// Placeholder for a User icon (e.g., from react-icons or an SVG)
const UserIcon = () => <span className="mr-1">👤</span>; 
// Placeholder for a SignOut icon
const SignOutIcon = () => <span className="mr-1">🚪</span>;

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity">
          OnCode
        </Link>
        <div className="flex items-center space-x-4 md:space-x-6">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-pulse h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="animate-pulse h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ) : session?.user ? (
            <>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User avatar'}
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-indigo-500 dark:border-indigo-400"
                />
              )}
              <span className="hidden sm:inline font-medium">
                {session.user.name || session.user.email}
              </span>
              <Link href="/profile" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <UserIcon /> Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md shadow hover:shadow-md transition-all text-sm font-medium"
              >
                <SignOutIcon /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow hover:shadow-md transition-colors text-sm font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
