import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import { FiLogOut } from "react-icons/fi";
import useOnlineStatus from './helpers/OnlineStatus';

function Layout({ isAuthenticated }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const header = document.getElementsByTagName('header')[0];
    const headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }, [useOnlineStatus()]);

  return (
    <div className="App">
      <header>
        {!useOnlineStatus() &&
          <p className="bg-amber-400 text-gray-800 p-1 text-center text-sm font-medium">
            You are currently offline. Some functionalities may be disabled.
          </p>
        }
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
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {isAuthenticated ?
              <div className="flex items-center space-x-2">
                <a href="/profile" className="text-sm font-semibold leading-6 text-white">
                  Profile
                </a>
                <span className="inline-flex items-center text-sm font-semibold leading-6 text-white cursor-default">
                  |
                </span>
                <a href="/logout" className="text-sm font-semibold leading-6 text-white">
                  <FiLogOut className="h-4 w-4" />
                </a>
              </div>
              :
              <div className="flex items-center space-x-2">
                <a href="/login" className="text-sm font-semibold leading-6 text-white">
                  Log in
                </a>
                <span className="inline-flex items-center text-sm font-semibold leading-6 text-white cursor-default">
                  |
                </span>
                <a href="/register" className="text-sm font-semibold leading-6 text-white">
                  Sign up
                </a>
              </div>
            }
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
                      Shop
                    </a>
                  </div>
                  <div className="py-6">
                    {isAuthenticated ?
                      <>
                        <a href="/profile" className="block -mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10">
                          Profile
                        </a>
                        <a href="/logout" className="flex items-center justify-start -mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10">
                          <span>Log Out</span>
                          <FiLogOut className="w-4 h-4 ml-2" />
                        </a>
                      </>
                      :
                      <>
                        <a href="/login" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10">Log in</a>
                        <a href="/register" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10">Sign up</a>
                      </>
                    }
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
