'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">Loading profile...</div>;
  }

  if (status === 'unauthenticated' || !session?.user) {
    redirect('/auth/signin?callbackUrl=/profile');
    return null; // or a loading/error state before redirect completes
  }

  const { user } = session;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">User Profile</h1>
      
      <div className="flex flex-col items-center space-y-4">
        {user.image && (
          <Image 
            src={user.image} 
            alt={user.name || 'User avatar'} 
            width={128} 
            height={128} 
            className="rounded-full shadow-lg"
          />
        )}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{user.name || 'N/A'}</h2>
          <p className="text-gray-600 dark:text-gray-400">{user.email || 'N/A'}</p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600 dark:text-gray-400">User ID:</span>
            <span className="text-gray-800 dark:text-gray-200">{user.id}</span>
          </div>
          {/* You can add more user details here as needed */}
          {/* For example, if you store account creation date or other info */}
          {/* <div className="flex justify-between">
            <span className="font-medium text-gray-600 dark:text-gray-400">Joined:</span>
            <span className="text-gray-800 dark:text-gray-200">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div> */}
        </div>
      </div>

      {/* Placeholder for future features like editing profile or viewing activity */}
      <div className="mt-8 text-center">
        <button 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          onClick={() => alert('Edit profile functionality to be implemented.')}
        >
          Edit Profile (Coming Soon)
        </button>
      </div>
    </div>
  );
}
