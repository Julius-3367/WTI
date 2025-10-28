/**
 * Theme Validator Utility
 * Helps validate and enforce proper theme usage across components
 */

import { theme } from '../theme/theme';

/**
 * Validates if a component is properly using theme colors
 * @param {Object} componentProps - Component props to validate
 * @param {Array} requiredThemeProps - Required theme properties
 * @returns {Object} Validation results
 */
export const validateThemeUsage = (componentProps, requiredThemeProps = []) => {
  const results = {
    isValid: true,
    warnings: [],
    errors: [],
    suggestions: [],
  };

  // Check for hardcoded colors
  const hardcodedColorPattern = /#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|hsl\(|hsla\(/;

  const checkForHardcodedColors = (obj, path = '') => {
    if (typeof obj === 'string') {
      if (hardcodedColorPattern.test(obj)) {
        results.warnings.push({
          type: 'HARDCODED_COLOR',
          message: `Hardcoded color found at ${path}: ${obj}`,
          suggestion: 'Use theme.palette colors instead',
          path,
          value: obj,
        });
        results.isValid = false;
      }
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        checkForHardcodedColors(obj[key], path ? `${path}.${key}` : key);
      });
    }
  };

  if (componentProps.sx) {
    checkForHardcodedColors(componentProps.sx, 'sx');
  }

  if (componentProps.style) {
    checkForHardcodedColors(componentProps.style, 'style');
  }

  // Check for required theme properties
  requiredThemeProps.forEach(prop => {
    const propValue = getNestedProperty(componentProps, prop);
    if (!propValue) {
      results.errors.push({
        type: 'MISSING_THEME_PROP',
        message: `Required theme property missing: ${prop}`,
        suggestion: `Add ${prop} to component props`,
        property: prop,
      });
      results.isValid = false;
    }
  });

  // Check for proper Material-UI component usage
  if (componentProps.className && componentProps.className.includes('bg-')) {
    results.warnings.push({
      type: 'TAILWIND_USAGE',
      message: 'Tailwind CSS classes detected',
      suggestion: 'Use Material-UI sx prop instead of className for styling',
      className: componentProps.className,
    });
  }

  return results;
};

/**
 * Helper function to get nested object properties
 */
const getNestedProperty = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

/**
 * Validates if colors are from the theme palette
 * @param {string} color - Color value to validate
 * @returns {Object} Validation result
 */
export const validateThemeColor = (color) => {
  const themeColors = getAllThemeColors();

  const result = {
    isThemeColor: false,
    suggestedThemeColor: null,
    category: null,
  };

  // Check if color exists in theme
  for (const [category, colors] of Object.entries(themeColors)) {
    if (colors.includes(color)) {
      result.isThemeColor = true;
      result.category = category;
      break;
    }
  }

  // Suggest similar theme color if not found
  if (!result.isThemeColor) {
    result.suggestedThemeColor = findSimilarThemeColor(color, themeColors);
  }

  return result;
};

/**
 * Gets all colors from the theme palette
 * @returns {Object} Object containing all theme colors by category
 */
const getAllThemeColors = () => {
  const colors = {
    primary: [
      theme.palette.primary.main,
      theme.palette.primary.light,
      theme.palette.primary.dark,
    ],
    secondary: [
      theme.palette.secondary.main,
      theme.palette.secondary.light,
      theme.palette.secondary.dark,
    ],
    error: [
      theme.palette.error.main,
      theme.palette.error.light,
      theme.palette.error.dark,
    ],
    warning: [
      theme.palette.warning.main,
      theme.palette.warning.light,
      theme.palette.warning.dark,
    ],
    info: [
      theme.palette.info.main,
      theme.palette.info.light,
      theme.palette.info.dark,
    ],
    success: [
      theme.palette.success.main,
      theme.palette.success.light,
      theme.palette.success.dark,
    ],
    grey: Object.values(theme.palette.grey),
  };

  // Add custom colors if they exist
  if (theme.palette.custom) {
    colors.custom = Object.values(theme.palette.custom);
  }

  return colors;
};

/**
 * Finds similar theme color based on hex similarity
 * @param {string} inputColor - Input color to match
 * @param {Object} themeColors - Theme colors object
 * @returns {string|null} Suggested theme color
 */
