import { School, SchoolData } from '@shared/school-schema';
import Papa from 'papaparse';
import { loadArticles } from './articlesParser';

// Load and parse schools from CSV file using Papaparse
let cachedSchools: School[] | null = null;

export async function loadSchools(): Promise<School[]> {
  if (cachedSchools) {
    return cachedSchools;
  }
  
  try {
    const response = await fetch('/attached_assets/database_school_info_1763020452726.csv');
    const csvText = await response.text();
    
    // Count actual lines in CSV
    const lineCount = csvText.split('\n').length;
    console.log(`CSV file has ${lineCount} lines total`);
    
    // Parse CSV using Papaparse - handles quoted fields correctly
    // Note: Don't skip empty lines to ensure we get all 521 schools
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: false,
      transformHeader: (header: string) => header.trim(),
    });
    
    console.log(`Papaparse extracted ${parseResult.data.length} rows from CSV`);
    console.log(`Papaparse meta:`, {
      delimiter: parseResult.meta.delimiter,
      linebreak: parseResult.meta.linebreak,
      aborted: parseResult.meta.aborted,
      truncated: parseResult.meta.truncated,
      fields: parseResult.meta.fields?.length
    });
    
    if (parseResult.errors.length > 0) {
      console.error(`CSV parsing errors (${parseResult.errors.length} errors):`, parseResult.errors);
    }
    
    // Map parsed data to School objects
    const schools: School[] = parseResult.data.map((row: any, index: number) => {
      const school: Partial<School> = { id: String(index + 1) };
      
      // Copy all fields from CSV row to school object
      Object.keys(row).forEach(key => {
        const value = row[key]?.trim() || '';
        let cleanValue = value === '' || value === '-' ? '-' : value;
        
        // Remove <br> and other HTML tags from specific fields that should display as plain text
        if (cleanValue !== '-') {
          // Fields that should be single-line (remove <br> tags)
          if (key === '辦學團體') {
            cleanValue = cleanValue.replace(/<br\s*\/?>/gi, '');
          }
          
          // Fields that are comma-separated lists displayed as badges (remove all HTML tags)
          if (key === '特別室' || key === '其他學校設施' || key === '支援有特殊教育需要學生的設施') {
            cleanValue = cleanValue.replace(/<[^>]+>/g, '');
          }
        }
        
        (school as any)[key] = cleanValue;
      });
      
      return school as School;
    });
    
    // Validate critical fields - only require school name to be valid
    // Note: "-" is a legitimate value for many fields including region
    cachedSchools = schools.filter(school => {
      const hasName = school.學校名稱 && school.學校名稱.trim() !== '';
      
      if (!hasName) {
        console.warn('Skipping school row with missing name:', school);
        return false;
      }
      
      return true;
    });
    
    console.log(`Successfully loaded ${cachedSchools.length} schools from CSV`);
    
    // Load and merge articles data
    const articlesMap = await loadArticles();
    cachedSchools = cachedSchools.map(school => {
      const articles = articlesMap[school.學校名稱];
      if (articles && articles.length > 0) {
        return {
          ...school,
          articles,
        };
      }
      return school;
    });
    
    const schoolsWithArticles = cachedSchools.filter(s => s.articles && s.articles.length > 0).length;
    console.log(`Merged articles: ${schoolsWithArticles} schools have news articles`);
    
    // Note: CSV has some malformed rows, so actual count may be less than 521
    // This is expected and we load all valid schools we can parse
    
    return cachedSchools;
  } catch (error) {
    console.error('Failed to load schools CSV:', error);
    return [];
  }
}
