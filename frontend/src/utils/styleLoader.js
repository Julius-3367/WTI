/**
 * Style Loader Utilities
 * Ensures all CSS and theme styles are properly loaded before app initialization
 */

/**
 * Preload critical fonts
 */
export const preloadFonts = () => {
  return new Promise((resolve) => {
    const fonts = [
      {
        family: 'Inter',
        weights: ['300', '400', '500', '600', '700'],
        display: 'swap'
      },
      {
        family: 'Noto Sans Arabic', // For RTL support
        weights: ['400', '500', '600', '700'],
        display: 'swap'
      }
    ];

    let fontsLoaded = 0;
    const totalFonts = fonts.reduce((total, font) => total + font.weights.length, 0);

    if (totalFonts === 0) {
      resolve();
      return;
    }

    fonts.forEach(font => {
      font.weights.forEach(weight => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = `https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2`;

        link.onload = () => {
          fontsLoaded++;
          if (fontsLoaded === totalFonts) {
            console.log('✅ Fonts preloaded successfully');
            resolve();
          }
        };

        link.onerror = () => {
          fontsLoaded++;
          console.warn('⚠️ Font failed to load:', link.href);
          if (fontsLoaded === totalFonts) {
            resolve();
          }
        };

        document.head.appendChild(link);
      });
    });

    // Fallback timeout
    setTimeout(() => {
      if (fontsLoaded < totalFonts) {
        console.warn('⚠️ Font loading timeout, continuing with fallbacks');
        resolve();
      }
    }, 3000);
  });
};

/**
 * Ensure CSS is fully loaded
 */
export const ensureCSSLoaded = () => {
  return new Promise((resolve) => {
    const checkCSS = () => {
      const stylesheets = Array.from(document.styleSheets);
      let loadedCount = 0;

      if (stylesheets.length === 0) {
        // No stylesheets yet, wait a bit more
        setTimeout(checkCSS, 100);
        return;
      }

      stylesheets.forEach((stylesheet, index) => {
        try {
          // Try to access cssRules to check if stylesheet is loaded
          const rules = stylesheet.cssRules || stylesheet.rules;
          loadedCount++;
        } catch (e) {
          // Stylesheet still loading or CORS issue
          console.log(`Waiting for stylesheet ${index} to load...`);
        }
      });

      if (loadedCount === stylesheets.length) {
        console.log('✅ All CSS stylesheets loaded');
        resolve();
      } else {
        setTimeout(checkCSS, 100);
      }
    };

    // Start checking after a small delay
    setTimeout(checkCSS, 50);

    // Fallback timeout
    setTimeout(() => {
      console.log('✅ CSS loading timeout reached, proceeding');
      resolve();
    }, 2000);
  });
};

/**
 * Wait for DOM to be ready
 */
export const waitForDOM = () => {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else if (document.readyState === 'interactive') {
      // DOM is ready but resources might still be loading
      setTimeout(resolve, 100);
    } else {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    }
  });
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = () => {
  return new Promise((resolve) => {
    const criticalImages = [
      // Add any critical images that should be preloaded
      // '/assets/logo.png',
      // '/assets/hero-bg.jpg'
    ];

    if (criticalImages.length === 0) {
      resolve();
      return;
    }

    let imagesLoaded = 0;
    const totalImages = criticalImages.length;

    criticalImages.forEach(src => {
      const img = new Image();
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          console.log('✅ Critical images preloaded');
          resolve();
        }
      };
      img.onerror = () => {
        imagesLoaded++;
        console.warn('⚠️ Failed to preload image:', src);
        if (imagesLoaded === totalImages) {
          resolve();
        }
      };
      img.src = src;
    });

    // Fallback timeout
    setTimeout(() => {
      if (imagesLoaded < totalImages) {
        console.warn('⚠️ Image preloading timeout');
        resolve();
      }
    }, 5000);
  });
};

/**
 * Initialize theme-specific CSS custom properties
 */
