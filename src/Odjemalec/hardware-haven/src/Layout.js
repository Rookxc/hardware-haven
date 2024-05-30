import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import { GiShoppingCart } from 'react-icons/gi';
import { BsPerson } from 'react-icons/bs';

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="App">
      <header>
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Hardware Haven</span>
              <img className="h-12 w-auto" src="logo192.png" alt="Icon" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white" onClick={() => setMobileMenuOpen(true)}>
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="/" className="text-sm font-semibold leading-6 text-white">Shop</a>
            <a href="/profile" className="text-sm font-semibold leading-6 text-white">Profile</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/login" className="text-sm font-semibold leading-6 text-white">Log in&nbsp;&nbsp;|&nbsp;&nbsp;<span aria-hidden="true"></span></a>
            <a href="/register" className="text-sm font-semibold leading-6 text-white">Sign up <span aria-hidden="true"></span></a>
          </div>
        </nav>
        {mobileMenuOpen &&
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-10"></div>
            <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-theme px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/20">
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Hardware Haven</span>
                  <img className="h-14 w-auto" src="logo192.png" alt="Icon" />
                </a>
                <button type="button" className="-m-2.5 rounded-md p-2.5 text-white" onClick={() => setMobileMenuOpen(false)}>
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-white/20">
                  <div className="space-y-2 py-6">
                    <a href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10">
                      <GiShoppingCart className="h-6 w-6 inline-block mr-2" />
                      Shop
                    </a>
                    <a href="/profile" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10">
                      <BsPerson className="h-6 w-6 inline-block mr-2" />
                      Profile
                    </a>
                  </div>
                  <div className="py-6">
                    <a href="/login" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10">Log in</a>
                    <a href="/register" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10">Sign up</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </header>

      <Outlet />
    </div>
  );
}

export default Layout;
