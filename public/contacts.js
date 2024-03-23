// Fetch account names from the server
fetch('/accounts')
  .then((response) => response.json())
  .then((data) => {
    // Get the select element
    const select = document.getElementById('contactAccountName');

    // Clear any existing options
    select.innerHTML = '';

    // Iterate over the data and create an option element for each account name
    data.forEach((account) => {
      const option = document.createElement('option');
      option.value = account.accountName;
      option.textContent = account.accountName;
      select.appendChild(option);
    });
  })
  .catch((error) => console.error('Error fetching account names:', error));
function fetchAndDisplayContacts() {
  fetch('/api/contacts')
    .then((response) => response.json())
    .then((contacts) => {
      const contactsTableBody = document.getElementById('contacts-table-body');
      contactsTableBody.innerHTML = '';

      const contactsTable = document.getElementById('contacts-table');
      contactsTable.style.display = contacts.length > 0 ? 'block' : 'none';

      contacts.forEach((contact) => {
        console.log('Contact object:', contact);
        if (contact.id !== undefined) {
          const contactDetails = `
            <tr>
              <td>${contact.contactOwner}</td>
             
              <td>${contact.accountName}</td>
              <td>${contact.title}</td>
             
              <td>${contact.department}</td>
              
              <td>
                <button onclick="editContact(${contact.id})">Edit</button>
                <button onclick="deleteContact(${contact.id})">Delete</button>
              </td>
            </tr>
          `;
          contactsTableBody.innerHTML += contactDetails;
        } else {
          console.error('Contact ID is undefined:', contact);
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching contacts:', error);
    });
}

function resetContactForm() {
  // Reset the form fields for contacts
  document.getElementById('contactOwner').value = '';
  document.getElementById('contactFirstName').value = '';
  document.getElementById('contactLastName').value = '';
  document.getElementById('contactLeadSource').value = ''; // Added lead source field
  document.getElementById('contactAccountName').value = '';
  document.getElementById('contactTitle').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactDepartment').value = '';
  document.getElementById('contactPhone').value = ''; // Added phone field
  document.getElementById('contactHomePhone').value = ''; // Added home phone field
  document.getElementById('contactOtherPhone').value = ''; // Added other phone field
  document.getElementById('contactFax').value = ''; // Added fax field
  document.getElementById('contactMobile').value = '';
  document.getElementById('contactDOB').value = '';
  document.getElementById('contactAssistant').value = ''; // Added assistant field
  document.getElementById('contactAssistantPhone').value = ''; // Added assistant phone field
  document.getElementById('contactMailingStreet').value = '';
  document.getElementById('contactMailingCity').value = '';
  document.getElementById('contactMailingState').value = '';
  document.getElementById('contactMailingZip').value = '';
  document.getElementById('contactMailingCountry').value = '';
  document.getElementById('contactOtherStreet').value = ''; // Added other street field
  document.getElementById('contactOtherCity').value = ''; // Added other city field
  document.getElementById('contactOtherState').value = ''; // Added other state field
  document.getElementById('contactOtherZip').value = ''; // Added other zip code field
  document.getElementById('contactOtherCountry').value = ''; // Added other country field

  // Remove the data-contact-id attribute to indicate a new contact
  document.getElementById('contactForm').removeAttribute('data-contact-id');
}
async function createContact() {
  try {
    // Get contact data from the form
    const contactData = {
      contactOwner: document.getElementById('contactOwner').value,
      firstName: document.getElementById('contactFirstName').value,
      lastName: document.getElementById('contactLastName').value,
      leadSource: document.getElementById('contactLeadSource').value, // Added lead source field
      accountName: document.getElementById('contactAccountName').value,
      title: document.getElementById('contactTitle').value,
      email: document.getElementById('contactEmail').value,
      department: document.getElementById('contactDepartment').value,
      phone: document.getElementById('contactPhone').value, // Added phone field
      homePhone: document.getElementById('contactHomePhone').value, // Added home phone field
      otherPhone: document.getElementById('contactOtherPhone').value, // Added other phone field
      fax: document.getElementById('contactFax').value, // Added fax field
      mobile: document.getElementById('contactMobile').value,
      contactDOB: document.getElementById('contactDOB').value,
      assistant: document.getElementById('contactAssistant').value, // Added assistant field
      assistantPhone: document.getElementById('contactAssistantPhone').value, // Added assistant phone field
      mailingStreet: document.getElementById('contactMailingStreet').value,
      mailingCity: document.getElementById('contactMailingCity').value,
      mailingState: document.getElementById('contactMailingState').value,
      mailingZip: document.getElementById('contactMailingZip').value,
      mailingCountry: document.getElementById('contactMailingCountry').value,
      otherStreet: document.getElementById('contactOtherStreet').value, // Added other street field
      otherCity: document.getElementById('contactOtherCity').value, // Added other city field
      otherState: document.getElementById('contactOtherState').value, // Added other state field
      otherZip: document.getElementById('contactOtherZip').value, // Added other zip code field
      otherCountry: document.getElementById('contactOtherCountry').value, // Added other country field
    };

    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error(`Error creating contact. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Contact created successfully');

    // Fetch and display updated contacts after creation
    fetchAndDisplayContacts();

    // Reset the form after successful contact creation
    resetContactForm();

    const contactsTable = document.getElementById('contacts-table');
    const contactForm = document.getElementById('contactForm');

    contactsTable.style.display = 'block';
    contactForm.style.display = 'none';
    history.pushState(
      { sectionId: 'contacts-content' },
      '',
      '#contacts-content'
    );
    toggleButtonsVisibility(true);
  } catch (error) {
    console.error('Error creating contact:', error);
    // Handle the error, update the UI, or show an error message
  }
}

function fetchContacts() {
  fetchAndDisplayContacts();
}

function populateContactForm(contactData) {
  // Populate your form fields with contactData
  document.getElementById('contactOwner').value = contactData.contactOwner;
  document.getElementById('contactFirstName').value = contactData.firstName;
  document.getElementById('contactLastName').value = contactData.lastName;
  document.getElementById('contactLeadSource').value = contactData.leadSource; // Added lead source field
  document.getElementById('contactAccountName').value = contactData.accountName;
  document.getElementById('contactTitle').value = contactData.title;
  document.getElementById('contactEmail').value = contactData.email;
  document.getElementById('contactDepartment').value = contactData.department;
  document.getElementById('contactPhone').value = contactData.phone; // Added phone field
  document.getElementById('contactHomePhone').value = contactData.homePhone; // Added home phone field
  document.getElementById('contactOtherPhone').value = contactData.otherPhone; // Added other phone field
  document.getElementById('contactFax').value = contactData.fax; // Added fax field
  document.getElementById('contactMobile').value = contactData.mobile;
  // Assuming contactData is your object containing contact information

// Extract the date part from the ISO 8601 formatted date
const isoDate = new Date(contactData.contactDOB);
const formattedDate = isoDate.toISOString().split('T')[0];

// Set the formatted date as the value of the contactDOB input field
document.getElementById('contactDOB').value = formattedDate;

  document.getElementById('contactAssistant').value = contactData.assistant; // Added assistant field
  document.getElementById('contactAssistantPhone').value =
    contactData.assistantPhone; // Added assistant phone field
  document.getElementById('contactMailingStreet').value =
    contactData.mailingStreet;
  document.getElementById('contactMailingCity').value = contactData.mailingCity;
  document.getElementById('contactMailingState').value =
    contactData.mailingState;
  document.getElementById('contactMailingZip').value = contactData.mailingZip;
  document.getElementById('contactMailingCountry').value =
    contactData.mailingCountry;
  document.getElementById('contactOtherStreet').value = contactData.otherStreet; // Added other street field
  document.getElementById('contactOtherCity').value = contactData.otherCity; // Added other city field
  document.getElementById('contactOtherState').value = contactData.otherState; // Added other state field
  document.getElementById('contactOtherZip').value = contactData.otherZip; // Added other zip code field
  document.getElementById('contactOtherCountry').value =
    contactData.otherCountry; // Added other country field

  // Set a data-contact-id attribute to the contactForm for reference during submission
  document
    .getElementById('contactForm')
    .setAttribute('data-contact-id', contactData.id);
}


window.deleteContact = async function (contactId) {
  try {
    // Ensure that contactId is defined before making the DELETE request
    if (contactId === undefined || contactId === 'undefined') {
      console.error('Invalid or undefined contactId:', contactId);
      return;
    }

    const response = await fetch(`/api/contacts/${contactId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting contact. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Contact deleted successfully');

    // Fetch and display updated contacts after deletion
    fetchContacts();
  } catch (error) {
    console.error('Error deleting contact:', error);
    // Handle the error, update the UI, or show an error message
  }
};

window.editContact = async function (contactId) {
  alert('Editing contact with ID: ' + contactId);
  console.log('Received contactId:', contactId);

  // Ensure that contactId is defined before making the GET request
  if (contactId === undefined || contactId === 'undefined') {
    console.error('Invalid or undefined contactId:', contactId);
    return;
  }

  try {
    // Convert contactId to a number using the unary plus operator
    const numericContactId = +contactId;
    console.log('Numeric contactId:', numericContactId);

    // Check if numericContactId is a valid number
    if (isNaN(numericContactId) || numericContactId <= 0) {
      console.error('Invalid contactId:', contactId);
      return;
    }

    console.log('Fetching contact details for ID:', numericContactId);

    const response = await fetch(`/api/contacts/${numericContactId}`);

    if (!response.ok) {
      throw new Error(
        `Error fetching contact details. Status: ${response.status}`
      );
    }

    const contactData = await response.json();

    console.log('Contact details:', contactData);

    // Call the populateContactForm function to fill the form with contact details
    populateContactForm(contactData);

    const contactForm = document.getElementById('contactForm');
    const contactsTable = document.getElementById('contacts-table');
    contactForm.style.display = 'block';
    contactsTable.style.display = 'none';

    // Update the URL to reflect the "Edit Contact" state
    history.pushState(
      { sectionId: 'contactForm', contactId: numericContactId },
      '',
      `#contactForm/${numericContactId}`
    );
  } catch (error) {
    console.error('Error fetching contact details:', error);
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

    const contactForm = document.getElementById('contactForm');
    const contactsTable = document.getElementById('contacts-table');

    // Adjust visibility of buttons based on the current content
    if (sectionId === 'contacts-content') {
      fetchContacts();
      toggleButtonsVisibility(false);
      contactForm.style.display = 'none';
    } else if (sectionId === 'contactForm') {
      contactForm.style.display = 'block';
      contactsTable.style.display = 'none';
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

      // Clear the contact form fields when navigating back
      if (targetSectionId === 'contacts-content') {
        resetContactForm();
      }
    }
  });

  // Fetch contacts when the page loads
  const initialSectionId = window.location.hash
    ? window.location.hash.substring(1).split('/')[0]
    : 'home-content';
  showContent(initialSectionId);
  history.replaceState(
    { sectionId: initialSectionId },
    '',
    `#${initialSectionId}/`
  );

  // Show the contact form
  function toggleButtonsVisibility(formVisible) {
    const createContactButton = document.getElementById('createContactButton');
    const otherButtons = document.querySelectorAll('.other-buttons'); // Replace with the actual class or selector

    if (formVisible) {
      createContactButton.style.display = 'none';
      otherButtons.forEach((button) => {
        button.style.display = 'none';
      });
    } else {
      createContactButton.style.display = 'block';
      otherButtons.forEach((button) => {
        button.style.display = 'block';
      });
    }
  }

  window.showContactForm = function () {
    resetContactForm();
    const contactForm = document.getElementById('contactForm');
    const contactsTable = document.getElementById('contacts-table');

    contactForm.style.display = 'block';
    contactsTable.style.display = 'none';

    contactForm.scrollIntoView({ behavior: 'smooth' });

    // Update the URL to reflect the "Create a Contact" state
    history.pushState({ sectionId: 'contactForm' }, '', '#contactForm');
    toggleButtonsVisibility(true);
  };
  const contactsButton = document.getElementById('contacts-button');
  if (contactsButton) {
    contactsButton.addEventListener('click', function () {
      toggleView();
      // Toggle visibility of buttons
      toggleButtonsVisibility(false);
    });
  }
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const contactId = contactForm.getAttribute('data-contact-id');

    if (contactId) {
      updateContact(contactId);
    } else {
      createContact();
    }
  });
  async function updateContact(contactId) {
    try {
      // Get updated contact data from the form
      const updatedContactData = {
        contactOwner: document.getElementById('contactOwner').value,
        firstName: document.getElementById('contactFirstName').value,
        lastName: document.getElementById('contactLastName').value,
        leadSource: document.getElementById('contactLeadSource').value,
        accountName: document.getElementById('contactAccountName').value,
        title: document.getElementById('contactTitle').value,
        email: document.getElementById('contactEmail').value,
        department: document.getElementById('contactDepartment').value,
        phone: document.getElementById('contactPhone').value,
        homePhone: document.getElementById('contactHomePhone').value,
        otherPhone: document.getElementById('contactOtherPhone').value,
        fax: document.getElementById('contactFax').value,
        mobile: document.getElementById('contactMobile').value,
        contactDOB: document.getElementById('contactDOB').value,
        assistant: document.getElementById('contactAssistant').value,
        assistantPhone: document.getElementById('contactAssistantPhone').value,
        mailingStreet: document.getElementById('contactMailingStreet').value,
        mailingCity: document.getElementById('contactMailingCity').value,
        mailingState: document.getElementById('contactMailingState').value,
        mailingZip: document.getElementById('contactMailingZip').value,
        mailingCountry: document.getElementById('contactMailingCountry').value,
        otherStreet: document.getElementById('contactOtherStreet').value,
        otherCity: document.getElementById('contactOtherCity').value,
        otherState: document.getElementById('contactOtherState').value,
        otherZip: document.getElementById('contactOtherZip').value,
        otherCountry: document.getElementById('contactOtherCountry').value,
      };

      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT', // Use the appropriate HTTP method for updating (e.g., PUT or PATCH)
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContactData),
      });

      if (!response.ok) {
        throw new Error(`Error updating contact. Status: ${response.status}`);
      }

      // Process the response or update the UI as needed
      console.log('Contact updated successfully');

      // Fetch and display updated contacts after update
      fetchAndDisplayContacts();

      // Reset the form after successful contact update
      resetContactForm();

      const contactsTable = document.getElementById('contacts-table');
      const contactForm = document.getElementById('contactForm');

      contactsTable.style.display = 'block';
      contactForm.style.display = 'none';
      history.pushState(
        { sectionId: 'contacts-content' },
        '',
        '#contacts-content'
      );
      toggleButtonsVisibility(true);
    } catch (error) {
      console.error('Error updating contact:', error);
      // Handle the error, update the UI, or show an error message
    }
  }

  // Example: Event listener for a delete button
  const deleteButton = document.getElementById('deleteButton');

  deleteButton.addEventListener('click', function () {
    // Get the contactId from somewhere (e.g., a data attribute, a variable, etc.)
    const contactId = getContactIdSomehow(); // Replace this with the actual method to get contactId

    // Call deleteContact with the contactId
    deleteContact(contactId);
  });

  function filterContacts() {
    // Add your filter logic here
    console.log('Filtering contacts...');
  }
});