const findSimilarThemeColor = (inputColor, themeColors) => {
  // Simple color matching - could be enhanced with proper color distance calculation
  const allColors = Object.values(themeColors).flat();

  // For now, return null - could implement color distance calculation
  return null;
};

/**
 * Generates theme-compliant sx prop suggestions
 * @param {Object} currentStyles - Current style object
 * @returns {Object} Suggested sx prop object
 */
export const generateThemeSxSuggestions = (currentStyles) => {
  const suggestions = {};

  Object.entries(currentStyles).forEach(([property, value]) => {
    switch (property) {
      case 'backgroundColor':
      case 'background':
        if (typeof value === 'string' && value.startsWith('#')) {
          suggestions[property] = 'theme.palette.primary.main';
        }
        break;

      case 'color':
        if (typeof value === 'string' && value.startsWith('#')) {
          suggestions[property] = 'theme.palette.text.primary';
        }
        break;

      case 'borderColor':
        if (typeof value === 'string' && value.startsWith('#')) {
          suggestions[property] = 'theme.palette.divider';
        }
        break;

      case 'boxShadow':
        if (typeof value === 'string') {
          suggestions[property] = 'theme.shadows[2]';
        }
        break;

      case 'fontSize':
        if (typeof value === 'string') {
          suggestions[property] = 'theme.typography.body1.fontSize';
        }
        break;

      case 'fontFamily':
        suggestions[property] = 'theme.typography.fontFamily';
        break;

      case 'borderRadius':
        if (typeof value === 'string' || typeof value === 'number') {
          suggestions[property] = 'theme.shape.borderRadius';
        }
        break;

      case 'spacing':
      case 'margin':
      case 'padding':
        if (typeof value === 'string' || typeof value === 'number') {
          suggestions[property] = 'theme.spacing(2)';
        }
        break;

      default:
        suggestions[property] = value;
    }
  });

  return suggestions;
};

/**
 * Validates Typography component usage
 * @param {Object} typographyProps - Typography component props
 * @returns {Object} Validation results
 */
export const validateTypographyUsage = (typographyProps) => {
  const results = {
    isValid: true,
    warnings: [],
    suggestions: [],
  };

  const validVariants = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'subtitle1', 'subtitle2',
    'body1', 'body2',
    'button', 'caption', 'overline'
  ];

  // Check if variant is specified
  if (!typographyProps.variant) {
    results.warnings.push({
      type: 'MISSING_VARIANT',
      message: 'Typography variant not specified',
      suggestion: 'Add variant prop for consistent typography',
    });
  }

  // Check if variant is valid
  if (typographyProps.variant && !validVariants.includes(typographyProps.variant)) {
    results.warnings.push({
      type: 'INVALID_VARIANT',
      message: `Invalid typography variant: ${typographyProps.variant}`,
      suggestion: `Use one of: ${validVariants.join(', ')}`,
    });
    results.isValid = false;
  }

  // Check for inline styles that should use theme
  if (typographyProps.style) {
    const { fontSize, fontFamily, fontWeight, color } = typographyProps.style;

    if (fontSize) {
      results.suggestions.push({
        type: 'USE_VARIANT',
        message: 'Consider using Typography variant instead of inline fontSize',
        suggestion: 'Use variant prop for consistent typography scaling',
      });
    }

    if (fontFamily) {
      results.suggestions.push({
        type: 'USE_THEME_FONT',
        message: 'Use theme.typography.fontFamily instead of inline font',
        suggestion: 'Remove fontFamily style and let theme handle it',
      });
    }
  }

  return results;
};

/**
 * Validates Material-UI component props
 * @param {string} componentName - Name of the component
 * @param {Object} props - Component props
 * @returns {Object} Validation results
 */
