import fetch from "node-fetch";
import * as cheerio from "cheerio";

interface ProtocolSection {
  id: string;
  title: string;
  content: string;
  categories: string[];
  url: string;
}

const PROTOCOL_URL = "https://protocol.bryanjohnson.com";

export async function scrapeProtocolSections(): Promise<ProtocolSection[]> {
  try {
    const response = await fetch(PROTOCOL_URL);
    const html = await response.text();
    const $ = cheerio.load(html);
    const sections: ProtocolSection[] = [];

    // Scrape main protocol sections
    $('.section-container').each((_, element) => {
      const $section = $(element);
      const id = $section.attr('id') || '';
      const title = $section.find('h2, h3').first().text().trim();
      const content = $section.find('p').first().text().trim();

      if (id && title) {
        sections.push({
          id,
          title,
          content,
          categories: categorizeSectionContent(content, title),
          url: `${PROTOCOL_URL}#${id}`
        });
      }
    });

    return sections;
  } catch (error) {
    console.error('Error scraping protocol:', error);
    throw new Error('Failed to scrape protocol sections');
  }
}

function categorizeSectionContent(content: string, title: string): string[] {
  const categories = new Set<string>();
  const text = `${title} ${content}`.toLowerCase();

  // Map content to categories based on keywords
  const categoryKeywords = {
    supplements: ['supplement', 'vitamin', 'mineral', 'omega', 'nutrient'],
    exercise: ['exercise', 'workout', 'fitness', 'training', 'cardio', 'strength'],
    diet: ['diet', 'nutrition', 'food', 'meal', 'eating'],
    sleep: ['sleep', 'circadian', 'rest', 'bed'],
    testing: ['test', 'measure', 'track', 'monitor', 'biomarker'],
    longevity: ['longevity', 'lifespan', 'aging', 'age'],
    brain: ['brain', 'cognitive', 'mental', 'focus', 'memory'],
    hormones: ['hormone', 'testosterone', 'thyroid', 'insulin']
  };

  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      categories.add(category);
    }
  });

  return Array.from(categories);
}

export function findRelevantSections(
  userPreferences: {
    improvementAreas: string[];
    currentHealth: string[];
    equipment: string[];
  }
): Map<string, string> {
  const matches = new Map<string, string>();

  // Map user preferences to relevant protocol sections
  const categoryMapping = {
    'biological-age': ['testing', 'supplements'],
    'brain': ['brain', 'supplements'],
    'sleep': ['sleep'],
    'fitness': ['exercise'],
    'longevity': ['longevity', 'supplements', 'diet'],
    'hormones': ['hormones', 'testing']
  };

  const equipmentMapping = {
    'red-light': ['light-therapy'],
    'cgm': ['glucose', 'testing'],
    'oura': ['sleep', 'tracking'],
    'hyperbaric': ['oxygen-therapy'],
    'infrared-sauna': ['sauna', 'heat-therapy'],
    'cold-plunge': ['cold-therapy'],
    'peptide-injections': ['peptides'],
    'blood-testing': ['testing', 'biomarkers'],
    'dexa': ['body-composition', 'testing']
  };

  const currentHealthMapping = {
    'supplements': ['supplements'],
    'tracking-sleep': ['sleep'],
    'tracking-glucose': ['glucose', 'testing'],
    'regular-exercise': ['exercise'],
    'strict-diet': ['diet'],
    'blood-tests': ['testing']
  };

  // Process improvement areas
  userPreferences.improvementAreas.forEach(area => {
    const categories = categoryMapping[area as keyof typeof categoryMapping] || [];
    categories.forEach(category => {
      if (!matches.has(category)) {
        matches.set(category, `${PROTOCOL_URL}#${category}`);
      }
    });
  });

  // Process equipment
  userPreferences.equipment.forEach(item => {
    const categories = equipmentMapping[item as keyof typeof equipmentMapping] || [];
    categories.forEach(category => {
      if (!matches.has(category)) {
        matches.set(category, `${PROTOCOL_URL}#${category}`);
      }
    });
  });

  // Process current health practices
  userPreferences.currentHealth.forEach(practice => {
    const categories = currentHealthMapping[practice as keyof typeof currentHealthMapping] || [];
    categories.forEach(category => {
      if (!matches.has(category)) {
        matches.set(category, `${PROTOCOL_URL}#${category}`);
      }
    });
  });

  return matches;
}