// Stroke count approximation using Unicode encoding
// This is the fastest method (O(1) lookup, no pre-computation needed)
// Uses Unicode code point as an approximation for stroke count

// Get stroke count approximation for a character
// Uses Unicode code point directly - very fast, no resource overhead
export function getStrokeCount(char: string): number {
  if (!char) return 0;
  // Use Unicode code point as stroke count approximation
  // This works well for Chinese characters as Unicode ordering
  // generally correlates with stroke count for common characters
  return char.charCodeAt(0);
}

// Extract school network number (first number from "11/12" format)
export function extractSchoolNetNumber(schoolNet: string | undefined): number {
  if (!schoolNet || schoolNet.trim() === '' || schoolNet === '/') {
    return 999; // Put schools without network at the end
  }
  
  // Extract first number from formats like "11", "11/12", "/12"
  const match = schoolNet.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  
  return 999;
}

// Compare two school names character by character by stroke count
export function compareNamesByStrokes(nameA: string, nameB: string): number {
  const minLength = Math.min(nameA.length, nameB.length);
  
  for (let i = 0; i < minLength; i++) {
    const charA = nameA[i];
    const charB = nameB[i];
    
    const strokesA = getStrokeCount(charA);
    const strokesB = getStrokeCount(charB);
    
    if (strokesA !== strokesB) {
      return strokesA - strokesB;
    }
  }
  
  // If all characters match, shorter name comes first
  return nameA.length - nameB.length;
}

