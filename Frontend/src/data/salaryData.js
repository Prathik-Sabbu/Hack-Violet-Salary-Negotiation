// Static salary data for MVP (researched averages)
export const SALARY_DATABASE = {
  'Software Engineer': { 
    marketRate: 95000,
    range: [75000, 130000],
    description: 'Based on national averages for mid-level positions'
  },
  'Marketing Manager': { 
    marketRate: 75000, 
    range: [60000, 95000],
    description: 'Marketing leadership role'
  },
  'Data Analyst': { 
    marketRate: 70000, 
    range: [55000, 90000],
    description: 'Data analysis and reporting'
  },
  'Product Manager': { 
    marketRate: 110000, 
    range: [90000, 145000],
    description: 'Product strategy and development'
  },
  'Sales Representative': { 
    marketRate: 65000, 
    range: [45000, 85000],
    description: 'Sales and business development'
  },
  'UX Designer': { 
    marketRate: 85000, 
    range: [65000, 110000],
    description: 'User experience design'
  },
  'HR Manager': { 
    marketRate: 72000, 
    range: [58000, 92000],
    description: 'Human resources management'
  },
  'Accountant': { 
    marketRate: 68000, 
    range: [52000, 88000],
    description: 'Financial accounting'
  },
  'Project Manager': { 
    marketRate: 88000, 
    range: [70000, 115000],
    description: 'Project planning and execution'
  },
  'Business Analyst': { 
    marketRate: 78000, 
    range: [62000, 98000],
    description: 'Business process analysis'
  }
};

// Achievement bonuses (percentage added to market rate)
export const ACHIEVEMENT_BONUSES = {
  'Exceeded performance targets': 0.05,
  'Taken on additional responsibilities': 0.04,
  'Gained new certifications/skills': 0.03,
  'Led successful projects': 0.05,
  'Mentored team members': 0.03
};

// Experience level multipliers
export const EXPERIENCE_LEVELS = {
  'Junior (0-2 years)': 0.7,
  'Mid-Level (3-5 years)': 1.0,
  'Senior (6-10 years)': 1.3,
  'Lead/Principal (10+ years)': 1.6
};

// US States/Regions for location dropdown
export const LOCATIONS = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];