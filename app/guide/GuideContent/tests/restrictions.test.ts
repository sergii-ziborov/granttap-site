import { describe, expect, it } from 'vitest';
import { guideCatalog } from '../catalog';
import { guideContent, guideSearchIndex } from '..';
import { parseGuide } from '../../GuideReader/markdown';

describe('Restrictions handbook journey', () => {
  it('has a dedicated linked chapter discoverable by POODR and architecture', () => {
    expect(guideCatalog.find(page => page.slug === 'restrictions')?.group).toBe('rules');
    expect(guideContent['project-configuration']).toContain('/guide/restrictions');
    expect(guideContent.governance).toContain('/guide/restrictions');
    expect(guideSearchIndex.some(entry => entry.slug === 'restrictions')).toBe(true);
  });
  it('documents editable checks, advisory guidance, receipts and a safe verification sequence', () => {
    const chapter = guideContent.restrictions;
    expect(chapter).toBeDefined();
    const ids = parseGuide(chapter).map(section => section.id);
    expect(ids).toEqual(expect.arrayContaining(['limits', 'presets', 'architecture', 'markdown', 'delivery', 'verify']));
    expect(chapter).toContain('12 000');
    expect(chapter).toContain('.granttap/restrictions.json');
    expect(chapter).toContain('advisory');
    expect(chapter).toContain('Ruby');
    expect(chapter).toContain('не доказывает');
  });
});
