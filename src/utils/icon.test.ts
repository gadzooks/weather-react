import iconClass, { moonPhaseIcon, trailScore, trailScoreColor } from './icon';

describe('iconClass', () => {
  it('should show mapping for clear-day', () => {
    const result = iconClass('clear-day', 0, 0, 0);
    expect(result).toStrictEqual('wi weather-icon wi-day-sunny day-sunny ');
  });

  it('should show mapping for cloudy', () => {
    const result = iconClass('cloudy', 10, 0, 0);
    expect(result).toStrictEqual(
      'wi weather-icon wi-day-cloudy day-cloudy sunshine-10',
    );
  });

  it('should show mapping for cloudy', () => {
    const result = iconClass('cloudy', 30, 0, 0);
    expect(result).toStrictEqual(
      'wi weather-icon wi-day-cloudy day-cloudy sunshine-50',
    );
  });
});

describe('moonPhaseIcon', () => {
  it('should return new moon for phase 0', () => {
    expect(moonPhaseIcon(0)).toBe('wi wi-moon-new');
  });

  it('should return first quarter for phase ~0.19', () => {
    expect(moonPhaseIcon(0.19)).toBe('wi wi-moon-first-quarter');
  });

  it('should return full moon for phase ~0.5', () => {
    expect(moonPhaseIcon(0.5)).toBe('wi wi-moon-full');
  });

  it('should return third quarter for phase ~0.75', () => {
    expect(moonPhaseIcon(0.75)).toBe('wi wi-moon-third-quarter');
  });

  it('should return new moon for phase near 1', () => {
    expect(moonPhaseIcon(0.97)).toBe('wi wi-moon-new');
  });

  it('should handle waxing crescent phase', () => {
    expect(moonPhaseIcon(0.07)).toBe('wi wi-moon-waxing-crescent-3');
  });

  it('should handle waning gibbous phase', () => {
    expect(moonPhaseIcon(0.6)).toBe('wi wi-moon-waning-gibbous-2');
  });
});

describe('trailScore', () => {
  it('should return perfect score for ideal conditions', () => {
    // Ideal temp range (45-70°F avg) + 0% precip
    const score = trailScore(65, 50, 0);
    expect(score).toBe(100);
  });

  it('should return 50 for ideal temp with 100% precip', () => {
    const score = trailScore(65, 50, 100);
    expect(score).toBe(50);
  });

  it('should penalize very cold days', () => {
    // Very cold day (avg 15°F)
    const score = trailScore(20, 10, 0);
    expect(score).toBeLessThan(70);
    expect(score).toBeGreaterThan(0);
  });

  it('should penalize very hot days', () => {
    // Very hot day (avg 87.5°F)
    const score = trailScore(95, 80, 0);
    expect(score).toBeLessThan(80);
    expect(score).toBeGreaterThan(40);
  });

  it('should return moderate score for acceptable conditions', () => {
    // Slightly cool (35-45°F range) with low precip
    const score = trailScore(45, 35, 20);
    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThan(90);
  });

  it('should handle 50% precipitation', () => {
    const score = trailScore(60, 50, 50);
    expect(score).toBe(75); // 50 temp + 25 precip
  });
});

describe('trailScoreColor', () => {
  it('should return excellent for score >= 80', () => {
    expect(trailScoreColor(80)).toBe('score-excellent');
    expect(trailScoreColor(100)).toBe('score-excellent');
  });

  it('should return good for score 50-79', () => {
    expect(trailScoreColor(50)).toBe('score-good');
    expect(trailScoreColor(79)).toBe('score-good');
  });

  it('should return fair for score 25-49', () => {
    expect(trailScoreColor(25)).toBe('score-fair');
    expect(trailScoreColor(49)).toBe('score-fair');
  });

  it('should return poor for score < 25', () => {
    expect(trailScoreColor(0)).toBe('score-poor');
    expect(trailScoreColor(24)).toBe('score-poor');
  });
});
