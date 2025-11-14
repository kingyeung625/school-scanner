import Papa from 'papaparse';
import type { Article } from '@shared/school-schema';

export interface ArticlesMap {
  [schoolName: string]: Article[];
}

let cachedArticles: ArticlesMap | null = null;

export async function loadArticles(): Promise<ArticlesMap> {
  if (cachedArticles) {
    return cachedArticles;
  }

  try {
    const response = await fetch('/attached_assets/database - 相關文章_1763109112535.csv');
    const csvText = await response.text();
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header: string) => header.trim(),
    });
    
    const articlesMap: ArticlesMap = {};
    
    parseResult.data.forEach((row: any) => {
      const schoolName = row['學校名稱']?.trim();
      const title = row['文章標題']?.trim();
      const url = row['文章連結']?.trim();
      
      // Skip if school name is missing or article data is empty
      if (!schoolName || !title || !url) {
        return;
      }
      
      // Initialize array for this school if needed
      if (!articlesMap[schoolName]) {
        articlesMap[schoolName] = [];
      }
      
      // Add article to school's array
      articlesMap[schoolName].push({
        title,
        url,
      });
    });
    
    console.log(`Loaded articles for ${Object.keys(articlesMap).length} schools`);
    
    // Fetch OG metadata for all articles (in parallel for performance)
    const allArticles = Object.values(articlesMap).flat();
    console.log(`Fetching OG metadata for ${allArticles.length} articles...`);
    
    await Promise.all(
      allArticles.map(async (article) => {
        try {
          const ogData = await fetchOGMetadata(article.url);
          article.ogImage = ogData.ogImage;
          article.ogDescription = ogData.ogDescription;
        } catch (error) {
          console.warn(`Failed to fetch OG for ${article.url}:`, error);
        }
      })
    );
    
    console.log(`Completed fetching OG metadata for articles`);
    
    cachedArticles = articlesMap;
    return cachedArticles;
  } catch (error) {
    console.error('Failed to load articles CSV:', error);
    return {};
  }
}

// Fetch Open Graph metadata from a URL
export async function fetchOGMetadata(url: string): Promise<{ ogImage?: string; ogDescription?: string }> {
  try {
    const response = await fetch(`/api/og-metadata?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      console.warn(`Failed to fetch OG metadata for ${url}`);
      return {};
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching OG metadata for ${url}:`, error);
    return {};
  }
}
