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
    $('section').each((_, element) => {
      const $section = $(element);
      const id = $section.attr('id') || '';
      const title = $section.find('h2').first().text().trim();
      const content = $section.text().trim();
      
      if (id && title) {
        sections.push({
          id,
          title,
          content,
          categories: categorizeSectionContent(content),
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

function categorizeSectionContent(content: string): string[] {
  const categories = [];
  
  // Map content to categories based on keywords
  if (content.toLowerCase().includes('supplement')) categories.push('supplements');
  if (content.toLowerCase().includes('exercise') || content.toLowerCase().includes('workout')) categories.push('exercise');
  if (content.toLowerCase().includes('diet') || content.toLowerCase().includes('nutrition')) categories.push('diet');
  if (content.toLowerCase().includes('sleep')) categories.push('sleep');
  if (content.toLowerCase().includes('test') || content.toLowerCase().includes('measure')) categories.push('testing');
  
  return categories;
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
    'brain': ['supplements', 'diet'],
    'sleep': ['sleep'],
    'fitness': ['exercise'],
    'longevity': ['testing', 'supplements', 'diet'],
    'hormones': ['testing', 'supplements']
  };

  const equipmentMapping = {
    'red-light': 'light',
    'cgm': 'glucose',
    'oura': 'sleep',
    'hyperbaric': 'oxygen',
    'infrared-sauna': 'sauna',
    'cold-plunge': 'cold',
    'peptide-injections': 'peptides',
    'blood-testing': 'testing',
    'dexa': 'testing'
  };

  return matches;
}
