'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiActivity, FiLogOut, FiUser } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { FaDumbbell } from "react-icons/fa";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userLinks = [
    { name: 'Dashboard', href: '/dashboard', roles: ['user', 'trainer'], icon: <FiHome /> },
    { name: 'Workouts', href: '/workouts', roles: ['user'], icon: <FaDumbbell /> },
    { name: 'Available Programs', href: '/programs', roles: ['user'], icon: <FiActivity /> },
    { name: 'Trainers', href: '/trainers', roles: ['user'], icon: <FiUser /> },
    { name: 'My Programs', href: '/trainer/my-programs', roles: ['trainer'], icon: <FiActivity /> },
    { name: 'My CV', href: '/trainer/cv', roles: ['trainer'], icon: <FiUser /> },
  ];

  const filteredLinks = userLinks.filter((link) =>
    link.roles.includes(session?.user.role || 'user')
  );

  return (
    <header className="fixed w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FITTRACK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-1 pt-1 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Profile / Login */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  Hi, {session.user?.name || session.user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                >
                  <FiLogOut />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation (Bottom bar) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around items-center h-16">
            {filteredLinks.slice(0, 4).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center justify-center p-2 text-xs ${
                  pathname === link.href ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}