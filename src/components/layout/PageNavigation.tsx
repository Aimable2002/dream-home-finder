import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPageMetadata, publicOrigin } from "@/lib/seo";
import { initializeAnalytics, trackPageView } from "@/lib/api";

export function PageNavigation() {
  const { pathname } = useLocation();
  const metadata = getPageMetadata(pathname);

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    initializeAnalytics();
    const frame = requestAnimationFrame(() => trackPageView(pathname));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="robots" content={metadata.noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={`${publicOrigin}${pathname}`} />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:url" content={`${publicOrigin}${pathname}`} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
    </Helmet>
  );
}