import { School } from '@shared/school-schema';

// Parse a CSV line handling quoted values with commas
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

export function parseSchoolsFromCSVText(csvText: string): School[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }
  
  const headers = parseCSVLine(lines[0]);
  const schools: School[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length === 0) continue;
    
    const school: Partial<School> = { id: String(i) };
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || '';
      const cleanValue = value === '' || value === '-' ? '-' : value;
      
      // Map header to school property
      const key = header.trim() as keyof School;
      if (key) {
        (school as any)[key] = cleanValue;
      }
    });
    
    schools.push(school as School);
  }
  
  return schools;
}

// Load and parse schools from CSV file
let cachedSchools: School[] | null = null;

export async function loadSchools(): Promise<School[]> {
  if (cachedSchools) {
    return cachedSchools;
  }
  
  try {
    const response = await fetch('/attached_assets/database_school_info_1763020452726.csv');
    const csvText = await response.text();
    cachedSchools = parseSchoolsFromCSVText(csvText);
    return cachedSchools;
  } catch (error) {
    console.error('Failed to load schools CSV:', error);
    return [];
  }
}