export const validateMuiComponentUsage = (componentName, props) => {
  const results = {
    isValid: true,
    warnings: [],
    suggestions: [],
  };

  const componentValidations = {
    Button: (props) => {
      if (!props.variant) {
        results.suggestions.push({
          type: 'ADD_VARIANT',
          message: 'Consider adding variant prop to Button',
          suggestion: 'Use variant="contained", "outlined", or "text"',
        });
      }

      if (props.style && props.style.backgroundColor) {
        results.warnings.push({
          type: 'USE_COLOR_PROP',
          message: 'Use color prop instead of inline backgroundColor',
          suggestion: 'Use color="primary", "secondary", etc.',
        });
      }
    },

    Card: (props) => {
      if (props.style && props.style.boxShadow) {
        results.suggestions.push({
          type: 'USE_ELEVATION',
          message: 'Use elevation prop instead of inline boxShadow',
          suggestion: 'Use elevation={2} or similar',
        });
      }
    },

    Paper: (props) => {
      if (!props.elevation && props.style && props.style.boxShadow) {
        results.suggestions.push({
          type: 'USE_ELEVATION',
          message: 'Use elevation prop for consistent shadows',
          suggestion: 'Use elevation prop instead of inline boxShadow',
        });
      }
    },
  };

  if (componentValidations[componentName]) {
    componentValidations[componentName](props);
  }

  return results;
};

/**
 * Comprehensive component validation
 * @param {string} componentName - Name of the component
 * @param {Object} props - Component props
 * @returns {Object} Complete validation results
 */
export const validateComponent = (componentName, props) => {
  const results = {
    componentName,
    isValid: true,
    warnings: [],
    errors: [],
    suggestions: [],
  };

  // Run general theme validation
  const themeValidation = validateThemeUsage(props);
  results.warnings.push(...themeValidation.warnings);
  results.errors.push(...themeValidation.errors);
  results.suggestions.push(...themeValidation.suggestions);

  // Run component-specific validation
  const componentValidation = validateMuiComponentUsage(componentName, props);
  results.warnings.push(...componentValidation.warnings);
  results.suggestions.push(...componentValidation.suggestions);

  // Run typography validation if it's a Typography component
  if (componentName === 'Typography') {
    const typographyValidation = validateTypographyUsage(props);
    results.warnings.push(...typographyValidation.warnings);
    results.suggestions.push(...typographyValidation.suggestions);
  }

  results.isValid = results.errors.length === 0;

  return results;
};

/**
 * Development helper to log validation results
 * @param {Object} validationResults - Results from validation
 */
export const logValidationResults = (validationResults) => {
  if (process.env.NODE_ENV !== 'development') return;

  const { componentName, isValid, warnings, errors, suggestions } = validationResults;

  console.group(`🎨 Theme Validation: ${componentName}`);

  if (isValid && warnings.length === 0 && suggestions.length === 0) {
    console.log('✅ Perfect! Component follows theme guidelines.');
  } else {
    if (errors.length > 0) {
      console.error('❌ Errors:');
      errors.forEach(error => {
        console.error(`  • ${error.message}`);
        if (error.suggestion) console.error(`    💡 ${error.suggestion}`);
      });
    }

    if (warnings.length > 0) {
      console.warn('⚠️ Warnings:');
      warnings.forEach(warning => {
        console.warn(`  • ${warning.message}`);
        if (warning.suggestion) console.warn(`    💡 ${warning.suggestion}`);
      });
    }

    if (suggestions.length > 0) {
      console.info('💡 Suggestions:');
      suggestions.forEach(suggestion => {
        console.info(`  • ${suggestion.message}`);
        if (suggestion.suggestion) console.info(`    🔧 ${suggestion.suggestion}`);
      });
    }
  }

  console.groupEnd();
};

/**
 * React hook for component theme validation in development
 * @param {string} componentName - Name of the component
 * @param {Object} props - Component props
 */
export const useThemeValidation = (componentName, props) => {
  if (process.env.NODE_ENV === 'development') {
    React.useEffect(() => {
      const results = validateComponent(componentName, props);
      if (!results.isValid || results.warnings.length > 0 || results.suggestions.length > 0) {
        logValidationResults(results);
      }
    }, [componentName, props]);
  }
};

/**
 * Higher-order component for automatic theme validation
 * @param {React.Component} Component - Component to wrap
 * @param {string} componentName - Name of the component for validation
 * @returns {React.Component} Wrapped component with validation
 */
export const withThemeValidation = (Component, componentName) => {
  return React.forwardRef((props, ref) => {
    useThemeValidation(componentName, props);
    return <Component {...props} ref={ref} />;
  });
};

export default {
  validateThemeUsage,
  validateThemeColor,
  validateTypographyUsage,
  validateMuiComponentUsage,
  validateComponent,
  generateThemeSxSuggestions,
  logValidationResults,
  useThemeValidation,
  withThemeValidation,
};
