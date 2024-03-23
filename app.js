const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
//const leadRoutes = require('./routes/leadRoutes');
const contactRoutes = require('./routes/contactRoutes');
const accountRoutes = require('./routes/accountRoutes');
const dealRoutes = require('./routes/dealRoutes');
const taskRoutes = require('./routes/taskRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const app = express();
const PORT = 8000;
const publicPath = path.join(__dirname, 'public');

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'Leads',
};

// Initialize the MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Middleware to parse JSON requests
app.use(express.static(publicPath));
app.use(express.json());

// Use lead routes
//app.use('/api', leadRoutes);
app.use('/api', contactRoutes);
app.use('/accounts', accountRoutes);

app.use('/api', dealRoutes);
app.use('/api', taskRoutes);
app.use('/api', campaignRoutes);
app.get('/lead-details', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'lead_details.html'));
});
app.get('/leads', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM leads WHERE deleted = 0'
    );
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch lead details by ID
app.get('/leads/:id', async (req, res) => {
  try {
    const leadId = req.params.id;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM leads WHERE id = ?',
      [leadId]
    );
    connection.release();

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing lead
app.put('/leads/:id', async (req, res) => {
  try {
    const leadId = req.params.id;
    const formData = req.body;

    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      `UPDATE leads 
      SET leadOwner=?, company=?, firstName=?, lastName=?, title=?, email=?, phone=?, fax=?, mobile=?, website=?, 
      leadSource=?, leadStatus=?, industry=?, employees=?, income=?, rating=?, secondaryEmail=?, 
      street=?, city=?, state=?, zipCode=?, country=? 
      WHERE id=?;`,
      [
        formData.leadOwner,
        formData.company,
        formData.firstName,
        formData.lastName,
        formData.title,
        formData.email,
        formData.phone,
        formData.fax,
        formData.mobile,
        formData.website,
        formData.leadSource,
        formData.leadStatus,
        formData.industry,
        formData.employees,
        formData.income,
        formData.rating,
        formData.secondaryEmail,
        formData.street,
        formData.city,
        formData.state,
        formData.zipCode,
        formData.country,
        leadId,
      ]
    );

    connection.release();

    res.json({ success: result.affectedRows > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Soft Delete an existing lead
app.delete('/leads/:id', async (req, res) => {
  try {
    const leadId = req.params.id;

    if (leadId !== undefined) {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'UPDATE leads SET deleted = 1 WHERE id=?;',
        [leadId]
      );
      connection.release();

      if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Lead not found' });
      }
    } else {
      res.status(400).json({ error: 'Invalid leadId' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/leads', async (req, res) => {
  try {
    const formData = req.body;
        console.log('Received form data:', formData); // Log the received form data


    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      `INSERT INTO leads 
      (leadOwner, company, firstName, lastName, title, email, phone, fax, mobile, website, 
      leadSource, leadStatus, industry, employees, income, rating, secondaryEmail, 
      street, city, state, zipCode, country) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        formData.leadOwner,
        formData.company,
        formData.firstName,
        formData.lastName,
        formData.title,
        formData.email,
        formData.phone,
        formData.fax,
        formData.mobile,
        formData.website,
        formData.leadSource,
        formData.leadStatus,
        formData.industry,
        formData.employees,
        formData.income,
        formData.rating,
        formData.secondaryEmail,
        formData.street,
        formData.city,
        formData.state,
        formData.zipCode,
        formData.country,
      ]
    );

    const leadId = result.insertId;

    // If there is a conversion to a contact, account, or deal, update the leads table
    if (
      formData.convertedToContactId ||
      formData.convertedToAccountId ||
      formData.convertedToDealId
    ) {
      await connection.execute(
        `UPDATE leads 
        SET convertedToContactId=?, convertedToAccountId=?, convertedToDealId=? 
        WHERE id=?;`,
        [
          formData.convertedToContactId,
          formData.convertedToAccountId,
          formData.convertedToDealId,
          leadId,
        ]
      );
    }

    connection.release();

    res.json({ id: leadId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/leads/demo', async (req, res) => {
  try {
    const formData = req.body;
    console.log('Received form data:', formData); // Log the received form data

    // Map the fields from your friend's form to your leads table
    const leadData = {
      leadOwner: null,
      company: formData.companyname,
      firstName: formData.firstname,
      lastName: formData.lastname,
      title: formData.jobtitle,
      email: formData.professionalemail,
      phone: formData.phone_number,
      fax: null,
      mobile: null,
      website: null,
      leadSource: null,
      leadStatus: null,
      industry: null,
      employees: formData.numberofworkers,
      income: null,
      rating: null,
      secondaryEmail: null,
      street: null,
      city: null,
      state: null,
      zipCode: null,
      country: formData.country,
      convertedToContactId: null,
      convertedToAccountId: null,
      convertedToDealId: null
    };

    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      `INSERT INTO leads 
      (leadOwner, company, firstName, lastName, title, email, phone, fax, mobile, website, 
      leadSource, leadStatus, industry, employees, income, rating, secondaryEmail, 
      street, city, state, zipCode, country, convertedToContactId, convertedToAccountId, convertedToDealId) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);`,
      [
        leadData.leadOwner,
        leadData.company,
        leadData.firstName,
        leadData.lastName,
        leadData.title,
        leadData.email,
        leadData.phone,
        leadData.fax,
        leadData.mobile,
        leadData.website,
        leadData.leadSource,
        leadData.leadStatus,
        leadData.industry,
        leadData.employees,
        leadData.income,
        leadData.rating,
        leadData.secondaryEmail,
        leadData.street,
        leadData.city,
        leadData.state,
        leadData.zipCode,
        leadData.country,
        leadData.convertedToContactId,
        leadData.convertedToAccountId,
        leadData.convertedToDealId
      ]
    );

    const leadId = result.insertId;

    // If there is a conversion to a contact, account, or deal, update the leads table
    if (
      formData.convertedToContactId ||
      formData.convertedToAccountId ||
      formData.convertedToDealId
    ) {
      await connection.execute(
        `UPDATE leads 
        SET convertedToContactId=?, convertedToAccountId=?, convertedToDealId=? 
        WHERE id=?;`,
        [
          formData.convertedToContactId,
          formData.convertedToAccountId,
          formData.convertedToDealId,
          leadId,
        ]
      );
    }

    connection.release();

    res.json({ id: leadId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/leads/:id/convert', async (req, res) => {
  try {
    const leadId = req.params.id;
          
    // Fetch lead details
    const connection = await pool.getConnection();
    const [leadRows] = await connection.execute(
      'SELECT * FROM leads WHERE id = ?',
      [leadId]
    );

    if (leadRows.length === 0) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    const lead = leadRows[0];

    // Check if the lead is already converted
    if (
      lead.convertedToContactId !== null &&
      lead.convertedToAccountId !== null
    ) {
      res.status(400).json({ error: 'Lead is already converted' });
      return;
    }

    // Create a new contact using lead information
    const [contactResult] = await connection.execute(
      `INSERT INTO contacts 
      (contactOwner, firstName, lastName, email, phone, title, department, mobile, fax, 
      mailingStreet, mailingCity, mailingState, mailingZip, mailingCountry) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        lead.leadOwner,
        lead.firstName,
        lead.lastName,
        lead.email,
        lead.phone,
        lead.title || null,
        lead.department || null,
        lead.mobile || null,
        lead.fax || null,
        lead.street || null,
        lead.city || null,
        lead.state || null,
        lead.zipCode || null,
        lead.country || null,
      ]
    );
    const contactId = contactResult.insertId;

    // Create a new account using lead information
    const [accountResult] = await connection.execute(
      `INSERT INTO accounts 
      (accountOwner, accountName, industry, employees, annualRevenue, phone, fax, website, 
      billingStreet, billingCity, billingState, billingCode, billingCountry) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        lead.leadOwner,
        lead.company || 'Unnamed Account', // Use company name as account name, or 'Unnamed Account' if company name is not provided
        lead.industry || null,
        lead.employees || null,
        lead.income || null,
        lead.phone || null,
        lead.fax || null,
        lead.website || null,
        lead.street || null,
        lead.city || null,
        lead.state || null,
        lead.zipCode || null,
        lead.country || null,
      ]
    );
    const accountId = accountResult.insertId;

// Update the lead to mark it as converted
await connection.execute(
  'UPDATE leads SET convertedToContactId=?, convertedToAccountId=?, status=? WHERE id=?;',
  [contactId, accountId, 'Converted', leadId]
);


    connection.release();

    res.json({ success: true, contactId, accountId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
