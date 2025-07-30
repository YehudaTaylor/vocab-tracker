class SpacedRepetitionSystem {
  static calculateNextReview(reviewCount, difficultyLevel, correct = true) {
    let interval;
    
    if (reviewCount === 0) {
      interval = 1; // 1 day
    } else if (reviewCount === 1) {
      interval = correct ? 6 : 1; // 6 days if correct, 1 day if incorrect
    } else {
      const easinessFactor = Math.max(1.3, 2.5 - (5 - difficultyLevel) * 0.1);
      const previousInterval = this.getPreviousInterval(reviewCount - 1, difficultyLevel);
      
      if (correct) {
        interval = Math.round(previousInterval * easinessFactor);
      } else {
        interval = 1; // Reset to 1 day if incorrect
      }
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    
    return nextReview;
  }

  static getPreviousInterval(reviewCount, difficultyLevel) {
    if (reviewCount === 0) return 1;
    if (reviewCount === 1) return 6;
    
    const easinessFactor = Math.max(1.3, 2.5 - (5 - difficultyLevel) * 0.1);
    return Math.round(6 * Math.pow(easinessFactor, reviewCount - 1));
  }

  static updateDifficultyLevel(currentLevel, responseQuality) {
    let newLevel = currentLevel;
    
    if (responseQuality >= 4) {
      newLevel = Math.min(5, currentLevel + 1);
    } else if (responseQuality <= 2) {
      newLevel = Math.max(1, currentLevel - 1);
    }
    
    return newLevel;
  }

  static getWordsForReview() {
    const now = new Date();
    return {
      where: {
        nextReview: {
          [require('sequelize').Op.lte]: now
        }
      },
      order: [['nextReview', 'ASC']]
    };
  }
}

module.exports = SpacedRepetitionSystem;