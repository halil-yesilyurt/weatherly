export const popularCities = [
  // Major world cities
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore',
  'Hong Kong', 'Los Angeles', 'Chicago', 'Toronto', 'Berlin', 'Madrid',
  'Rome', 'Amsterdam', 'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki',
  'Vienna', 'Prague', 'Budapest', 'Warsaw', 'Zurich', 'Geneva',
  
  // US Cities
  'Miami', 'Las Vegas', 'San Francisco', 'Seattle', 'Boston', 'Philadelphia',
  'Atlanta', 'Dallas', 'Houston', 'Phoenix', 'Denver', 'San Diego',
  'Nashville', 'Austin', 'Portland', 'Minneapolis', 'Detroit', 'Pittsburgh',
  
  // European Cities
  'Barcelona', 'Munich', 'Milan', 'Naples', 'Florence', 'Venice',
  'Lyon', 'Marseille', 'Nice', 'Brussels', 'Antwerp', 'Luxembourg',
  'Dublin', 'Edinburgh', 'Manchester', 'Birmingham', 'Liverpool',
  
  // Asian Cities
  'Mumbai', 'Delhi', 'Bangalore', 'Bangkok', 'Manila', 'Jakarta',
  'Kuala Lumpur', 'Seoul', 'Busan', 'Osaka', 'Kyoto', 'Shanghai',
  'Beijing', 'Guangzhou', 'Shenzhen', 'Taipei', 'Kaohsiung',
  
  // Middle East & Africa
  'Istanbul', 'Tel Aviv', 'Cairo', 'Casablanca', 'Cape Town', 'Johannesburg',
  'Nairobi', 'Lagos', 'Riyadh', 'Doha', 'Kuwait City', 'Abu Dhabi',
  
  // South America
  'São Paulo', 'Rio de Janeiro', 'Buenos Aires', 'Santiago', 'Lima',
  'Bogotá', 'Caracas', 'Montevideo', 'Quito', 'La Paz',
  
  // Australia & Oceania
  'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Auckland', 'Wellington',
  'Christchurch', 'Fiji', 'Suva'
];

// Function to search cities with fuzzy matching
export function searchCities(query: string, limit: number = 5): string[] {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Exact matches first
  const exactMatches = popularCities.filter(city => 
    city.toLowerCase().startsWith(normalizedQuery)
  );
  
  // Partial matches
  const partialMatches = popularCities.filter(city => 
    city.toLowerCase().includes(normalizedQuery) && 
    !city.toLowerCase().startsWith(normalizedQuery)
  );
  
  return [...exactMatches, ...partialMatches].slice(0, limit);
} 