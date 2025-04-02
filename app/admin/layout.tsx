"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/Logoutbutton'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-blue-700 hover:text-white'
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-blue-800 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🏥</span>
              </div>
              <div className="ml-3">
                <span className="text-white font-semibold text-xl">Admin Dashboard</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/admin/dashboard')}`}
                >
                  Home
                </Link>
                <Link
                  href="/admin/adddoctor"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/admin/adddoctor')}`}
                >
                  Add Doctor
                </Link>
                <Link
                  href="/admin/admininfo"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/admin/admininfo')}`}
                >
                  Profile
                </Link>
                <Link
                  href="/admin/removedoctor"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/admin/removedoctor')}`}
                >
                  Remove Doctor
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>

            {/* Logout Button */}
            <div className="hidden md:flex items-center">
              <LogoutButton removeitem="adminInfo" />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-800">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/admin/adddoctor"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/admin/adddoctor')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Add Doctor
            </Link>
            <Link
              href="/admin/admininfo"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/admin/admininfo')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <div className="px-3 py-2">
              <LogoutButton removeitem="adminInfo" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with padding for fixed navbar */}
      <main className="pt-20 pb-6">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout