import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getAnalyticsConsent, hasAnalyticsConfiguration, setAnalyticsConsent } from "@/lib/api";

export function AnalyticsConsent() {
  const [dismissed, setDismissed] = useState(() => getAnalyticsConsent() !== null);
  if (dismissed || !hasAnalyticsConfiguration()) return null;

  const choose = (allowed: boolean) => {
    setAnalyticsConsent(allowed);
    setDismissed(true);
  };

  return (
    <aside aria-label="Analytics cookie consent" className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background shadow-lg">
      <div className="container-custom flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
        <p className="text-sm text-muted-foreground max-w-2xl">Allow Google Analytics cookies to help us understand website visits? Optional analytics stays off unless you accept.</p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={() => choose(false)}>Decline</Button>
          <Button onClick={() => choose(true)}>Accept analytics</Button>
        </div>
      </div>
    </aside>
  );
}