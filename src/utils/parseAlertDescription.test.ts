import {
  parseAlertDescription,
  toTitleCase,
} from './parseAlertDescription';

const SMALL_CRAFT = [
  '* WHAT...Southwest winds 15 to 25 kt.',
  '',
  '* WHERE...Northern Inland Waters Including The San Juan Islands.',
  '',
  '* WHEN...Until 10 PM PST this evening.',
  '',
  '* IMPACTS...Conditions will be hazardous to small craft.',
].join('\n');

const WINTER_WEATHER = [
  '* WHAT...Snow expected. Total snow accumulations up to 12 inches.',
  'Winds gusting as high as 35 mph.',
  '',
  '* WHERE...Cascades of Whatcom and Skagit Counties.',
  '',
  '* WHEN...Until 4 AM PST Friday.',
  '',
  '* IMPACTS...Snow-covered roads may make travel conditions difficult',
  'at times through the mountains and cause delays. Temporary road',
  'closures possible. Gusty winds may down tree branches.',
].join('\n');

const AVALANCHE = [
  '...THE NORTHWEST AVALANCHE CENTER HAS ISSUED A SPECIAL AVALANCHE',
  'BULLETIN...',
  '* WHAT..UNIQUELY DANGEROUS AVALANCHE CONDITIONS ARE EXPECTED DUE TO',
  'PROLONGED HOT AND SUNNY WEATHER.',
  '* WHERE...THE OLYMPIC MOUNTAINS AND WASHINGTON CASCADES.',
  '* WHEN...IN EFFECT THROUGH SUN 1830 PDT.',
  '* IMPACTS...MULTIPLE DAYS OF ABOVE FREEZING TEMPERATURES.',
  '* PRECAUTIONARY/PREPAREDNESS ACTIONS...PAY ATTENTION TO THE SLOPES',
  'ABOVE YOU.',
].join('\n');

const UNSTRUCTURED =
  'Dense fog advisory in effect until 10 AM. Visibility near zero at times.';

describe('parseAlertDescription', () => {
  describe('standard 4-section format', () => {
    it('parses WHAT, WHERE, WHEN, IMPACTS sections', () => {
      const result = parseAlertDescription(SMALL_CRAFT);
      expect(result).not.toBeNull();
      expect(result!.sections).toHaveLength(4);

      const labels = result!.sections.map((s) => s.label);
      expect(labels).toEqual(['WHAT', 'WHERE', 'WHEN', 'IMPACTS']);
    });

    it('cleans content to sentence case', () => {
      const result = parseAlertDescription(SMALL_CRAFT);
      expect(result!.sections[0].content).toBe(
        'Southwest winds 15 to 25 kt.',
      );
      expect(result!.sections[1].content).toBe(
        'Northern inland waters including the san juan islands.',
      );
    });

    it('joins multi-line content into a single string', () => {
      const result = parseAlertDescription(WINTER_WEATHER);
      const impacts = result!.sections.find((s) => s.label === 'IMPACTS');
      expect(impacts).toBeDefined();
      expect(impacts!.content).not.toContain('\n');
      expect(impacts!.content).toMatch(/^Snow-covered roads/);
    });
  });

  describe('all-caps descriptions', () => {
    it('converts all-caps content to sentence case', () => {
      const result = parseAlertDescription(AVALANCHE);
      expect(result).not.toBeNull();
      const what = result!.sections.find((s) => s.label === 'WHAT');
      expect(what!.content).toMatch(/^Uniquely dangerous/);
    });

    it('parses extra sections like PRECAUTIONARY/PREPAREDNESS ACTIONS', () => {
      const result = parseAlertDescription(AVALANCHE);
      const labels = result!.sections.map((s) => s.label);
      expect(labels).toContain('PRECAUTIONARY/PREPAREDNESS ACTIONS');
    });

    it('handles descriptions with a preamble before the first section', () => {
      const result = parseAlertDescription(AVALANCHE);
      // Preamble text before * WHAT is ignored — sections are still parsed
      expect(result).not.toBeNull();
      expect(result!.sections.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('fallback for unstructured descriptions', () => {
    it('returns null for plain text with no sections', () => {
      expect(parseAlertDescription(UNSTRUCTURED)).toBeNull();
    });

    it('returns null for a single section (not enough structure)', () => {
      const single = '* WHAT...Fog advisory in effect.';
      expect(parseAlertDescription(single)).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(parseAlertDescription('')).toBeNull();
    });
  });
});

describe('toTitleCase', () => {
  it('converts a single uppercase word', () => {
    expect(toTitleCase('WHAT')).toBe('What');
  });

  it('converts multi-word labels', () => {
    expect(toTitleCase('ADDITIONAL DETAILS')).toBe('Additional Details');
  });

  it('handles slash-separated words', () => {
    expect(toTitleCase('PRECAUTIONARY/PREPAREDNESS ACTIONS')).toBe(
      'Precautionary/Preparedness Actions',
    );
  });
});
