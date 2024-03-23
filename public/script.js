async function convertLead(leadId) {
  try {
    const response = await fetch(`/leads/${leadId}/convert`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Error converting lead. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Lead converted successfully:', result);

    // Fetch and display updated leads after conversion
    fetchAndDisplayLeads();
  } catch (error) {
    console.error('Error converting lead:', error);
    // Handle the error, update the UI, or show an error message
  }
}

function toggleButtonsVisibility(formVisible) {
  const createLeadButton = document.getElementById('createLeadButton');
  const otherButtons = document.querySelectorAll('.other-buttons'); // Replace with the actual class or selector

  if (formVisible) {
    createLeadButton.style.display = 'none';
    otherButtons.forEach((button) => {
      button.style.display = 'none';
    });
  } else {
    createLeadButton.style.display = 'block';
    otherButtons.forEach((button) => {
      button.style.display = 'block';
    });
  }
}
function resetLeadForm() {
  document.getElementById('leadOwner').value = '';
  document.getElementById('company').value = '';
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('title').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('fax').value = '';
  document.getElementById('mobile').value = '';
  document.getElementById('website').value = '';
  document.getElementById('leadSource').value = '';
  document.getElementById('leadStatus').value = '';
  document.getElementById('industry').value = '';
  document.getElementById('leadEmployees').value = '';
  document.getElementById('leadIncome').value = '';
  document.getElementById('leadRating').value = '';
  document.getElementById('leadSecondaryEmail').value = '';
  document.getElementById('street').value = '';
  document.getElementById('city').value = '';
  document.getElementById('state').value = '';
  document.getElementById('zipCode').value = '';
  document.getElementById('country').value = '';

  // Remove the data-lead-id attribute to indicate a new lead
  document.getElementById('leadForm').removeAttribute('data-lead-id');
}
function fetchAndDisplayLeads() {
  fetch('/leads')
    .then((response) => response.json())
    .then((leads) => {
      const leadsTableBody = document.getElementById('leads-table-body');
      leadsTableBody.innerHTML = '';

      const leadsTable = document.getElementById('leads-table');
      leadsTable.style.display = leads.length > 0 ? 'block' : 'none';

      leads.forEach((lead) => {
        console.log('Lead object:', lead);
        if (lead.id !== undefined) {
          const status = lead.convertedToContactId !== null && lead.convertedToAccountId !== null
            ? 'Converted'
            : 'Not Converted';

          const leadDetails = `
            <tr id="lead-${lead.id}">
              <td>${lead.leadOwner}</td>
              <td>${lead.company}</td>
              <td>${lead.email}</td>
              <td>${lead.leadSource}</td>
              <td>${status}</td>
              <td>
                <button onclick="editLead(${lead.id})">Edit</button>
                <button onclick="deleteLead(${lead.id})">Delete</button>
                <button onclick="convertLead(${lead.id})">Convert</button>
              </td>
            </tr>
          `;
          leadsTableBody.innerHTML += leadDetails;
        } else {
          console.error('Lead ID is undefined:', lead);
        }
      });

      // Remove event listeners from each table row to prevent redirection
      document.querySelectorAll('tr[id^="lead-"]').forEach((row) => {
        row.removeEventListener('click', handleRowClick);
      });
    })
    .catch((error) => {
      console.error('Error fetching leads:', error);
    });
}

function handleRowClick(event) {
  if (event.target.tagName === 'BUTTON') {
    event.stopPropagation(); // Prevent row click event when clicking on buttons
    return;
  }
  const leadId = row.id.split('-')[1];
  window.location.href = `/lead-details?id=${leadId}`; // Replace with your desired URL format
}


async function createLead() {
  try {
    // Get lead data from the form
    const leadData = {
      leadOwner: document.getElementById('leadOwner').value,
      company: document.getElementById('company').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      title: document.getElementById('title').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      fax: document.getElementById('fax').value,
      mobile: document.getElementById('mobile').value,
      website: document.getElementById('website').value,
      leadSource: document.getElementById('leadSource').value,
      leadStatus: document.getElementById('leadStatus').value,
      industry: document.getElementById('industry').value,
      employees: document.getElementById('leadEmployees').value,
      income: document.getElementById('leadIncome').value,
      rating: document.getElementById('leadRating').value,
      secondaryEmail: document.getElementById('leadSecondaryEmail').value,
      street: document.getElementById('street').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zipCode: document.getElementById('zipCode').value,
      country: document.getElementById('country').value,
    };

    const response = await fetch('/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error(`Error creating lead. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Lead created successfully');

    // Fetch and display updated leads after creation
    fetchAndDisplayLeads();

    // Reset the form after successful lead creation
    resetLeadForm();

    const leadsTable = document.getElementById('leads-table');
    const leadForm = document.getElementById('leadForm');

    leadsTable.style.display = 'block';
    leadForm.style.display = 'none';
    history.pushState({ sectionId: 'leads-content' }, '', '#leads-content');
    toggleButtonsVisibility(true);
  } catch (error) {
    console.error('Error creating lead:', error);
    // Handle the error, update the UI, or show an error message
  }
}

function fetchLeads() {
  fetchAndDisplayLeads();
}
function populateLeadForm(leadData) {
  // Populate your form fields with leadData
  document.getElementById('leadOwner').value = leadData.leadOwner || '';
  document.getElementById('company').value = leadData.company || '';
  document.getElementById('firstName').value = leadData.firstName || '';
  document.getElementById('lastName').value = leadData.lastName || '';
  document.getElementById('title').value = leadData.title || '';
  document.getElementById('email').value = leadData.email || '';
  document.getElementById('phone').value = leadData.phone || '';
  document.getElementById('fax').value = leadData.fax || '';
  document.getElementById('mobile').value = leadData.mobile || '';
  document.getElementById('website').value = leadData.website || '';
  document.getElementById('leadSource').value = leadData.leadSource || '';
  document.getElementById('leadStatus').value = leadData.leadStatus || '';
  document.getElementById('industry').value = leadData.industry || '';
  document.getElementById('leadEmployees').value = leadData.employees ?? '';
  document.getElementById('leadIncome').value = leadData.income || '';
  document.getElementById('leadRating').value = leadData.rating || '';
  document.getElementById('leadSecondaryEmail').value =
    leadData.secondaryEmail || '';
  document.getElementById('street').value = leadData.street || '';
  document.getElementById('city').value = leadData.city || '';
  document.getElementById('state').value = leadData.state || '';
  document.getElementById('zipCode').value = leadData.zipCode || '';
  document.getElementById('country').value = leadData.country || '';

  // Set a data-lead-id attribute to the leadForm for reference during submission
  document.getElementById('leadForm').setAttribute('data-lead-id', leadData.id);
}

window.deleteLead = async function (leadId) {
  try {
    // Ensure that leadId is defined before making the DELETE request
    if (leadId === undefined || leadId === 'undefined') {
      console.error('Invalid or undefined leadId:', leadId);
      return;
    }

    const response = await fetch(`/leads/${leadId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting lead. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Lead deleted successfully');

    // Fetch and display updated leads after deletion
    fetchLeads();
  } catch (error) {
    console.error('Error deleting lead:', error);
    // Handle the error, update the UI, or show an error message
  }
};
window.editLead = async function (leadId) {
  alert('Editing lead with ID: ' + leadId);
  console.log('Received leadId:', leadId);

  // Ensure that leadId is defined before making the GET request
  if (leadId === undefined || leadId === 'undefined') {
    console.error('Invalid or undefined leadId:', leadId);
    return;
  }

  try {
    // Convert leadId to a number using the unary plus operator
    const numericLeadId = +leadId;
    console.log('Numeric leadId:', numericLeadId);

    // Check if numericLeadId is a valid number
    if (isNaN(numericLeadId) || numericLeadId <= 0) {
      console.error('Invalid leadId:', leadId);
      return;
    }

    console.log('Fetching lead details for ID:', numericLeadId);

    const response = await fetch(`/leads/${numericLeadId}`);

    if (!response.ok) {
      throw new Error(
        `Error fetching lead details. Status: ${response.status}`
      );
    }

    const leadData = await response.json();

    console.log('Lead details:', leadData);

    // Call the populateLeadForm function to fill the form with lead details
    populateLeadForm(leadData);

    const leadForm = document.getElementById('leadForm');
    const leadsTable = document.getElementById('leads-table');
    leadForm.style.display = 'block';
    leadsTable.style.display = 'none';

    // Update the URL to reflect the "Edit Lead" state
    history.pushState(
      { sectionId: 'leadForm', leadId: numericLeadId },
      '',
      `#leadForm/${numericLeadId}`
    );
  } catch (error) {
    console.error('Error fetching lead details:', error);
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

    const leadForm = document.getElementById('leadForm');
    const leadsTable = document.getElementById('leads-table');

    // Adjust visibility of buttons based on the current content
    if (sectionId === 'leads-content') {
      fetchLeads();
      toggleButtonsVisibility(false);
      leadForm.style.display = 'none';
    } else if (sectionId === 'leadForm') {
      leadForm.style.display = 'block';
      leadsTable.style.display = 'none';
      toggleButtonsVisibility(true);
    } else {
      toggleButtonsVisibility(false);
    }
  }

  function handleMenuItemClick(event) {
    event.preventDefault();

    const targetSectionId = event.target.getAttribute('href').substring(1);
    showContent(targetSectionId);

    // Update the URL to reflect the current section
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

      // Clear the lead form fields when navigating back
      if (targetSectionId === 'leads-content') {
        resetLeadForm();
      }
    }
  });

  // Fetch leads when the page loads
  const initialSectionId = window.location.hash
    ? window.location.hash.substring(1).split('/')[0]
    : 'home-content';
  showContent(initialSectionId);
  history.replaceState(
    { sectionId: initialSectionId },
    '',
    `#${initialSectionId}/`
  );

  // Show the lead form
  function toggleButtonsVisibility(formVisible) {
    const createLeadButton = document.getElementById('createLeadButton');
    const otherButtons = document.querySelectorAll('.other-buttons'); // Replace with the actual class or selector

    if (formVisible) {
      createLeadButton.style.display = 'none';
      otherButtons.forEach((button) => {
        button.style.display = 'none';
      });
    } else {
      createLeadButton.style.display = 'block';
      otherButtons.forEach((button) => {
        button.style.display = 'block';
      });
    }
  }

  window.showLeadForm = function () {
    resetLeadForm();
    const leadForm = document.getElementById('leadForm');
    const leadsTable = document.getElementById('leads-table');

    leadForm.style.display = 'block';
    leadsTable.style.display = 'none';

    leadForm.scrollIntoView({ behavior: 'smooth' });

    // Update the URL to reflect the "Create a Lead" state
    history.pushState({ sectionId: 'leadForm' }, '', '#leadForm');
    toggleButtonsVisibility(true);
  };
  const leadsButton = document.getElementById('leads-button');
  if (leadsButton) {
    leadsButton.addEventListener('click', function () {
      toggleView();
      // Toggle visibility of buttons
      toggleButtonsVisibility(false);
    });
  }
  const leadForm = document.getElementById('leadForm');
  leadForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const leadId = leadForm.getAttribute('data-lead-id');

    if (leadId) {
      updateLead(leadId);
    } else {
      createLead();
    }
  });
  async function updateLead(leadId) {
    try {
      // Ensure that leadId is defined before making the PUT request
      if (leadId === undefined || leadId === 'undefined') {
        console.error('Invalid or undefined leadId:', leadId);
        return;
      }

      // Get the lead data from the form
      const formData = {
        leadOwner: document.getElementById('leadOwner').value,
        company: document.getElementById('company').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        title: document.getElementById('title').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        fax: document.getElementById('fax').value,
        mobile: document.getElementById('mobile').value,
        website: document.getElementById('website').value,
        leadSource: document.getElementById('leadSource').value,
        leadStatus: document.getElementById('leadStatus').value,
        industry: document.getElementById('industry').value,
        employees: document.getElementById('leadEmployees').value,
        income: document.getElementById('leadIncome').value,
        rating: document.getElementById('leadRating').value,
        secondaryEmail: document.getElementById('leadSecondaryEmail').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value,
      };

      // Dynamically construct the SET clause based on defined values in formData
      const updateFields = Object.keys(formData)
        .filter((key) => formData[key] !== undefined && key !== 'id')
        .map((key) => `${key}=?`)
        .join(', ');

      const values = Object.values(formData).filter(
        (value) => value !== undefined
      );

      values.push(leadId);

      // Make the PUT request with the dynamically constructed query
      const response = await fetch(`/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error updating lead. Status: ${response.status}`);
      }

      // Process the response or update the UI as needed
      console.log('Lead updated successfully');

      // Fetch and display updated leads after updating
      fetchAndDisplayLeads();
      resetLeadForm();

      const leadsTable = document.getElementById('leads-table');
      const leadForm = document.getElementById('leadForm');

      leadsTable.style.display = 'block';
      leadForm.style.display = 'none'; // Hide the leads form
    } catch (error) {
      console.error('Error updating lead:', error);
      // Handle the error, update the UI, or show an error message
    }
  }

  // Example: Event listener for a delete button
  const deleteButton = document.getElementById('deleteButton');

  deleteButton.addEventListener('click', function () {
    // Get the leadId from somewhere (e.g., a data attribute, a variable, etc.)
    const leadId = getLeadIdSomehow(); // Replace this with the actual method to get leadId

    // Call deleteLead with the leadId
    deleteLead(leadId);
  });

  function filterLeads() {
    // Add your filter logic her  e
    console.log('Filtering leads...');
  }
});
