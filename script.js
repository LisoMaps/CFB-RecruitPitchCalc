const grid = document.getElementById('grid');
const factorsList = document.getElementById('factorsList');
const selectedCount = document.getElementById('selectedCount');
const clearButton = document.getElementById('clearButton');

const imageUrls = {
  'College Experience': 'images/1-college-experience.jpg',
  'Team Player': 'images/2-team-player.jpg',
  'Campus Personality': 'images/3-campus-personality.jpg',
  'Gamer': 'images/4-gamer.jpg',
  'Standard Bearer': 'images/5-standard-bearer.jpg',
  'Student Of The Game': 'images/6-student-of-the-game.jpg',
  'Hometown Hero': 'images/7-hometown-hero.jpg',
  'Status Seeker': 'images/8-status-seeker.jpg',
  'The Clutch': 'images/9-the-clutch.jpg',
  'Primetime Player': 'images/10-primetime-player.jpg',
  'Coach Connection': 'images/11-coach-connection.jpg',
  'Aspirational Goals': 'images/12-aspirational-goals.jpg',
  'House Call': 'images/13-to-the-house.jpg',
  'Football Influencer': 'images/14-football-influencer.jpg',
  'Clocked In': 'images/15-clocked-in.jpg',
  'Star Search': 'images/16-star-search.jpg',
  'Grassroots Traditionalist': 'images/17-grassroots-traditionalist.jpg',
  'Conference Legend': 'images/18-conference-legend.jpg',
  'Sunday Player': 'images/19-sunday-player.jpg',
  'Gym Rat': 'images/20-gym-rat.jpg'
};

const selectionLogic = {
  'College Experience': ['Academic Prestige', 'Campus Lifestyle', 'Stadium Atmosphere'],
  'Team Player': ['Coach Stability', 'Playing Style', 'Proximity To Home'],
  'Campus Personality': ['Campus Lifestyle', 'Playing Style', 'Playing Time'],
  'Gamer': ['Conference Prestige', 'Playing Style', 'Pro Potential'],
  'Standard Bearer': ['Coach Prestige', 'Conference Prestige', 'Playing Style'],
  'Student Of The Game': ['Academic Prestige', 'Coach Prestige', 'Proximity To Home'],
  'Hometown Hero': ['Championship Contender', 'Program Tradition', 'Proximity To Home'],
  'Status Seeker': ['Brand Exposure', 'Coach Prestige', 'Conference Prestige'],
  'The Clutch': ['Coach Stability', 'Playing Style', 'Playing Time'],
  'Primetime Player': ['Brand Exposure', 'Championship Contender', 'Playing Time'],
  'Coach Connection': ['Athletic Facilities', 'Coach Prestige', 'Proximity To Home'],
  'Aspirational Goals': ['Championship Contender', 'Coach Prestige', 'Conference Prestige'],
  'House Call': ['Brand Exposure', 'Championship Contender', 'Coach Prestige'],
  'Football Influencer': ['Brand Exposure', 'Playing Time', 'Pro Potential'],
  'Clocked In': ['Playing Style', 'Playing Time', 'Pro Potential'],
  'Star Search': ['Brand Exposure', 'Playing Time', 'Proximity To Home'],
  'Grassroots Traditionalist': ['Program Tradition', 'Proximity To Home', 'Stadium Atmosphere'],
  'Conference Legend': ['Championship Contender', 'Conference Prestige', 'Proximity To Home'],
  'Sunday Player': ['Championship Contender', 'Conference Prestige', 'Pro Potential'],
  'Gym Rat': ['Athletic Facilities', 'Brand Exposure', 'Pro Potential']
};

// Get all unique factors
const allFactors = [...new Set(Object.values(selectionLogic).flat())].sort();
let factorStates = {}; // 'positive', 'negative', or null
let selectedPersona = null; // Track selected persona

// Build the grid
Object.entries(imageUrls).forEach(([label, imageUrl]) => {
  const container = document.createElement('div');
  container.className = 'grid-item';
  container.dataset.persona = label;

  const imageDiv = document.createElement('div');
  imageDiv.className = 'grid-image';
  // Use the actual image URL from the imageUrls object
  imageDiv.style.backgroundImage = `url(${imageUrl})`;

  const labelDiv = document.createElement('div');
  labelDiv.className = 'grid-label';
  labelDiv.textContent = label;

  container.appendChild(imageDiv);
  container.appendChild(labelDiv);

  // Add click handler for persona selection
  container.addEventListener('click', () => selectPersona(label));

  grid.appendChild(container);
});

