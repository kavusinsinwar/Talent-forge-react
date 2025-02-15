import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
  useClerk
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Briefcase as BriefcaseBusiness, Heart, PenBox, Menu, X, LogOut, Settings } from 'lucide-react';
import { TalentForgeLogo } from "./talent-forge-logo";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMobileMenu && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-button')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <nav className="py-4 px-4 md:px-6 flex justify-between items-center relative bg-transparent border-b border-gray-100">
        
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <TalentForgeLogo 
            size="small" 
            className="h-12 md:h-16 lg:h-20 flex items-center" 
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <SignedOut>
            <Button 
              variant="outline" 
              onClick={() => setShowSignIn(true)}
              className="bg-black border-2 border-[#51e2f5] text-[#51e2f5] hover:bg-[#51e2f5] hover:text-white transition-all duration-300"
            >
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button 
                  variant="destructive" 
                  className="rounded-full bg-gradient-to-r from-[#ffa8b6] to-[#ff8fab] hover:from-[#ff8fab] hover:to-[#ffa8b6] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-[#51e2f5]",
                  userButtonPopulator: "hover:opacity-80 transition-opacity",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
                <UserButton.Action 
                  label="Manage Account" 
                  onClick={() => console.log("Manage Account Clicked")}
                />
                <UserButton.Action 
                  label="Logout" 
                  onClick={() => signOut()}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-gray-50 rounded-full transition-all duration-300 menu-button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <motion.div
            animate={{ rotate: showMobileMenu ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
                onClick={() => setShowMobileMenu(false)}
              />
              
              {/* Menu */}
              <motion.div
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-y-0 right-0 w-[280px] md:hidden bg-gray-700 opacity-65 shadow-lg py-4 px-6 z-50 mobile-menu"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-[#51e2f5] to-[#ff8fab] text-transparent bg-clip-text">Menu</h2>
                    <button
                      onClick={() => setShowMobileMenu(false)}
                      className="p-2 hover:bg-gray-50 rounded-full transition-all duration-300"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Mobile Menu Content */}
                  <div className="flex-1">
                    <SignedOut>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowSignIn(true);
                          setShowMobileMenu(false);
                        }}
                        className="w-full bg-white border-2 border-[#51e2f5] text-[#51e2f5] hover:bg-[#51e2f5] hover:text-white transition-all duration-300"
                      >
                        Login
                      </Button>
                    </SignedOut>

                    <SignedIn>
                      {/* User Profile Section */}
                      <div className="mb-6">
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-sm">
                          <div className="flex items-start gap-3">
                            <UserButton
                              appearance={{
                                elements: {
                                  avatarBox: "w-12 h-12 border-2 border-[#51e2f5] rounded-full shadow-sm",
                                },
                              }}
                            />
                            <div className="min-w-0 flex-1"> {/* Add min-w-0 to enable text truncation */}
                              <p className="font-medium text-gray-900 mb-0.5">
                                {user?.fullName || 'User'}
                              </p>
                              <p className="text-sm text-gray-500 truncate"> {/* Add truncate class */}
                                {user?.primaryEmailAddress?.emailAddress}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="space-y-2">
                        {user?.unsafeMetadata?.role === "recruiter" && (
                          <Link 
                            to="/post-job"
                            onClick={() => setShowMobileMenu(false)}
                            className="w-full block mb-4"
                          >
                            <Button 
                              variant="destructive" 
                              className="w-full rounded-full bg-gradient-to-r from-[#ffa8b6] to-[#ff8fab] hover:from-[#ff8fab] hover:to-[#ffa8b6] transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <PenBox size={20} className="mr-2" />
                              Post a Job
                            </Button>
                          </Link>
                        )}
                        <Link 
                          to="/my-jobs"
                          onClick={() => setShowMobileMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
                        >
                          <BriefcaseBusiness size={20} className="text-gray-500 group-hover:text-[#51e2f5] transition-colors" />
                          <span className="group-hover:text-[#51e2f5] transition-colors">My Jobs</span>
                        </Link>
                        <Link 
                          to="/saved-jobs"
                          onClick={() => setShowMobileMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
                        >
                          <Heart size={20} className="text-gray-500 group-hover:text-[#51e2f5] transition-colors" />
                          <span className="group-hover:text-[#51e2f5] transition-colors">Saved Jobs</span>
                        </Link>
                        <button
                          onClick={() => console.log("Manage Account Clicked")}
                          className="flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 rounded-xl transition-all duration-300 group"
                        >
                          <Settings size={20} className="text-gray-500 group-hover:text-[#51e2f5] transition-colors" />
                          <span className="group-hover:text-[#51e2f5] transition-colors">Settings</span>
                        </button>
                      </div>
                    </SignedIn>
                  </div>

                  {/* Mobile Menu Footer */}
                  <SignedIn>
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-50 rounded-xl transition-all duration-300 text-left text-red-600 group"
                      >
                        <LogOut size={20} className="group-hover:text-red-700 transition-colors" />
                        <span className="group-hover:text-red-700 transition-colors font-medium">Logout</span>
                      </button>
                    </div>
                  </SignedIn>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* SignIn Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white p-4 md:p-6 rounded-3xl z-60 max-w-full w-[400px] shadow-xl"
          >
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
            />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Header;