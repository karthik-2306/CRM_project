function fetchAndDisplayTasks() {
  fetch('/api/tasks')
    .then((response) => response.json())
    .then((tasks) => {
      const tasksTableBody = document.getElementById('tasks-table-body');
      tasksTableBody.innerHTML = '';

      const tasksTable = document.getElementById('tasks-table');
      tasksTable.style.display = tasks.length > 0 ? 'block' : 'none';

      tasks.forEach((task) => {
        console.log('Task object:', task);
        if (task.id !== undefined) {
          const taskDetails = `
            <tr>
              <td>${task.taskOwner}</td>
              <td>${task.subject}</td>
              <td>${task.dueDate}</td>
             
              <td>${task.status}</td>
              
              <td>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
              </td>
            </tr>
          `;
          tasksTableBody.innerHTML += taskDetails;
        } else {
          console.error('Task ID is undefined:', task);
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching tasks:', error);
    });
}

function resetTaskForm() {
  document.getElementById('taskOwner').value = '';
  document.getElementById('subject').value = '';
  document.getElementById('dueDate').value = '';
  document.getElementById('contact').value = '';
  document.getElementById('account').value = '';
  document.getElementById('status').value = '';
  document.getElementById('priority').value = '';
  document.getElementById('reminder').checked = false;
  document.getElementById('repeat').checked = false;

  // Remove the data-task-id attribute to indicate a new task
  document.getElementById('taskForm').removeAttribute('data-task-id');
}

async function createTask() {
  try {
    // Get task data from the form
    const taskData = {
      taskOwner: document.getElementById('taskOwner').value,
      subject: document.getElementById('subject').value,
      dueDate: document.getElementById('dueDate').value,
      contact: document.getElementById('contact').value,
      account: document.getElementById('account').value,
      status: document.getElementById('status').value,
      priority: document.getElementById('priority').value,
      reminder: document.getElementById('reminder').checked,
      repeat: document.getElementById('repeat').checked,
    };

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Error creating task. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Task created successfully');

    // Fetch and display updated tasks after creation
    fetchAndDisplayTasks();

    // Reset the form after successful task creation
    resetTaskForm();

    const tasksTable = document.getElementById('tasks-table');
    const taskForm = document.getElementById('taskForm');

    tasksTable.style.display = 'block';
    taskForm.style.display = 'none';
    history.pushState({ sectionId: 'tasks-content' }, '', '#tasks-content');
    toggleButtonsVisibility(true);
  } catch (error) {
    console.error('Error creating task:', error);
    // Handle the error, update the UI, or show an error message
  }
}

function fetchTasks() {
  fetchAndDisplayTasks();
}

function populateTaskForm(taskData) {
  // Populate your form fields with taskData
  document.getElementById('taskOwner').value = taskData.taskOwner;
  document.getElementById('subject').value = taskData.subject;
// Extract the date part from the ISO 8601 formatted due date
const isoDueDate = new Date(taskData.dueDate);
const formattedDueDate = isoDueDate.toISOString().split('T')[0];

// Set the formatted due date as the value of the dueDate input field
document.getElementById('dueDate').value = formattedDueDate;

  document.getElementById('contact').value = taskData.contact;
  document.getElementById('account').value = taskData.account;
  document.getElementById('status').value = taskData.status;
  document.getElementById('priority').value = taskData.priority;
  document.getElementById('reminder').checked = taskData.reminder;
  document.getElementById('repeat').checked = taskData.repeat;

  // Set a data-task-id attribute to the taskForm for reference during submission
  document.getElementById('taskForm').setAttribute('data-task-id', taskData.id);
}

window.deleteTask = async function (taskId) {
  try {
    // Ensure that taskId is defined before making the DELETE request
    if (taskId === undefined || taskId === 'undefined') {
      console.error('Invalid or undefined taskId:', taskId);
      return;
    }

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting task. Status: ${response.status}`);
    }

    // Process the response or update the UI as needed
    console.log('Task deleted successfully');

    // Fetch and display updated tasks after deletion
    fetchTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
    // Handle the error, update the UI, or show an error message
  }
};

window.editTask = async function (taskId) {
  alert('Editing task with ID: ' + taskId);
  console.log('Received taskId:', taskId);

  // Ensure that taskId is defined before making the GET request
  if (taskId === undefined || taskId === 'undefined') {
    console.error('Invalid or undefined taskId:', taskId);
    return;
  }

  try {
    // Convert taskId to a number using the unary plus operator
    const numericTaskId = +taskId;
    console.log('Numeric taskId:', numericTaskId);

    // Check if numericTaskId is a valid number
    if (isNaN(numericTaskId) || numericTaskId <= 0) {
      console.error('Invalid taskId:', taskId);
      return;
    }

    console.log('Fetching task details for ID:', numericTaskId);

    const response = await fetch(`/api/tasks/${numericTaskId}`);

    if (!response.ok) {
      throw new Error(
        `Error fetching task details. Status: ${response.status}`
      );
    }

    const taskData = await response.json();

    console.log('Task details:', taskData);

    // Call the populateTaskForm function to fill the form with task details
    populateTaskForm(taskData);

    const taskForm = document.getElementById('taskForm');
    const tasksTable = document.getElementById('tasks-table');
    taskForm.style.display = 'block';
    tasksTable.style.display = 'none';

    // Update the URL to reflect the "Edit Task" state
    history.pushState(
      { sectionId: 'taskForm', taskId: numericTaskId },
      '',
      `#taskForm/${numericTaskId}`
    );
  } catch (error) {
    console.error('Error fetching task details:', error);
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

    const taskForm = document.getElementById('taskForm');
    const tasksTable = document.getElementById('tasks-table');

    // Adjust visibility of buttons based on the current content
    if (sectionId === 'tasks-content') {
      fetchTasks();
      toggleButtonsVisibility(false);
      taskForm.style.display = 'none';
    } else if (sectionId === 'taskForm') {
      taskForm.style.display = 'block';
      tasksTable.style.display = 'none';
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

      // Clear the task form fields when navigating back
      if (targetSectionId === 'tasks-content') {
        resetTaskForm();
      }
    }
  });

  // Fetch tasks when the page loads
  const initialSectionId = window.location.hash
    ? window.location.hash.substring(1).split('/')[0]
    : 'home-content';
  showContent(initialSectionId);
  history.replaceState(
    { sectionId: initialSectionId },
    '',
    `#${initialSectionId}/`
  );

  // Show the task form
  function toggleButtonsVisibility(formVisible) {
    const createTaskButton = document.getElementById('createTaskButton');
    const otherButtons = document.querySelectorAll('.other-buttons'); // Replace with the actual class or selector

    if (formVisible) {
      createTaskButton.style.display = 'none';
      otherButtons.forEach((button) => {
        button.style.display = 'none';
      });
    } else {
      createTaskButton.style.display = 'block';
      otherButtons.forEach((button) => {
        button.style.display = 'block';
      });
    }
  }

  window.showTaskForm = function () {
    resetTaskForm();
    const taskForm = document.getElementById('taskForm');
    const tasksTable = document.getElementById('tasks-table');

    taskForm.style.display = 'block';
    tasksTable.style.display = 'none';

    taskForm.scrollIntoView({ behavior: 'smooth' });

    // Update the URL to reflect the "Create a Task" state
    history.pushState({ sectionId: 'taskForm' }, '', '#taskForm');
    toggleButtonsVisibility(true);
  };

  const tasksButton = document.getElementById('tasks-button');
  if (tasksButton) {
    tasksButton.addEventListener('click', function () {
      toggleView();
      // Toggle visibility of buttons
      toggleButtonsVisibility(false);
    });
  }

  const taskForm = document.getElementById('taskForm');
  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const taskId = taskForm.getAttribute('data-task-id');

    if (taskId) {
      updateTask(taskId);
    } else {
      createTask();
    }
  });

  async function updateTask(taskId) {
    try {
      // Ensure that taskId is defined before making the PUT request
      if (taskId === undefined || taskId === 'undefined') {
        console.error('Invalid or undefined taskId:', taskId);
        return;
      }

      // Get the task data from the form
      const updatedTaskData = {
        taskOwner: document.getElementById('taskOwner').value,
        subject: document.getElementById('subject').value,
        dueDate: document.getElementById('dueDate').value,
        contact: document.getElementById('contact').value,
        account: document.getElementById('account').value,
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value,
        reminder: document.getElementById('reminder').checked,
        repeat: document.getElementById('repeat').checked,
      };

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTaskData),
      });

      if (!response.ok) {
        throw new Error(`Error updating task. Status: ${response.status}`);
      }

      // Process the response or update the UI as needed
      console.log('Task updated successfully');

      // Fetch and display updated tasks after updating
      fetchAndDisplayTasks();
      resetTaskForm();

      const tasksTable = document.getElementById('tasks-table');
      const taskForm = document.getElementById('taskForm');

      tasksTable.style.display = 'block';
      taskForm.style.display = 'none'; // Hide the tasks form
    } catch (error) {
      console.error('Error updating task:', error);
      // Handle the error, update the UI, or show an error message
    }
  }

  // Example: Event listener for a delete button
  const deleteButton = document.getElementById('deleteButton');

  deleteButton.addEventListener('click', function () {
    // Get the taskId from somewhere (e.g., a data attribute, a variable, etc.)
    const taskId = getTaskIdSomehow(); // Replace this with the actual method to get taskId

    // Call deleteTask with the taskId
    deleteTask(taskId);
  });

  function filterTasks() {
    // Add your filter logic here
    console.log('Filtering tasks...');
  }
});