// Handle persona selection
function selectPersona(persona) {
  const gridItems = document.querySelectorAll('.grid-item');
  
  // If clicking the same persona, deselect it
  if (selectedPersona === persona) {
    selectedPersona = null;
    gridItems.forEach(item => item.classList.remove('selected'));
    
    // Clear the factors that were auto-selected for this persona
    const personaFactors = selectionLogic[persona];
    personaFactors.forEach(factor => {
      factorStates[factor] = null;
    });
    
    // Show factors based on current filter state
    updateFactorsListForPersona(null);
  } else {
    // Select the new persona
    selectedPersona = persona;
    gridItems.forEach(item => {
      if (item.dataset.persona === persona) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
    
    // Auto-select the factors for this persona
    const personaFactors = selectionLogic[persona];
    personaFactors.forEach(factor => {
      factorStates[factor] = 'positive';
    });
    
    // Show only factors for this persona
    updateFactorsListForPersona(persona);
  }
  
  updateFactorDisplay();
  updateSelectedCount();
}

// Update factors list based on selected persona
function updateFactorsListForPersona(persona) {
  if (!persona) {
    // No persona selected - show factors based on current filter logic
    const positiveFactors = Object.keys(factorStates).filter(factor => factorStates[factor] === 'positive');
    const negativeFactors = Object.keys(factorStates).filter(factor => factorStates[factor] === 'negative');
    
    if (positiveFactors.length === 0 && negativeFactors.length === 0) {
      // Show all factors
      allFactors.forEach(factor => {
        const factorItem = document.querySelector(`[data-factor="${factor}"]`);
        factorItem.style.display = 'flex';
      });
    } else {
      // Use existing filter logic
      updateDisplay();
    }
    return;
  }
  
  // Show only factors for the selected persona
  const personaFactors = new Set(selectionLogic[persona]);
  
  // Always show factors that are already selected
  Object.keys(factorStates).forEach(factor => {
    if (factorStates[factor] !== null) {
      personaFactors.add(factor);
    }
  });
  
  allFactors.forEach(factor => {
    const factorItem = document.querySelector(`[data-factor="${factor}"]`);
    
    if (personaFactors.has(factor)) {
      factorItem.style.display = 'flex';
    } else {
      factorItem.style.display = 'none';
    }
  });
}

// Build the factors list
allFactors.forEach(factor => {
  const factorItem = document.createElement('div');
  factorItem.className = 'factor-item';

  const iconsDiv = document.createElement('div');
  iconsDiv.className = 'factor-icons';

  // Create check icon
  const checkIcon = document.createElement('div');
  checkIcon.className = 'factor-icon check';
  checkIcon.textContent = '✓';
  checkIcon.addEventListener('click', () => selectFactor(factor, 'positive'));

  // Create neutral icon
  const neutralIcon = document.createElement('div');
  neutralIcon.className = 'factor-icon neutral';
  neutralIcon.textContent = '?';
  neutralIcon.addEventListener('click', () => selectFactor(factor, null));

  // Create cross icon
  const crossIcon = document.createElement('div');
  crossIcon.className = 'factor-icon cross';
  crossIcon.textContent = '✕';
  crossIcon.addEventListener('click', () => selectFactor(factor, 'negative'));

  iconsDiv.appendChild(checkIcon);
  iconsDiv.appendChild(neutralIcon);
  iconsDiv.appendChild(crossIcon);

  const labelDiv = document.createElement('div');
  labelDiv.className = 'factor-label';
  labelDiv.textContent = factor;

  factorItem.appendChild(iconsDiv);
  factorItem.appendChild(labelDiv);
  factorItem.dataset.factor = factor;

  factorsList.appendChild(factorItem);
});

// Handle factor selection
function selectFactor(factor, state) {
  if (factorStates[factor] === state) {
    // If clicking the same state, deselect
    factorStates[factor] = null;
  } else {
    factorStates[factor] = state;
  }
  
  updateFactorDisplay();
  updateDisplay();
}

function updateFactorDisplay() {
  allFactors.forEach(factor => {
    const factorItem = document.querySelector(`[data-factor="${factor}"]`);
    const icons = factorItem.querySelectorAll('.factor-icon');
    
    icons.forEach(icon => icon.classList.remove('selected'));
    
    const state = factorStates[factor];
    if (state === 'positive') {
      icons[0].classList.add('selected'); // check
    } else if (state === 'negative') {
      icons[2].classList.add('selected'); // cross
    }
  });
}

// Update display based on selected factors
function updateDisplay() {
  updateSelectedCount();
  updateGridVisibility();
  updateClearButton();
}

function updateSelectedCount() {
  const positiveCount = Object.values(factorStates).filter(state => state === 'positive').length;
  const negativeCount = Object.values(factorStates).filter(state => state === 'negative').length;
  const totalCount = positiveCount + negativeCount;
  
  if (selectedPersona) {
    selectedCount.textContent = `Showing motivations for: ${selectedPersona}`;
  } else if (totalCount === 0) {
    selectedCount.textContent = 'Select motivations to reveal the ideal pitch';
  } else {
    selectedCount.textContent = `${positiveCount} positive, ${negativeCount} negative motivations selected`;
  }
}

function updateGridVisibility() {
  // If a persona is selected, don't apply filtering logic to the grid
  if (selectedPersona) {
    return;
  }
  
  const gridItems = document.querySelectorAll('.grid-item');
  
  const positiveFactors = Object.keys(factorStates).filter(factor => factorStates[factor] === 'positive');
  const negativeFactors = Object.keys(factorStates).filter(factor => factorStates[factor] === 'negative');
  
  if (positiveFactors.length === 0 && negativeFactors.length === 0) {
    // Show all personas normally
    gridItems.forEach(item => {
      item.classList.remove('dimmed', 'highlighted');
    });
    // Update factors list visibility with all personas (no filtering)
    updateFactorsListVisibility(new Set(Object.keys(selectionLogic)));
    return;
  }

  // Find personas that match criteria
  const matchingPersonas = new Set();
  
  Object.entries(selectionLogic).forEach(([persona, factors]) => {
    let matches = true;
    
    // Must have ALL positive factors
    if (positiveFactors.length > 0) {
      const hasAllPositive = positiveFactors.every(posFactor => 
        factors.includes(posFactor)
      );
      if (!hasAllPositive) matches = false;
    }
    
    // Must NOT have ANY negative factors
    if (negativeFactors.length > 0) {
      const hasAnyNegative = negativeFactors.some(negFactor => 
        factors.includes(negFactor)
      );
      if (hasAnyNegative) matches = false;
    }
    
    if (matches) {
      matchingPersonas.add(persona);
    }
  });

  // Update grid visibility
  gridItems.forEach(item => {
    const persona = item.dataset.persona;
    item.classList.remove('dimmed', 'highlighted');
    
    if (matchingPersonas.has(persona)) {
      item.classList.add('highlighted');
    } else {
      item.classList.add('dimmed');
    }
  });

  // Update factors list visibility
  updateFactorsListVisibility(matchingPersonas);
}

function updateClearButton() {
  const hasSelections = Object.values(factorStates).some(state => state !== null);
  clearButton.disabled = !hasSelections;
}

// Clear button functionality
clearButton.addEventListener('click', () => {
  factorStates = {};
  selectedPersona = null;
  
  // Remove all selections from grid
  const gridItems = document.querySelectorAll('.grid-item');
  gridItems.forEach(item => item.classList.remove('selected'));
  
  updateFactorDisplay();
  updateDisplay();
});

// Initialize display
updateDisplay();

// Update factors list visibility based on matching personas
function updateFactorsListVisibility(matchingPersonas) {
  // If a persona is selected, use the persona-specific logic instead
  if (selectedPersona) {
    updateFactorsListForPersona(selectedPersona);
    return;
  }
  
  const positiveFactors = Object.keys(factorStates).filter(factor => factorStates[factor] === 'positive');
  const negativeFactors = Object.keys(factorStates).filter(factor => factorStates[factor] === 'negative');
  
  if (positiveFactors.length === 0 && negativeFactors.length === 0) {
    // Show all factors normally
    allFactors.forEach(factor => {
      const factorItem = document.querySelector(`[data-factor="${factor}"]`);
      factorItem.style.display = 'flex';
      factorItem.classList.remove('dimmed-factor');
    });
    return;
  }

  // Get all factors that are used by the matching personas
  const relevantFactors = new Set();
  
  matchingPersonas.forEach(persona => {
    const factors = selectionLogic[persona];
    factors.forEach(factor => {
      // Only show factors that aren't already selected with a state
      if (!factorStates[factor] || factorStates[factor] === null) {
        relevantFactors.add(factor);
      }
    });
  });

  // Always show factors that are already selected
  Object.keys(factorStates).forEach(factor => {
    if (factorStates[factor] !== null) {
      relevantFactors.add(factor);
    }
  });

  // Update factor visibility
  allFactors.forEach(factor => {
    const factorItem = document.querySelector(`[data-factor="${factor}"]`);
    
    if (relevantFactors.has(factor)) {
      factorItem.style.display = 'flex';
      factorItem.classList.remove('dimmed-factor');
    } else {
      factorItem.style.display = 'none';
    }
  });
}