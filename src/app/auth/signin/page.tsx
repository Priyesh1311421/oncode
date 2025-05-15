'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Placeholder for icons (e.g., from react-icons or SVGs)
const GoogleIcon = () => <span className="mr-2">G</span>; // Replace with actual icon
const GitHubIcon = () => <span className="mr-2">GH</span>; // Replace with actual icon
const EmailIcon = () => <span className="mr-2">@</span>; // Replace with actual icon

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};

type Providers = Record<string, Provider>;

// Component that uses useSearchParams must be wrapped in Suspense
function SignInForm() {
  const [providers, setProviders] = useState<Providers | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleOAuthSignIn = (providerId: string) => {
    setIsOAuthLoading(providerId);
    signIn(providerId, { callbackUrl });
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setIsLoading(false);
    if (result?.error) {
      setError(result.error === 'CredentialsSignin' ? 'Invalid email or password.' : result.error);
    } else if (result?.ok) {
      router.push(callbackUrl);
    }
  };

  // Display loading only if providers are not yet fetched
  if (!providers) {
    return <div className="flex justify-center items-center min-h-screen">Loading providers...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all hover:scale-105">
        <div className="text-center">
          <Link href="/">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity cursor-pointer">
              OnCode
            </span>
          </Link>
          <h2 className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-300">Welcome Back!</h2>
        </div>
        
        {error && (
          <div className="p-3 my-2 text-center text-sm text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 border border-red-400 dark:border-red-700 rounded-md shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsSignIn} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-shadow duration-200 ease-in-out hover:shadow-md"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-shadow duration-200 ease-in-out hover:shadow-md"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            >
              {isLoading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : <><EmailIcon /> Sign in with Email</>}
            </button>
          </div>
        </form>

        {providers && (Object.values(providers).filter(p => p.type === 'oauth').length > 0) && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {Object.values(providers).map((provider) => {
                if (provider.type === 'oauth') {
                  const Icon = provider.id === 'google' ? GoogleIcon : provider.id === 'github' ? GitHubIcon : () => null;
                  return (
                    <button
                      key={provider.id}
                      onClick={() => handleOAuthSignIn(provider.id)}
                      disabled={isOAuthLoading === provider.id || isLoading}
                      className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    >
                      {isOAuthLoading === provider.id ? 
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500 mr-2"></span> : 
                        <Icon />}
                      Sign in with {provider.name}
                    </button>
                  );
                }
                return null;
              })}
            </div>
          </>
        )}

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function SignInLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="p-8 rounded-xl bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading sign-in page...</p>
        </div>
      </div>
    </div>
  );
}

// Main page component that wraps the form in Suspense
export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInForm />
    </Suspense>
  );
}
