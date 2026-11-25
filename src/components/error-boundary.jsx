import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export function RouteErrorFallback() {
  const error = useRouteError();
  console.error("Route error caught:", error);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface)] p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-raised max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-[var(--color-danger)] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-[18px] font-bold text-[var(--color-text)]">
          Application Notice
        </h2>
        <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
          {error?.message || "An unexpected error occurred while rendering this page."}
        </p>
        <div className="flex gap-2 justify-center pt-2">
          <Button
            size="sm"
            onClick={() => window.location.reload()}
            className="gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reload Page
          </Button>
          <Link to="/">
            <Button size="sm" variant="secondary" className="gap-1.5">
              <Home className="w-3.5 h-3.5" />
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RouteErrorFallback;
