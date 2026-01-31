import { useRef, useEffect, useCallback } from "react";

// Hook for swipe gesture horizontal scroll with smooth momentum animation
export const useSwipeScroll = (enabled: boolean = true) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; scrollLeft: number; time: number } | null>(null);
  const velocityRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!containerRef.current) return;
    
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      time: Date.now(),
    };
    velocityRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current || !containerRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = touchStartRef.current.x - touch.clientX;
    const deltaY = Math.abs(touchStartRef.current.y - touch.clientY);

    // Only scroll horizontally if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
      const newScrollLeft = touchStartRef.current.scrollLeft + deltaX;
      containerRef.current.scrollLeft = newScrollLeft;
      
      // Calculate velocity for momentum
      const timeDelta = Date.now() - touchStartRef.current.time;
      if (timeDelta > 0) {
        velocityRef.current = deltaX / timeDelta;
      }
      
      // Update start position for velocity calculation
      touchStartRef.current.x = touch.clientX;
      touchStartRef.current.scrollLeft = newScrollLeft;
      touchStartRef.current.time = Date.now();
      
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!containerRef.current) return;
    
    const velocity = velocityRef.current;
    const container = containerRef.current;
    
    // Apply momentum scrolling with smooth deceleration
    if (Math.abs(velocity) > 0.1) {
      let currentVelocity = velocity * 15; // Amplify for smoother momentum
      const friction = 0.95; // Deceleration factor
      
      const animate = () => {
        if (Math.abs(currentVelocity) < 0.5) {
          animationRef.current = null;
          return;
        }
        
        container.scrollLeft += currentVelocity;
        currentVelocity *= friction;
        
        // Check bounds
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft <= 0 || container.scrollLeft >= maxScroll) {
          currentVelocity = 0;
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    touchStartRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return containerRef;
};
