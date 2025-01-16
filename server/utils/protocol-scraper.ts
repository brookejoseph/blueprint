import fetch from "node-fetch";
import * as cheerio from "cheerio";

interface ProtocolSection {
  id: string;
  title: string;
  content: string;
  categories: string[];
  url: string;
  textFragment?: string;
}

const PROTOCOL_URL = "https://protocol.bryanjohnson.com";

export async function scrapeProtocolSections(): Promise<ProtocolSection[]> {
  try {
    const response = await fetch(PROTOCOL_URL);
    const html = await response.text();
    const $ = cheerio.load(html);
    const sections: ProtocolSection[] = [];

    // Scrape main protocol sections with more detailed content
    $('.section-container').each((_, element) => {
      const $section = $(element);
      const id = $section.attr('id') || '';
      const title = $section.find('h2, h3').first().text().trim();

      // Extract full content including nested elements and find key sentences
      const paragraphs = $section.find('p, li').map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0);

      const content = paragraphs.join('\n');

      // Find the most important paragraph (usually the first non-empty one after title)
      const keyParagraph = paragraphs.find(p => 
        p.length > 50 && !p.toLowerCase().includes('disclaimer') && 
        !p.toLowerCase().includes('note:')
      ) || paragraphs[0];

      if (id && title && content) {
        // Generate text fragment with context for better highlighting
        let textFragment = '';
        if (keyParagraph) {
          // Clean and prepare the text for the fragment
          const cleanText = keyParagraph.replace(/[^\w\s-]/g, ' ').trim();
          const words = cleanText.split(/\s+/);

          // Take a meaningful chunk of text (around 10-15 words)
          const targetText = words.slice(0, 12).join(' ');

          // Find some context words before and after if available
          const prefix = words.slice(Math.max(0, words.indexOf(words[0]) - 3), words.indexOf(words[0])).join(' ');
          const suffix = words.slice(12, 15).join(' ');

          // Construct the text fragment URL component
          textFragment = prefix ? 
            `:~:text=${encodeURIComponent(prefix)}-,${encodeURIComponent(targetText)},${encodeURIComponent(suffix)}` :
            `:~:text=${encodeURIComponent(targetText)},${encodeURIComponent(suffix)}`;
        }

        sections.push({
          id,
          title,
          content,
          categories: categorizeSectionContent(content, title),
          url: `${PROTOCOL_URL}#${id}${textFragment}`,
          textFragment
        });
      }
    });

    // Sort sections by content relevance and length
    return sections.sort((a, b) => b.content.length - a.content.length);
  } catch (error) {
    console.error('Error scraping protocol:', error);
    throw new Error('Failed to scrape protocol sections');
  }
}

function categorizeSectionContent(content: string, title: string): string[] {
  const categories = new Set<string>();
  const text = `${title} ${content}`.toLowerCase();

  // Enhanced category keywords with more specific terms
  const categoryKeywords = {
    supplements: [
      'supplement', 'vitamin', 'mineral', 'omega', 'nutrient',
      'capsule', 'dose', 'intake', 'bioavailable'
    ],
    exercise: [
      'exercise', 'workout', 'fitness', 'training', 'cardio', 'strength',
      'resistance', 'mobility', 'flexibility', 'endurance'
    ],
    diet: [
      'diet', 'nutrition', 'food', 'meal', 'eating',
      'macronutrient', 'protein', 'carbohydrate', 'fat', 'calorie'
    ],
    sleep: [
      'sleep', 'circadian', 'rest', 'bed', 'melatonin',
      'rem', 'deep sleep', 'sleep latency', 'sleep quality'
    ],
    testing: [
      'test', 'measure', 'track', 'monitor', 'biomarker',
      'blood test', 'panel', 'metric', 'data', 'analysis'
    ],
    longevity: [
      'longevity', 'lifespan', 'aging', 'age', 'senescence',
      'cellular health', 'mitochondria', 'telomere'
    ],
    brain: [
      'brain', 'cognitive', 'mental', 'focus', 'memory',
      'neuroplasticity', 'concentration', 'clarity'
    ],
    hormones: [
      'hormone', 'testosterone', 'thyroid', 'insulin',
      'cortisol', 'growth hormone', 'endocrine'
    ]
  };

  // Score-based categorization
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    const matchCount = keywords.reduce((count, keyword) => {
      const matches = (text.match(new RegExp(keyword, 'gi')) || []).length;
      return count + matches;
    }, 0);

    if (matchCount >= 2) { // Require at least 2 keyword matches for more accurate categorization
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

  // Enhanced category mappings with more specific sections
  const categoryMapping = {
    'biological-age': ['testing', 'supplements', 'longevity'],
    'brain': ['brain', 'supplements', 'sleep'],
    'sleep': ['sleep', 'supplements', 'testing'],
    'fitness': ['exercise', 'supplements', 'testing'],
    'longevity': ['longevity', 'supplements', 'diet', 'testing'],
    'hormones': ['hormones', 'testing', 'supplements']
  };

  const equipmentMapping = {
    'red-light': ['light-therapy', 'longevity'],
    'cgm': ['glucose', 'testing', 'diet'],
    'oura': ['sleep', 'tracking', 'testing'],
    'hyperbaric': ['oxygen-therapy', 'brain'],
    'infrared-sauna': ['sauna', 'heat-therapy', 'recovery'],
    'cold-plunge': ['cold-therapy', 'recovery'],
    'peptide-injections': ['peptides', 'hormones'],
    'blood-testing': ['testing', 'biomarkers', 'hormones'],
    'dexa': ['body-composition', 'testing', 'fitness']
  };

  const currentHealthMapping = {
    'supplements': ['supplements', 'testing'],
    'tracking-sleep': ['sleep', 'testing'],
    'tracking-glucose': ['glucose', 'diet', 'testing'],
    'regular-exercise': ['exercise', 'fitness'],
    'strict-diet': ['diet', 'testing'],
    'blood-tests': ['testing', 'biomarkers']
  };

  // Process improvement areas with priority
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