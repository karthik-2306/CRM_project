function fetchAndDisplayDeals() {
  fetch('/api/deals')
    .then((response) => response.json())
    .then((deals) => {
      console.log('Fetched deals:', deals); // Log fetched deals to the console

      const dealsTableBody = document.getElementById('deals-table-body');
      dealsTableBody.innerHTML = '';

      const dealsTable = document.getElementById('deals-table');
      dealsTable.style.display = deals.length > 0 ? 'block' : 'none';

      deals.forEach((deal) => {
        console.log('Deal object:', deal);
        if (deal.id !== undefined) {
          const dealDetails = `
            <tr>
              <td>${deal.dealOwner}</td>
              <td>${deal.dealName}</td>
              <td>${deal.dealAccountName}</td>
            
              <td>${deal.dealAmount}</td>
             
              
              <td>
                <button onclick="editDeal(${deal.id})">Edit</button>
                <button onclick="deleteDeal(${deal.id})">Delete</button>
              </td>
            </tr>
          `;
          dealsTableBody.innerHTML += dealDetails;
        } else {
          console.error('Deal ID is undefined:', deal);
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching deals:', error);
    });
}
document.addEventListener('DOMContentLoaded', fetchAndDisplayDeals);

// Function to show the deal form
function showDealForm() {
  const dealForm = document.getElementById('dealForm');
  const dealsTable = document.getElementById('deals-table');
  dealForm.style.display = 'block';
  dealsTable.style.display = 'none';
}

// Function to reset the deal form
function resetDealForm() {
  // Reset all deal form fields
  document.getElementById('dealOwner').value = '';
  document.getElementById('dealName').value = '';
  document.getElementById('dealAccountName').value = '';
  document.getElementById('dealType').value = '';
  document.getElementById('dealNextStep').value = '';
  document.getElementById('dealLeadSource').value = '';
  document.getElementById('dealContactName').value = '';
  document.getElementById('dealAmount').value = '';
  document.getElementById('dealClosingDate').value = '';
  document.getElementById('dealStage').value = '';
  document.getElementById('dealProbability').value = '';
  document.getElementById('dealExpectedRevenue').value = '';
  document.getElementById('dealCampaignSource').value = '';

  // Remove the data-deal-id attribute to indicate a new deal
  document.getElementById('dealForm').removeAttribute('data-deal-id');
}

// Function to create a new deal
async function createDeal() {
  try {
    // Get deal data from the form
    const dealData = {
      dealOwner: document.getElementById('dealOwner').value,
      dealName: document.getElementById('dealName').value,
      dealAccountName: document.getElementById('dealAccountName').value,
      dealType: document.getElementById('dealType').value,
      dealNextStep: document.getElementById('dealNextStep').value,
      dealLeadSource: document.getElementById('dealLeadSource').value,
      dealContactName: document.getElementById('dealContactName').value,
      dealAmount: document.getElementById('dealAmount').value,
      dealClosingDate: document.getElementById('dealClosingDate').value,
      dealStage: document.getElementById('dealStage').value,
      dealProbability: document.getElementById('dealProbability').value,
      dealExpectedRevenue: document.getElementById('dealExpectedRevenue').value,
      dealCampaignSource: document.getElementById('dealCampaignSource').value,
    };

    const response = await fetch('/api/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dealData),
    });

    if (!response.ok) {
      throw new Error(`Error creating deal. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Deal created successfully');

    // Fetch and display updated deals after creation
    fetchAndDisplayDeals();

    // Reset the form after successful deal creation
    resetDealForm();

    const dealsTable = document.getElementById('deals-table');
    const dealForm = document.getElementById('dealForm');

    dealsTable.style.display = 'block';
    dealForm.style.display = 'none';
    history.pushState({ sectionId: 'deals-content' }, '', '#deals-content');
    toggleDealButtonsVisibility(true);
  } catch (error) {
    console.error('Error creating deal:', error);
    // Handle the error, update the UI, or show an error message
  }
}

// Function to fetch deals
function fetchDeals() {
  fetchAndDisplayDeals();
}

// Function to populate the deal form with data for editing
function populateDealForm(dealData) {
  // Populate your form fields with dealData
  document.getElementById('dealOwner').value = dealData.dealOwner;
  document.getElementById('dealName').value = dealData.dealName;
  document.getElementById('dealAccountName').value = dealData.dealAccountName;
  document.getElementById('dealType').value = dealData.dealType;
  document.getElementById('dealNextStep').value = dealData.dealNextStep;
  document.getElementById('dealLeadSource').value = dealData.dealLeadSource;
  document.getElementById('dealContactName').value = dealData.dealContactName;
  document.getElementById('dealAmount').value = dealData.dealAmount;
// Extract the date part from the ISO 8601 formatted date
const isoDate = new Date(dealData.dealClosingDate);
const formattedDate = isoDate.toISOString().split('T')[0];

// Set the formatted date as the value of the dealClosingDate input field
document.getElementById('dealClosingDate').value = formattedDate;

  document.getElementById('dealStage').value = dealData.dealStage;
  document.getElementById('dealProbability').value = dealData.dealProbability;
  document.getElementById('dealExpectedRevenue').value =
    dealData.dealExpectedRevenue;
  document.getElementById('dealCampaignSource').value =
    dealData.dealCampaignSource;

  // Set a data-deal-id attribute to the dealForm for reference during submission
  document.getElementById('dealForm').setAttribute('data-deal-id', dealData.id);
}

// Function to edit a deal
window.editDeal = async function (dealId) {
  alert('Editing deal with ID: ' + dealId);
  console.log('Received dealId:', dealId);

  // Ensure that dealId is defined before making the GET request
  if (dealId === undefined || dealId === 'undefined') {
    console.error('Invalid or undefined dealId:', dealId);
    return;
  }

  try {
    // Convert dealId to a number using the unary plus operator
    const numericDealId = +dealId;
    console.log('Numeric dealId:', numericDealId);

    // Check if numericDealId is a valid number
    if (isNaN(numericDealId) || numericDealId <= 0) {
      console.error('Invalid dealId:', dealId);
      return;
    }

    console.log('Fetching deal details for ID:', numericDealId);

    const response = await fetch(`/api/deals/${numericDealId}`);

    if (!response.ok) {
      throw new Error(
        `Error fetching deal details. Status: ${response.status}`
      );
    }

    const dealData = await response.json();

    console.log('Deal details:', dealData);

    // Call the populateDealForm function to fill the form with deal details
    populateDealForm(dealData);

    const dealForm = document.getElementById('dealForm');
    const dealsTable = document.getElementById('deals-table');
    dealForm.style.display = 'block';
    dealsTable.style.display = 'none';

    // Update the URL to reflect the "Edit Deal" state
    history.pushState(
      { sectionId: 'dealForm', dealId: numericDealId },
      '',
      `#dealForm/${numericDealId}`
    );
  } catch (error) {
    console.error('Error fetching deal details:', error);
  }
};
// Event listener for the popstate event
window.addEventListener('popstate', function (event) {
  // Check if the state object indicates the "dealForm" section
  if (event.state && event.state.sectionId === 'dealForm') {
    // Show the "Deal Form" section
    const dealsTable = document.getElementById('deals-table');
    const dealForm = document.getElementById('dealForm');
    dealsTable.style.display = 'none';
    dealForm.style.display = 'block';
  } else {
    // Show the "Deals" section
    const dealsTable = document.getElementById('deals-table');
    const dealForm = document.getElementById('dealForm');
    dealsTable.style.display = 'block';
    dealForm.style.display = 'none';
  }
});

// Event listener for the submit button in the deal form
const dealForm = document.getElementById('dealForm');
dealForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const dealId = dealForm.getAttribute('data-deal-id');

  if (dealId) {
    updateDeal(dealId);
  } else {
    createDeal();
  }
});

// Function to update an existing deal
async function updateDeal(dealId) {
  try {
    // Ensure that dealId is defined before making the PUT request
    if (dealId === undefined || dealId === 'undefined') {
      console.error('Invalid or undefined dealId:', dealId);
      return;
    }

    // Get the deal data from the form
    const updatedDealData = {
      dealOwner: document.getElementById('dealOwner').value,
      dealName: document.getElementById('dealName').value,
      dealAccountName: document.getElementById('dealAccountName').value,
      dealType: document.getElementById('dealType').value,
      dealNextStep: document.getElementById('dealNextStep').value,
      dealLeadSource: document.getElementById('dealLeadSource').value,
      dealContactName: document.getElementById('dealContactName').value,
      dealAmount: document.getElementById('dealAmount').value,
      dealClosingDate: document.getElementById('dealClosingDate').value,
      dealStage: document.getElementById('dealStage').value,
      dealProbability: document.getElementById('dealProbability').value,
      dealExpectedRevenue: document.getElementById('dealExpectedRevenue').value,
      dealCampaignSource: document.getElementById('dealCampaignSource').value,
    };

    const response = await fetch(`/api/deals/${dealId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDealData),
    });

    if (!response.ok) {
      throw new Error(`Error updating deal. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Deal updated successfully');

    // Fetch and display updated deals after updating
    fetchAndDisplayDeals();
    resetDealForm();

    const dealsTable = document.getElementById('deals-table');
    const dealForm = document.getElementById('dealForm');

    dealsTable.style.display = 'block';
    dealForm.style.display = 'none'; // Hide the deals form
  } catch (error) {
    console.error('Error updating deal:', error);
    // Handle the error, update the UI, or show an error message
  }
}

// Function to delete a deal
window.deleteDeal = async function (dealId) {
  try {
    // Ensure that dealId is defined before making the DELETE request
    if (dealId === undefined || dealId === 'undefined') {
      console.error('Invalid or undefined dealId:', dealId);
      return;
    }

    const response = await fetch(`/api/deals/${dealId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting deal. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Deal deleted successfully');

    // Fetch and display updated deals after deletion
    fetchDeals();
  } catch (error) {
    console.error('Error deleting deal:', error);
    // Handle the error, update the UI, or show an error message
  }
};
