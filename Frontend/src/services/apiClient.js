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

/**
 * Initialize/reset the chat session on the backend
 * Call this when starting a new negotiation or playing again
 */
export async function initializeChat() {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to initialize chat');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Send a chat message to the AI negotiation manager
 * @param {string} prompt - The player's message
 * @returns {Promise<{text: string, metadata: {current_offer: number, status: string, hint: string}, raw: string}>}
 */
export async function sendChatMessage(prompt) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });


    if (!response.ok) {
      throw new Error('Failed to send chat message');
    }

    const data = await response.json();
    console.log(data);
    return data.response; // { text, metadata, raw }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function initializeChat() {
  try{
    const response = await fetch(`${API_BASE_URL}/chat/intialize`)

    if (response.status === 200) {
      console.log("YAAAAAAAAAAAAAAY");
    }
    
  }
  catch (error) {
      console.error('Not initialized:', error);
      throw error;
  }
}
