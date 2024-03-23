// Fetch existing account names from the server
fetch('/accounts')
  .then((response) => response.json())
  .then((data) => {
    // Get the select element
    const select = document.getElementById('accountsParentAccount');

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
function fetchAndDisplayAccounts() {
  fetch('/accounts')
    .then((response) => response.json())
    .then((accounts) => {
      const accountsTableBody = document.getElementById('accounts-table-body');
      accountsTableBody.innerHTML = '';

      const accountsTable = document.getElementById('accounts-table');
      accountsTable.style.display = accounts.length > 0 ? 'block' : 'none';

      accounts.forEach((account) => {
        console.log('Account object:', account);
        if (account.id !== undefined) {
          const accountDetails = `
            <tr>
              <td>${account.accountOwner}</td>
              <td>${account.accountName}</td>
              <td>${account.phone}</td>
              <td>${account.website}</td>
              
              <td>
                <button onclick="editAccount(${account.id})">Edit</button>
                <button onclick="deleteAccount(${account.id})">Delete</button>
              </td>
            </tr>
          `;
          accountsTableBody.innerHTML += accountDetails;
        } else {
          console.error('Account ID is undefined:', account);
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching accounts:', error);
    });
}

function resetAccountForm() {
  // Reset form fields for account information and address information
  document.getElementById('accountsAccountOwner').value = '';
  document.getElementById('accountsAccountName').value = '';
  document.getElementById('accountsAccountSite').value = '';
  document.getElementById('accountsParentAccount').value = '';
  document.getElementById('accountsAccountNumber').value = '';
  document.getElementById('accountsAccountType').value = '';
  document.getElementById('accountsIndustry').value = '';
  document.getElementById('accountsAnnualRevenue').value = '';
  document.getElementById('accountsRating').value = '';
  document.getElementById('accountsPhone').value = '';
  document.getElementById('accountsFax').value = '';
  document.getElementById('accountsWebsite').value = '';
  document.getElementById('accountsTickerSymbol').value = '';
  document.getElementById('accountsOwnership').value = '';
  document.getElementById('accountsEmployees').value = '';
  document.getElementById('accountsSicCode').value = '';

  document.getElementById('accountsBillingStreet').value = '';
  document.getElementById('accountsBillingCity').value = '';
  document.getElementById('accountsBillingState').value = '';
  document.getElementById('accountsBillingCode').value = '';
  document.getElementById('accountsBillingCountry').value = '';
  document.getElementById('accountsShippingStreet').value = '';
  document.getElementById('accountsShippingCity').value = '';
  document.getElementById('accountsShippingState').value = '';
  document.getElementById('accountsShippingCode').value = '';
  document.getElementById('accountsShippingCountry').value = '';

  // Remove the data-account-id attribute to indicate a new account
  document.getElementById('accountsForm').removeAttribute('data-account-id');
}

async function createAccount() {
  try {
    // Get account data from the form
    const accountData = {
      accountOwner: document.getElementById('accountsAccountOwner').value,
      accountName: document.getElementById('accountsAccountName').value,
      accountSite: document.getElementById('accountsAccountSite').value,
      parentAccount: document.getElementById('accountsParentAccount').value,
      accountNumber: document.getElementById('accountsAccountNumber').value,
      accountType: document.getElementById('accountsAccountType').value,
      industry: document.getElementById('accountsIndustry').value,
      annualRevenue: document.getElementById('accountsAnnualRevenue').value,
      rating: document.getElementById('accountsRating').value,
      phone: document.getElementById('accountsPhone').value,
      fax: document.getElementById('accountsFax').value,
      website: document.getElementById('accountsWebsite').value,
      tickerSymbol: document.getElementById('accountsTickerSymbol').value,
      ownership: document.getElementById('accountsOwnership').value,
      employees: document.getElementById('accountsEmployees').value,
      sicCode: document.getElementById('accountsSicCode').value,
      billingStreet: document.getElementById('accountsBillingStreet').value,
      billingCity: document.getElementById('accountsBillingCity').value,
      billingState: document.getElementById('accountsBillingState').value,
      billingCode: document.getElementById('accountsBillingCode').value,
      billingCountry: document.getElementById('accountsBillingCountry').value,
      shippingStreet: document.getElementById('accountsShippingStreet').value,
      shippingCity: document.getElementById('accountsShippingCity').value,
      shippingState: document.getElementById('accountsShippingState').value,
      shippingCode: document.getElementById('accountsShippingCode').value,
      shippingCountry: document.getElementById('accountsShippingCountry').value,
    };

    const response = await fetch('/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      throw new Error(`Error creating account. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Account created successfully');

    // Fetch and display updated accounts after creation
    fetchAndDisplayAccounts();

    // Reset the form after successful account creation
    resetAccountForm();

    const accountsTable = document.getElementById('accounts-table');
    const accountsForm = document.getElementById('accountsForm');

    accountsTable.style.display = 'block';
    accountsForm.style.display = 'none';
    history.pushState(
      { sectionId: 'accounts-content' },
      '',
      '#accounts-content'
    );
    toggleAccountButtonsVisibility(true);
  } catch (error) {
    console.error('Error creating account:', error);
    // Handle the error, update the UI, or show an error message
  }
}

function fetchAccounts() {
  fetchAndDisplayAccounts();
}

function populateAccountForm(accountData) {
  // Populate your form fields with accountData
  document.getElementById('accountsAccountOwner').value =
    accountData.accountOwner;
  document.getElementById('accountsAccountName').value =
    accountData.accountName;
  document.getElementById('accountsAccountSite').value =
    accountData.accountSite;
  document.getElementById('accountsParentAccount').value =
    accountData.parentAccount;
  document.getElementById('accountsAccountNumber').value =
    accountData.accountNumber;
  document.getElementById('accountsAccountType').value =
    accountData.accountType;
  document.getElementById('accountsIndustry').value = accountData.industry;
  document.getElementById('accountsAnnualRevenue').value =
    accountData.annualRevenue;
  document.getElementById('accountsRating').value = accountData.rating;
  document.getElementById('accountsPhone').value = accountData.phone;
  document.getElementById('accountsFax').value = accountData.fax;
  document.getElementById('accountsWebsite').value = accountData.website;
  document.getElementById('accountsTickerSymbol').value =
    accountData.tickerSymbol;
  document.getElementById('accountsOwnership').value = accountData.ownership;
  document.getElementById('accountsEmployees').value = accountData.employees;
  document.getElementById('accountsSicCode').value = accountData.sicCode;

  document.getElementById('accountsBillingStreet').value =
    accountData.billingStreet;
  document.getElementById('accountsBillingCity').value =
    accountData.billingCity;
  document.getElementById('accountsBillingState').value =
    accountData.billingState;
  document.getElementById('accountsBillingCode').value =
    accountData.billingCode;
  document.getElementById('accountsBillingCountry').value =
    accountData.billingCountry;
  document.getElementById('accountsShippingStreet').value =
    accountData.shippingStreet;
  document.getElementById('accountsShippingCity').value =
    accountData.shippingCity;
  document.getElementById('accountsShippingState').value =
    accountData.shippingState;
  document.getElementById('accountsShippingCode').value =
    accountData.shippingCode;
  document.getElementById('accountsShippingCountry').value =
    accountData.shippingCountry;

  // Set a data-account-id attribute to the accountsForm for reference during submission
  document
    .getElementById('accountsForm')
    .setAttribute('data-account-id', accountData.id);
}

window.deleteAccount = async function (accountId) {
  try {
    // Ensure that accountId is defined before making the DELETE request
    if (accountId === undefined || accountId === 'undefined') {
      console.error('Invalid or undefined accountId:', accountId);
      return;
    }

    const response = await fetch(`/accounts/${accountId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting account. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Account deleted successfully');

    // Fetch and display updated accounts after deletion
    fetchAccounts();
  } catch (error) {
    console.error('Error deleting account:', error);
    // Handle the error, update the UI, or show an error message
  }
};

window.editAccount = async function (accountId) {
  alert('Editing account with ID: ' + accountId);
  console.log('Received accountId:', accountId);

  // Ensure that accountId is defined before making the GET request
  if (accountId === undefined || accountId === 'undefined') {
    console.error('Invalid or undefined accountId:', accountId);
    return;
  }

  try {
    // Convert accountId to a number using the unary plus operator
    const numericAccountId = +accountId;
    console.log('Numeric accountId:', numericAccountId);

    // Check if numericAccountId is a valid number
    if (isNaN(numericAccountId) || numericAccountId <= 0) {
      console.error('Invalid accountId:', accountId);
      return;
    }

    console.log('Fetching account details for ID:', numericAccountId);

    const response = await fetch(`/accounts/${numericAccountId}`);

    if (!response.ok) {
      throw new Error(
        `Error fetching account details. Status: ${response.status}`
      );
    }

    const accountData = await response.json();

    console.log('Account details:', accountData);

    // Call the populateAccountForm function to fill the form with account details
    populateAccountForm(accountData);

    const accountsForm = document.getElementById('accountsForm');
    const accountsTable = document.getElementById('accounts-table');
    accountsForm.style.display = 'block';
    accountsTable.style.display = 'none';

    // Update the URL to reflect the "Edit Account" state
    history.pushState(
      { sectionId: 'accountsForm', accountId: numericAccountId },
      '',
      `#accountsForm/${numericAccountId}`
    );
  } catch (error) {
    console.error('Error fetching account details:', error);
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

    const accountsForm = document.getElementById('accountsForm');
    const accountsTable = document.getElementById('accounts-table');

    // Adjust visibility of buttons based on the current content
    if (sectionId === 'accounts-content') {
      fetchAccounts();
      toggleAccountButtonsVisibility(false);
      accountsForm.style.display = 'none';
    } else if (sectionId === 'accountsForm') {
      accountsForm.style.display = 'block';
      accountsTable.style.display = 'none';
      toggleAccountButtonsVisibility(true);
    } else {
      toggleAccountButtonsVisibility(false);
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

      // Clear the account form fields when navigating back
      if (targetSectionId === 'accounts-content') {
        resetAccountForm();
      }
    }
  });

  // Fetch accounts when the page loads
  const initialSectionId = window.location.hash
    ? window.location.hash.substring(1).split('/')[0]
    : 'home-content';
  showContent(initialSectionId);
  history.replaceState(
    { sectionId: initialSectionId },
    '',
    `#${initialSectionId}/`
  );

  // Show the account form
  function toggleAccountButtonsVisibility(formVisible) {
    const createAccountButton = document.getElementById('createAccountButton');
    const otherButtons = document.querySelectorAll('.other-buttons'); // Replace with the actual class or selector

    if (formVisible) {
      createAccountButton.style.display = 'none';
      otherButtons.forEach((button) => {
        button.style.display = 'none';
      });
    } else {
      createAccountButton.style.display = 'block';
      otherButtons.forEach((button) => {
        button.style.display = 'block';
      });
    }
  }

  window.showAccountForm = function () {
    resetAccountForm();
    const accountsForm = document.getElementById('accountsForm');
    const accountsTable = document.getElementById('accounts-table');

    accountsForm.style.display = 'block';
    accountsTable.style.display = 'none';

    accountsForm.scrollIntoView({ behavior: 'smooth' });

    // Update the URL to reflect the "Create an Account" state
    history.pushState({ sectionId: 'accountsForm' }, '', '#accountsForm');
    toggleAccountButtonsVisibility(true);
  };

  const accountsButton = document.getElementById('accounts-button');
  if (accountsButton) {
    accountsButton.addEventListener('click', function () {
      toggleView();
      // Toggle visibility of buttons
      toggleAccountButtonsVisibility(false);
    });
  }

  const accountsForm = document.getElementById('accountsForm');
  accountsForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const accountId = accountsForm.getAttribute('data-account-id');

    if (accountId) {
      updateAccount(accountId);
    } else {
      createAccount();
    }
  });

  async function updateAccount(accountId) {
    try {
      // Ensure that accountId is defined before making the PUT request
      if (accountId === undefined || accountId === 'undefined') {
        console.error('Invalid or undefined accountId:', accountId);
        return;
      }

      // Get the account data from the form
      const updatedAccountData = {
        accountOwner: document.getElementById('accountsAccountOwner').value,
        accountName: document.getElementById('accountsAccountName').value,
        accountSite: document.getElementById('accountsAccountSite').value,
        parentAccount: document.getElementById('accountsParentAccount').value,
        accountNumber: document.getElementById('accountsAccountNumber').value,
        accountType: document.getElementById('accountsAccountType').value,
        industry: document.getElementById('accountsIndustry').value,
        annualRevenue: document.getElementById('accountsAnnualRevenue').value,
        rating: document.getElementById('accountsRating').value,
        phone: document.getElementById('accountsPhone').value,
        fax: document.getElementById('accountsFax').value,
        website: document.getElementById('accountsWebsite').value,
        tickerSymbol: document.getElementById('accountsTickerSymbol').value,
        ownership: document.getElementById('accountsOwnership').value,
        employees: document.getElementById('accountsEmployees').value,
        sicCode: document.getElementById('accountsSicCode').value,
        billingStreet: document.getElementById('accountsBillingStreet').value,
        billingCity: document.getElementById('accountsBillingCity').value,
        billingState: document.getElementById('accountsBillingState').value,
        billingCode: document.getElementById('accountsBillingCode').value,
        billingCountry: document.getElementById('accountsBillingCountry').value,
        shippingStreet: document.getElementById('accountsShippingStreet').value,
        shippingCity: document.getElementById('accountsShippingCity').value,
        shippingState: document.getElementById('accountsShippingState').value,
        shippingCode: document.getElementById('accountsShippingCode').value,
        shippingCountry: document.getElementById('accountsShippingCountry')
          .value,
        // Add other fields as needed
      };

      const response = await fetch(`/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAccountData),
      });

      if (!response.ok) {
        throw new Error(`Error updating account. Status: ${response.status}`);
      }

      // Process the response or update the UI as needed
      console.log('Account updated successfully');

      // Fetch and display updated accounts after updating
      fetchAndDisplayAccounts();

      // Reset the form after successful account update
      resetAccountForm();

      const accountsTable = document.getElementById('accounts-table');
      const accountsForm = document.getElementById('accountsForm');

      accountsTable.style.display = 'block';
      accountsForm.style.display = 'none'; // Hide the accounts form
    } catch (error) {
      console.error('Error updating account:', error);
      // Handle the error, update the UI, or show an error message
    }
  }
});