export const initializeThemeVariables = (theme) => {
  const root = document.documentElement;

  // Set CSS custom properties for theme colors
  root.style.setProperty('--color-primary', theme.palette.primary.main);
  root.style.setProperty('--color-primary-light', theme.palette.primary.light);
  root.style.setProperty('--color-primary-dark', theme.palette.primary.dark);
  root.style.setProperty('--color-secondary', theme.palette.secondary.main);
  root.style.setProperty('--color-secondary-light', theme.palette.secondary.light);
  root.style.setProperty('--color-secondary-dark', theme.palette.secondary.dark);

  // Background colors
  root.style.setProperty('--color-background', theme.palette.background.default);
  root.style.setProperty('--color-surface', theme.palette.background.paper);

  // Text colors
  root.style.setProperty('--color-text-primary', theme.palette.text.primary);
  root.style.setProperty('--color-text-secondary', theme.palette.text.secondary);

  // Custom status colors
  if (theme.palette.custom) {
    Object.entries(theme.palette.custom).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }

  // Typography
  root.style.setProperty('--font-family', theme.typography.fontFamily);
  root.style.setProperty('--border-radius', `${theme.shape.borderRadius}px`);

  // Breakpoints
  Object.entries(theme.breakpoints.values).forEach(([key, value]) => {
    root.style.setProperty(`--breakpoint-${key}`, `${value}px`);
  });

  console.log('✅ Theme CSS variables initialized');
};

/**
 * Comprehensive style loading orchestrator
 */
export const loadAllStyles = async (theme) => {
  console.log('🎨 Starting comprehensive style loading...');

  const startTime = performance.now();

  try {
    // Run parallel loading tasks
    await Promise.all([
      waitForDOM(),
      ensureCSSLoaded(),
      preloadFonts(),
      preloadCriticalImages()
    ]);

    // Initialize theme variables after everything else is loaded
    initializeThemeVariables(theme);

    const endTime = performance.now();
    const loadTime = Math.round(endTime - startTime);

    console.log(`✅ All styles loaded successfully in ${loadTime}ms`);

    // Add a small buffer to ensure everything is settled
    await new Promise(resolve => setTimeout(resolve, 50));

    return true;
  } catch (error) {
    console.error('❌ Error during style loading:', error);

    // Still proceed with app loading even if some styles failed
    initializeThemeVariables(theme);
    return true;
  }
};

/**
 * Development helper to validate theme loading
 */
export const validateThemeLoading = (theme) => {
  if (process.env.NODE_ENV !== 'development') return;

  const validations = [
    {
      name: 'Theme object exists',
      check: () => !!theme,
      value: !!theme
    },
    {
      name: 'Primary color defined',
      check: () => !!theme?.palette?.primary?.main,
      value: theme?.palette?.primary?.main
    },
    {
      name: 'Typography configured',
      check: () => !!theme?.typography?.fontFamily,
      value: theme?.typography?.fontFamily
    },
    {
      name: 'Breakpoints defined',
      check: () => !!theme?.breakpoints?.values,
      value: Object.keys(theme?.breakpoints?.values || {}).length
    },
    {
      name: 'Components customized',
      check: () => !!theme?.components,
      value: Object.keys(theme?.components || {}).length
    },
    {
      name: 'CSS variables set',
      check: () => !!document.documentElement.style.getPropertyValue('--color-primary'),
      value: document.documentElement.style.getPropertyValue('--color-primary')
    }
  ];

  console.group('🔍 Theme Loading Validation');
  validations.forEach(({ name, check, value }) => {
    if (check()) {
      console.log(`✅ ${name}:`, value);
    } else {
      console.warn(`❌ ${name}:`, value);
    }
  });
  console.groupEnd();
};

/**
 * Performance monitoring for style loading
 */
export const monitorStylePerformance = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  // Monitor paint metrics
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        console.log(`🎨 First Contentful Paint: ${Math.round(entry.startTime)}ms`);
      }
      if (entry.name === 'largest-contentful-paint') {
        console.log(`🎨 Largest Contentful Paint: ${Math.round(entry.startTime)}ms`);
      }
    });
  });

  try {
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
  } catch (e) {
    // Observer not supported
    console.log('Performance observer not supported');
  }

  // Report resource loading times
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');

    console.group('📊 Style Loading Performance');
    console.log(`DOM Content Loaded: ${Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart)}ms`);
    console.log(`Page Load Complete: ${Math.round(navigation.loadEventEnd - navigation.navigationStart)}ms`);

    const cssResources = resources.filter(r => r.name.includes('.css') || r.initiatorType === 'css');
    if (cssResources.length > 0) {
      console.log('CSS Resources:', cssResources.map(r => ({
        url: r.name.split('/').pop(),
        duration: Math.round(r.duration) + 'ms'
      })));
    }
    console.groupEnd();
  }, { once: true });
};
