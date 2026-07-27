import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const articlePath = path.join(
  process.cwd(),
  'src/content/columns-en/006-taiwan-massage-history-law.md',
);

describe('English massage column 006 — fine amounts', () => {
  it('describes the bundled barbershop services naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'A single haircut came with all these premium services, making it excellent value for money.',
    );
    expect(raw).not.toContain('Getting a haircut once let you');
  });

  it('describes the barbershops as part of Taiwan cultural memory naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'These Taiwanese-style barbershops remain a distinctive part of the cultural memory of many Taiwanese people.',
    );
    expect(raw).not.toContain('this Taiwanese-style barbershop');
  });

  it('describes streets lined with massage shops without a literal compound', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'Taiwan also has many streets lined with a wide variety of massage shops.',
    );
    expect(raw).not.toContain('massage streets');
  });

  it('links the present-day number of massage shops to the petition without overstating causation', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'The large number of massage shops in Taiwan today may be linked to a single petition for constitutional interpretation.',
    );
    expect(raw).not.toContain('may well be thanks to');
  });

  it('describes the police discovery of the two employees naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'This law remained in force until 2003, when police found that Mr. Lin, who ran a barbershop, had hired two employees without visual impairments to provide shampooing and massage services.',
    );
    expect(raw).not.toContain('was found by the police after hiring');
  });

  it('maps each fine to Mr. Lin and the two employees unambiguously', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'Under the law at the time, Mr. Lin was fined NT$40,000, while the two employees were fined NT$10,000 and NT$20,000, respectively.',
    );
    expect(raw).not.toContain('were each fined NT$40,000');
  });

  it('describes barriers and occupational limits in natural English', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'In Taiwan, people with visual impairments face barriers in many aspects of life, including personal development, daily activities, learning, and education, and can pursue only a very limited range of occupations.',
    );
    expect(raw).not.toContain('barriers in growth');
  });

  it('preserves protection, employment opportunities, and the right to a livelihood', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'Therefore, to protect people with visual impairments, who were in a socially vulnerable position, the legislators at the time enacted a law safeguarding their employment opportunities and right to a livelihood.',
    );
    expect(raw).not.toContain('the visually impaired as a vulnerable group');
    expect(raw).not.toContain('created a law intended to protect');
  });

  it('states the gradually emerging occupational-rights concern naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'concerns gradually emerged that protecting only the rights of people with visual impairments excessively restricted the occupational rights of people without visual impairments.',
    );
    expect(raw).not.toContain('opinions gradually arose that');
  });

  it('describes the occupational-rights debate with people-first wording', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'In the course of the debate over the occupational rights of people with and without visual impairments, many opposing views emerged.',
    );
    expect(raw).not.toContain(
      'visually impaired and non-visually impaired persons',
    );
  });

  it('connects massage-related misconduct to lasting trauma naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'Today, many people choose massage to relieve stress, but incidents of sexual harassment and sexual assault continue to occur during massages.',
    );
    expect(raw).toContain(
      'What begins as a simple attempt to unwind can instead leave a person with lifelong trauma.',
    );
    expect(raw).not.toContain('What began as simply wanting a massage');
  });
});
