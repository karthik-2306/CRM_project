function fetchAndDisplayCampaigns() {
  fetch('/api/campaigns')
    .then((response) => response.json())
    .then((campaigns) => {
      const campaignsTableBody = document.getElementById(
        'campaigns-table-body'
      );
      campaignsTableBody.innerHTML = '';

      const campaignsTable = document.getElementById('campaigns-table');
      campaignsTable.style.display = campaigns.length > 0 ? 'block' : 'none';

      campaigns.forEach((campaign) => {
        console.log('Campaign object:', campaign);
        if (campaign.id !== undefined) {
          const campaignDetails = `
            <tr>
              <td>${campaign.campaignOwner}</td>
              <td>${campaign.campaignName}</td>
            
              <td>${campaign.startDate}</td>
              <td>${campaign.endDate}</td>
             
              <td>
                <button onclick="editCampaign(${campaign.id})">Edit</button>
                <button onclick="deleteCampaign(${campaign.id})">Delete</button>
              </td>
            </tr>
          `;
          campaignsTableBody.innerHTML += campaignDetails;
        } else {
          console.error('Campaign ID is undefined:', campaign);
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching campaigns:', error);
    });
}

function resetCampaignForm() {
  document.getElementById('campaignOwner').value = '';
  document.getElementById('campaignName').value = '';
  document.getElementById('campaignType').value = '';
  document.getElementById('campaignStatus').value = '';
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  document.getElementById('expectedRevenue').value = '';
  document.getElementById('budgetedCost').value = '';
  document.getElementById('actualCost').value = '';
  document.getElementById('expectedResponse').value = '';
  document.getElementById('numbersSent').value = '';

  // Remove the data-campaign-id attribute to indicate a new campaign
  document.getElementById('campaignForm').removeAttribute('data-campaign-id');
}

async function createCampaign() {
  try {
    const campaignData = {
      campaignOwner: document.getElementById('campaignOwner').value,
      campaignName: document.getElementById('campaignName').value,
      campaignType: document.getElementById('campaignType').value,
      campaignStatus: document.getElementById('campaignStatus').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      expectedRevenue: document.getElementById('expectedRevenue').value,
      budgetedCost: document.getElementById('budgetedCost').value,
      actualCost: document.getElementById('actualCost').value,
      expectedResponse: document.getElementById('expectedResponse').value,
      numbersSent: document.getElementById('numbersSent').value,
    };

    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) {
      throw new Error(`Error creating campaign. Status: ${response.status}`);
    }

    console.log('Campaign created successfully');

    fetchAndDisplayCampaigns();
    resetCampaignForm();

    const campaignsTable = document.getElementById('campaigns-table');
    const campaignForm = document.getElementById('campaignForm');

    campaignsTable.style.display = 'block';
    campaignForm.style.display = 'none';
    history.pushState(
      { sectionId: 'campaigns-content' },
      '',
      '#campaigns-content'
    );
    toggleButtonsVisibility(true);
  } catch (error) {
    console.error('Error creating campaign:', error);
  }
}
function populateCampaignForm(campaignData) {
  // Populate your form fields with campaignData
  document.getElementById('campaignOwner').value = campaignData.campaignOwner;
  document.getElementById('campaignName').value = campaignData.campaignName;
  document.getElementById('campaignType').value = campaignData.campaignType;
  document.getElementById('campaignStatus').value = campaignData.campaignStatus;
  // Extract the date part from the ISO 8601 formatted start date
const isoStartDate = new Date(campaignData.startDate);
const formattedStartDate = isoStartDate.toISOString().split('T')[0];

// Set the formatted start date as the value of the startDate input field
document.getElementById('startDate').value = formattedStartDate;

// Extract the date part from the ISO 8601 formatted end date
const isoEndDate = new Date(campaignData.endDate);
const formattedEndDate = isoEndDate.toISOString().split('T')[0];

// Set the formatted end date as the value of the endDate input field
document.getElementById('endDate').value = formattedEndDate;

  document.getElementById('expectedRevenue').value =
    campaignData.expectedRevenue;
  document.getElementById('budgetedCost').value = campaignData.budgetedCost;
  document.getElementById('actualCost').value = campaignData.actualCost;
  document.getElementById('expectedResponse').value =
    campaignData.expectedResponse;
  document.getElementById('numbersSent').value = campaignData.numbersSent;

  // Set a data-campaign-id attribute to the campaignForm for reference during submission
  document
    .getElementById('campaignForm')
    .setAttribute('data-campaign-id', campaignData.id);
}

window.editCampaign = async function (campaignId) {
  alert('Editing campaign with ID: ' + campaignId);
  console.log('Received campaignId:', campaignId);

  if (campaignId === undefined || campaignId === 'undefined') {
    console.error('Invalid or undefined campaignId:', campaignId);
    return;
  }

  try {
    const numericCampaignId = +campaignId;
    console.log('Numeric campaignId:', numericCampaignId);

    if (isNaN(numericCampaignId) || numericCampaignId <= 0) {
      console.error('Invalid campaignId:', campaignId);
      return;
    }

    console.log('Fetching campaign details for ID:', numericCampaignId);

    const response = await fetch(`/api/campaigns/${numericCampaignId}`);

    if (!response.ok) {
      throw new Error(
        `Error fetching campaign details. Status: ${response.status}`
      );
    }

    const campaignData = await response.json();

    console.log('Campaign details:', campaignData);

    populateCampaignForm(campaignData);

    const campaignForm = document.getElementById('campaignForm');
    const campaignsTable = document.getElementById('campaigns-table');

    campaignForm.style.display = 'block';
    campaignsTable.style.display = 'none';

    history.pushState(
      { sectionId: 'campaignForm', campaignId: numericCampaignId },
      '',
      `#campaignForm/${numericCampaignId}`
    );
  } catch (error) {
    console.error('Error fetching campaign details:', error);
  }
};

window.deleteCampaign = async function (campaignId) {
  try {
    if (campaignId === undefined || campaignId === 'undefined') {
      console.error('Invalid or undefined campaignId:', campaignId);
      return;
    }

    const response = await fetch(`/api/campaigns/${campaignId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting campaign. Status: ${response.status}`);
    }

    console.log('Campaign deleted successfully');

    fetchAndDisplayCampaigns();
  } catch (error) {
    console.error('Error deleting campaign:', error);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  function showContent(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => {
      section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
      selectedSection.style.display = 'block';
    }

    const campaignForm = document.getElementById('campaignForm');
    const campaignsTable = document.getElementById('campaigns-table');

    if (sectionId === 'campaigns-content') {
      fetchAndDisplayCampaigns();
      toggleButtonsVisibility(false);
      campaignForm.style.display = 'none';
    } else if (sectionId === 'campaignForm') {
      campaignForm.style.display = 'block';
      campaignsTable.style.display = 'none';
      toggleButtonsVisibility(true);
    } else {
      toggleButtonsVisibility(false);
    }
  }

  function handleMenuItemClick(event) {
    event.preventDefault();

    const targetSectionId = event.target.getAttribute('href').substring(1);
    showContent(targetSectionId);

    history.pushState(
      { sectionId: targetSectionId },
      '',
      `#${targetSectionId}`
    );
  }

  const menuItems = document.querySelectorAll('header a');
  menuItems.forEach((item) => {
    item.addEventListener('click', handleMenuItemClick);
  });

  window.addEventListener('popstate', function (event) {
    if (event.state) {
      const targetSectionId = event.state.sectionId || 'home-content';
      showContent(targetSectionId);

      if (targetSectionId === 'campaigns-content') {
        resetCampaignForm();
      }
    }
  });

  const initialSectionId = window.location.hash
    ? window.location.hash.substring(1).split('/')[0]
    : 'home-content';
  showContent(initialSectionId);
  history.replaceState(
    { sectionId: initialSectionId },
    '',
    `#${initialSectionId}/`
  );

  window.showCampaignForm = function () {
    resetCampaignForm();
    const campaignForm = document.getElementById('campaignForm');
    const campaignsTable = document.getElementById('campaigns-table');

    campaignForm.style.display = 'block';
    campaignsTable.style.display = 'none';

    campaignForm.scrollIntoView({ behavior: 'smooth' });

    history.pushState({ sectionId: 'campaignForm' }, '', '#campaignForm');
    toggleButtonsVisibility(true);
  };

  const campaignsButton = document.getElementById('campaigns-button');
  if (campaignsButton) {
    campaignsButton.addEventListener('click', function () {
      toggleView();
      toggleButtonsVisibility(false);
    });
  }

  const campaignForm = document.getElementById('campaignForm');
  campaignForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const campaignId = campaignForm.getAttribute('data-campaign-id');

    if (campaignId) {
      updateCampaign(campaignId);
    } else {
      createCampaign();
    }
  });

  async function updateCampaign(campaignId) {
    try {
      if (campaignId === undefined || campaignId === 'undefined') {
        console.error('Invalid or undefined campaignId:', campaignId);
        return;
      }

      const updatedCampaignData = {
        campaignOwner: document.getElementById('campaignOwner').value,
        campaignName: document.getElementById('campaignName').value,
        campaignType: document.getElementById('campaignType').value,
        campaignStatus: document.getElementById('campaignStatus').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        expectedRevenue: document.getElementById('expectedRevenue').value,
        budgetedCost: document.getElementById('budgetedCost').value,
        actualCost: document.getElementById('actualCost').value,
        expectedResponse: document.getElementById('expectedResponse').value,
        numbersSent: document.getElementById('numbersSent').value,
      };

      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCampaignData),
      });

      if (!response.ok) {
        throw new Error(`Error updating campaign. Status: ${response.status}`);
      }

      console.log('Campaign updated successfully');

      fetchAndDisplayCampaigns();
      resetCampaignForm();

      const campaignsTable = document.getElementById('campaigns-table');
      const campaignForm = document.getElementById('campaignForm');

      campaignsTable.style.display = 'block';
      campaignForm.style.display = 'none';
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  }

  const deleteButton = document.getElementById('deleteCampaignButton');
  deleteButton.addEventListener('click', function () {
    const campaignId = getCampaignIdSomehow();
    deleteCampaign(campaignId);
  });

  function toggleButtonsVisibility(formVisible) {
    const createCampaignButton = document.getElementById(
      'createCampaignButton'
    );
    const otherButtons = document.querySelectorAll('.other-campaign-buttons');

    if (formVisible) {
      createCampaignButton.style.display = 'none';
      otherButtons.forEach((button) => {
        button.style.display = 'none';
      });
    } else {
      createCampaignButton.style.display = 'block';
      otherButtons.forEach((button) => {
        button.style.display = 'block';
      });
    }
  }
  // ...

  // ...

  // Example: Event listener for a delete button
  const deleteCampaignButton = document.getElementById('deleteCampaignButton');
  deleteCampaignButton.addEventListener('click', function () {
    // Get the campaignId from somewhere (e.g., a data attribute, a variable, etc.)
    const campaignId = getCampaignIdSomehow(); // Replace this with the actual method to get campaignId

    // Call deleteCampaign with the campaignId
    deleteCampaign(campaignId);
  });

  function getCampaignIdSomehow() {
    // Implement your logic to get the campaignId
    // This could involve reading from a form, querying the DOM, etc.
    // Ensure you return a valid campaignId or handle the logic accordingly
  }

  function filterCampaigns() {
    console.log('Filtering campaigns...');
    // Implement your filter logic here
  }
});
