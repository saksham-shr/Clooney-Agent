/**
 * Compares CSS styles between original and generated components
 */
export class CSSComparer {
  compareStyles(originalStyles, generatedStyles) {
    const differences = [];
    const matches = [];

    const allKeys = new Set([
      ...Object.keys(originalStyles || {}),
      ...Object.keys(generatedStyles || {}),
    ]);

    allKeys.forEach(key => {
      const original = originalStyles?.[key];
      const generated = generatedStyles?.[key];

      if (original === generated) {
        matches.push({ property: key, value: original });
      } else {
        differences.push({
          property: key,
          original,
          generated,
          match: false,
        });
      }
    });

    return {
      totalProperties: allKeys.size,
      matches: matches.length,
      differences: differences.length,
      matchPercentage: ((matches.length / allKeys.size) * 100).toFixed(2),
      details: {
        matches,
        differences,
      },
    };
  }

  generateCSSReport(styleComparisons) {
    const report = {
      totalComparisons: styleComparisons.length,
      totalProperties: styleComparisons.reduce((sum, c) => sum + c.totalProperties, 0),
      totalMatches: styleComparisons.reduce((sum, c) => sum + c.matches, 0),
      totalDifferences: styleComparisons.reduce((sum, c) => sum + c.differences, 0),
      averageMatchPercentage: (
        styleComparisons.reduce((sum, c) => sum + parseFloat(c.matchPercentage), 0) / styleComparisons.length
      ).toFixed(2),
      comparisons: styleComparisons,
    };

    return report;
  }

  identifyMissingStyles(originalStyles, generatedStyles) {
    const missing = [];

    Object.entries(originalStyles || {}).forEach(([key, value]) => {
      if (!(key in (generatedStyles || {}))) {
        missing.push({
          property: key,
          value,
          severity: this.calculateSeverity(key),
        });
      }
    });

    return missing;
  }

  calculateSeverity(property) {
    const criticalProps = ['display', 'position', 'width', 'height', 'backgroundColor'];
    const importantProps = ['padding', 'margin', 'borderRadius', 'fontSize'];

    if (criticalProps.includes(property)) return 'critical';
    if (importantProps.includes(property)) return 'important';
    return 'minor';
  }
}

export default CSSComparer;
