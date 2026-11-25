import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import {
  Briefcase,
  Bookmark,
  Sparkles,
  Search,
  Home,
  Sun,
  Moon,
  Plus,
  Users,
  Compass,
} from "lucide-react";
import { TalentForgeLogo } from "./talent-forge-logo";
import { useTheme } from "./theme-provider";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch("");
    }
  };

  const isRecruiter = user?.unsafeMetadata?.role === "recruiter";

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Jobs", href: "/jobs", icon: Briefcase },
    {
      label: isRecruiter ? "Manage" : "Network",
      href: "/my-jobs",
      icon: Users,
      requireAuth: true,
    },
    {
      label: "Saved",
      href: "/saved-jobs",
      icon: Bookmark,
      requireAuth: true,
    },
    {
      label: "AI Coach",
      href: "/Chat-bot",
      icon: Sparkles,
      highlight: true,
    },
  ];

  return (
    <>
      {/* Top Navigation Bar: exactly 56px, max-width 1128px */}
      <header className="sticky top-0 z-40 w-full h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-xs transition-colors">
        <div className="max-w-[1128px] mx-auto px-3 sm:px-4 h-full flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand + Search */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Link to="/" className="flex-shrink-0" aria-label="TalentForge Home">
              <TalentForgeLogo size="small" />
            </Link>

            {/* Expandable Pill Search */}
            <form onSubmit={handleNavSearch} className="relative hidden sm:block flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search jobs, skills, companies"
                className="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] hover:bg-[var(--color-surface-alt)]/80 focus:bg-[var(--color-surface)] border border-transparent focus:border-[var(--color-primary)] outline-none transition-all duration-200 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)]"
              />
            </form>
          </div>

          {/* Center/Right Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 h-full">
            {navItems.map((item) => {
              if (item.requireAuth && !user) return null;
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative flex flex-col items-center justify-center px-3 h-full text-[12px] transition-colors ${
                    isActive
                      ? "text-[var(--color-primary)] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-1 after:right-1 after:h-[2px] after:bg-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] font-normal"
                  }`}
                >
                  <Icon className="w-[20px] h-[20px] mb-0.5" strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="h-6 w-[1px] bg-[var(--color-border)] mx-1" />

            {/* Post Job Action */}
            <SignedIn>
              {isRecruiter ? (
                <Link to="/post-job">
                  <button className="h-8 px-3.5 text-xs font-semibold rounded-[var(--radius-pill)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition-colors flex items-center gap-1 shadow-xs">
                    <Plus className="w-3.5 h-3.5" />
                    Post Job
                  </button>
                </Link>
              ) : (
                <Link to="/onboarding">
                  <button className="h-8 px-3 text-xs font-medium rounded-[var(--radius-pill)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                    Post a Job
                  </button>
                </Link>
              )}
            </SignedIn>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-alt)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth Button */}
            <SignedOut>
              <button
                onClick={() => setShowSignIn(true)}
                className="h-8 px-4 text-xs font-semibold rounded-[var(--radius-pill)] border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-colors"
              >
                Sign In
              </button>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center pl-1">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-full border border-[var(--color-border)]",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </nav>

          {/* Mobile Right Icons (Theme + Auth) */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:hidden flex-shrink-0">
            <SignedIn>
              {isRecruiter && (
                <Link to="/post-job" aria-label="Post Job">
                  <button className="h-7 px-2.5 text-[11px] font-semibold rounded-[var(--radius-pill)] bg-[var(--color-primary)] text-white flex items-center gap-1 shadow-xs">
                    <Plus className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </Link>
              )}
            </SignedIn>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-[var(--radius-sm)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <SignedOut>
              <button
                onClick={() => setShowSignIn(true)}
                className="h-7 px-2.5 text-xs font-semibold rounded-[var(--radius-pill)] border border-[var(--color-primary)] text-[var(--color-primary)]"
              >
                Sign In
              </button>
            </SignedOut>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7 rounded-full",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar (< 768px): 56px height, icons only */}
      <nav className="fixed bottom-0 left-0 right-0 h-14 bg-[var(--color-surface)] border-t border-[var(--color-border)] z-40 flex items-center justify-around px-1 md:hidden shadow-raised">
        {navItems.map((item) => {
          if (item.requireAuth && !user) return null;
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 max-w-[72px] rounded-[var(--radius-sm)] transition-colors ${
                isActive
                  ? "text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] mt-0.5 leading-none truncate max-w-full text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Clerk Sign In Dialog */}
      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSignIn(false);
              setSearch({});
            }
          }}
        >
          <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-raised max-w-sm w-full">
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/jobs"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
