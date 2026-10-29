import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/client", () => ({ supabase: {} }));

type AnalyticsWindow = Window & { dataLayer?: IArguments[] };

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY", "G-TEST123");
  localStorage.clear();
  document.querySelector("#ihomes-google-analytics")?.remove();
  (window as AnalyticsWindow).dataLayer = [];
  window.history.replaceState({}, "", "/properties?search=Kigali");
});

describe("optional analytics", () => {
  it("does not load before acceptance", async () => {
    const api = await import("@/lib/api");
    api.initializeAnalytics();
    expect(document.querySelector("#ihomes-google-analytics")).toBeNull();
  });

  it("records public paths without query strings after acceptance", async () => {
    const api = await import("@/lib/api");
    api.setAnalyticsConsent(true);
    const event = (window as AnalyticsWindow).dataLayer?.find(x => x[0] === "event");
    expect(event?.[2].page_location).toBe(`${window.location.origin}/properties`);
    expect(event?.[2].page_path).toBe("/properties");
  });

  it("never loads analytics on an admin page", async () => {
    window.history.replaceState({}, "", "/admin");
    const api = await import("@/lib/api");
    api.setAnalyticsConsent(true);
    expect(document.querySelector("#ihomes-google-analytics")).toBeNull();
    expect((window as AnalyticsWindow).dataLayer?.filter(x => x[0] === "event")).toHaveLength(0);
  });

  it("stops page events after consent is withdrawn", async () => {
    const api = await import("@/lib/api");
    api.setAnalyticsConsent(true);
    api.setAnalyticsConsent(false);
    api.trackPageView("/contact");
    expect((window as AnalyticsWindow).dataLayer?.filter(x => x[0] === "event")).toHaveLength(1);
  });

  it("does not repeat page events for query-only changes", async () => {
    const api = await import("@/lib/api");
    api.setAnalyticsConsent(true);
    window.history.replaceState({}, "", "/properties?search=Villa");
    api.trackPageView("/properties");
    expect((window as AnalyticsWindow).dataLayer?.filter(x => x[0] === "event")).toHaveLength(1);
  });
});