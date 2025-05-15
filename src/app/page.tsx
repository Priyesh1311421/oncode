import Link from 'next/link';
import { FiPlayCircle, FiCode, FiSave, FiTerminal, FiShield, FiUsers, FiZap } from 'react-icons/fi'; // Using react-icons for feature icons

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20 sm:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              OnCode:
            </span> Your Modern Code Playground.
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Write, execute, and share code snippets in a secure, intuitive, and powerful online environment.
            Perfect for learning, testing, and collaboration.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/editor"
              className="group relative inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-xl hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <FiPlayCircle className="mr-3 h-6 w-6" />
              Go to Playground
            </Link>
            <Link
              href="/auth/register" // Or /learn-more if such a page exists
              className="group relative inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 text-lg font-semibold text-indigo-400 bg-transparent border-2 border-indigo-500 rounded-lg shadow-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Sign Up & Explore
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gray-800 bg-opacity-50 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Why Choose OnCode?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: <FiCode className="h-10 w-10 mb-4 text-indigo-400" />,
                title: 'Multi-Language Support',
                description: 'Execute code in JavaScript, Python, Java, C++, and more. We are constantly expanding our supported languages.',
              },
              {
                icon: <FiTerminal className="h-10 w-10 mb-4 text-indigo-400" />,
                title: 'Real-time Execution',
                description: 'Get instant feedback with our fast and reliable code execution engine, powered by Judge0.',
              },
              {
                icon: <FiSave className="h-10 w-10 mb-4 text-indigo-400" />,
                title: 'Save & Share Snippets',
                description: 'Keep your code organized. Save your snippets and easily share them with others (coming soon!).',
              },
              {
                icon: <FiShield className="h-10 w-10 mb-4 text-indigo-400" />,
                title: 'Secure Environment',
                description: 'Code execution happens in isolated Docker containers, ensuring your safety and privacy.',
              },
              {
                icon: <FiZap className="h-10 w-10 mb-4 text-indigo-400" />,
                title: 'Modern & Intuitive UI',
                description: 'Enjoy a clean, responsive, and user-friendly interface designed for optimal productivity.',
              },
              {
                icon: <FiUsers className="h-10 w-10 mb-4 text-indigo-400" />,
                title: 'Collaboration Focused',
                description: 'Work together on code, share ideas, and learn from a community of developers (future feature).',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-700 bg-opacity-70 p-6 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-shadow duration-300 transform hover:-translate-y-1"
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-3 text-gray-100">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-100">
            Ready to Start Coding?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
            Jump into our feature-rich code editor and experience the future of online coding playgrounds.
          </p>
          <Link
            href="/editor"
            className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FiPlayCircle className="mr-3 h-6 w-6" />
            Launch Editor
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 bg-opacity-80 border-t border-gray-700">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} OnCode. All rights reserved.</p>
          <p className="mt-1">
            Built with Next.js, Tailwind CSS, and Passion.
          </p>
          {/* Optional: Add links to terms, privacy, contact */}
        </div>
      </footer>
    </div>
  );
}
