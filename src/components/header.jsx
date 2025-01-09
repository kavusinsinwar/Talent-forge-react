import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react';
import { TalentForgeLogo } from "../components/talent-forge-logo";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    // Show the sign-in modal if the 'sign-in' param is found in the URL
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    // Close the modal if the background (overlay) is clicked
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({}); // Clear search params
    }
  };

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <TalentForgeLogo size="default" className="h-20 flex items-center" />
        </Link>

        <div className="flex gap-8 items-center">
          <SignedOut>
            <Button 
              variant="outline" 
              onClick={() => setShowSignIn(true)}
              className="hover:border-[#51e2f5] hover:text-[#51e2f5] transition-colors"
            >
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button 
                  variant="destructive" 
                  className="rounded-full bg-[#ffa8b6] hover:bg-[#ffa8b6]/90"
                >
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
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
                <UserButton.Action label="Manage Account" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {/* SignIn Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleOverlayClick}
        >
          <div className="relative bg-white p-6 rounded-3xl z-60">
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

