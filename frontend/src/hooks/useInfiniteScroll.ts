import { useEffect, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
  throttleDelay?: number;
}

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = "100px",
  threshold = 0,
  enabled = true,
  throttleDelay = 300,
}: UseInfiniteScrollProps) {
  const fetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: false,
  });

  const handleFetchNext = useCallback(async () => {
    const now = Date.now();

    // Check if we should skip this fetch
    if (
      !enabled ||
      !hasNextPage ||
      isFetchingNextPage ||
      fetchingRef.current ||
      now - lastFetchTimeRef.current < throttleDelay
    ) {
      return;
    }

    try {
      fetchingRef.current = true;
      lastFetchTimeRef.current = now;
      console.log(
        `🚀 Fetching next page at ${new Date().toLocaleTimeString()}`
      );
      await fetchNextPage();
    } catch (error) {
      console.error("❌ Failed to fetch next page:", error);
    } finally {
      // Add small delay to prevent rapid successive calls
      setTimeout(() => {
        fetchingRef.current = false;
      }, 100);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, enabled, throttleDelay]);

  useEffect(() => {
    if (inView) {
      handleFetchNext();
    }
  }, [inView, handleFetchNext]);

  // Reset refs when query resets
  useEffect(() => {
    if (!hasNextPage) {
      fetchingRef.current = false;
      lastFetchTimeRef.current = 0;
    }
  }, [hasNextPage]);

  return {
    ref,
    inView,
    isThrottled: fetchingRef.current,
  };
}
