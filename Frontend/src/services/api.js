const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Fetch salary data for a job title
 */
export async function getSalaryData(jobTitle) {
  try {
    const response = await fetch(`${API_BASE_URL}/salary?job=${encodeURIComponent(jobTitle)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch salary data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Calculate target salary based on market rate and achievements
 */
export async function calculateTargetSalary(marketRate, achievements, currentSalary) {
  try {
    const response = await fetch(`${API_BASE_URL}/salary/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ marketRate, achievements, currentSalary }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to calculate target salary');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}