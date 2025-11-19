/**
 * Calculates overall similarity scores between original and generated UI
 */
export class SimilarityScore {
  calculateOverallScore(visualScore, cssScore, structureScore) {
    const weights = {
      visual: 0.4,
      css: 0.35,
      structure: 0.25,
    };

    const overall = (
      (parseFloat(visualScore) * weights.visual) +
      (parseFloat(cssScore) * weights.css) +
      (parseFloat(structureScore) * weights.structure)
    );

    return {
      overall: overall.toFixed(2),
      visual: visualScore,
      css: cssScore,
      structure: structureScore,
      verdict: this.getVerdict(overall),
    };
  }

  calculateStructuralSimilarity(originalDOM, generatedDOM) {
    const originalStructure = this.extractStructure(originalDOM);
    const generatedStructure = this.extractStructure(generatedDOM);

    const similarity = this.compareLists(originalStructure, generatedStructure);
    return (similarity * 100).toFixed(2);
  }

  extractStructure(node, depth = 0) {
    if (!node || depth > 10) return [];

    const structure = [node.tag];

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => {
        structure.push(...this.extractStructure(child, depth + 1));
      });
    }

    return structure;
  }

  compareLists(list1, list2) {
    if (list1.length === 0 && list2.length === 0) return 1;
    if (list1.length === 0 || list2.length === 0) return 0;

    const matches = list1.filter(item => list2.includes(item)).length;
    return matches / Math.max(list1.length, list2.length);
  }

  calculateLayoutSimilarity(originalLayout, generatedLayout) {
    const similarities = [];

    originalLayout.forEach(origLayout => {
      const genLayout = generatedLayout.find(
        g => g.tag === origLayout.tag && g.childCount === origLayout.childCount
      );

      if (genLayout) {
        similarities.push(1);
      } else {
        similarities.push(0.5);
      }
    });

    const avgSimilarity = similarities.length > 0
      ? similarities.reduce((a, b) => a + b) / similarities.length
      : 0;

    return (avgSimilarity * 100).toFixed(2);
  }

  calculateComponentSimilarity(originalComponents, generatedComponents) {
    const matches = originalComponents.filter(orig =>
      generatedComponents.some(gen =>
        gen.estimatedType === orig.estimatedType &&
        gen.childCount === orig.childCount
      )
    ).length;

    const similarity = originalComponents.length > 0
      ? (matches / originalComponents.length) * 100
      : 100;

    return similarity.toFixed(2);
  }

  getVerdict(score) {
    const scoreNum = parseFloat(score);
    if (scoreNum >= 90) return 'EXCELLENT';
    if (scoreNum >= 80) return 'GOOD';
    if (scoreNum >= 70) return 'ACCEPTABLE';
    if (scoreNum >= 60) return 'NEEDS_IMPROVEMENT';
    return 'POOR';
  }

  generateDetailedReport(analysis) {
    return {
      timestamp: new Date().toISOString(),
      summary: {
        overallScore: analysis.overallScore,
        verdict: analysis.verdict,
      },
      breakdown: {
        visual: {
          score: analysis.visual,
          weight: '40%',
        },
        css: {
          score: analysis.css,
          weight: '35%',
        },
        structure: {
          score: analysis.structure,
          weight: '25%',
        },
      },
      recommendations: this.generateRecommendations(analysis),
    };
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    if (parseFloat(analysis.visual) < 80) {
      recommendations.push('Visual appearance needs adjustment. Review color schemes and spacing.');
    }

    if (parseFloat(analysis.css) < 80) {
      recommendations.push('CSS styles need refinement. Check computed styles against original.');
    }

    if (parseFloat(analysis.structure) < 80) {
      recommendations.push('DOM structure differs significantly. Review component hierarchy.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Generated UI closely matches original. Minor refinements may be beneficial.');
    }

    return recommendations;
  }
}

export default SimilarityScore;
