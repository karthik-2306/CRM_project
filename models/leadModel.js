const pool = require('../config/database');

const LeadModel = {
  async getAllLeads() {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM leads WHERE deleted = 0');
    connection.release();
    return rows;
  },

  async getLeadById(id) {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM leads WHERE id = ?', [id]);
    connection.release();
    return rows.length > 0 ? rows[0] : null;
  },

  async updateLead(id, formData) {
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
        id,
      ]
    );
    connection.release();
    return result.affectedRows > 0;
  },

  async deleteLead(id) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('UPDATE leads SET deleted = 1 WHERE id=?;', [id]);
    connection.release();
    return result.affectedRows > 0;
  },

  async createLead(formData) {
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
    connection.release();
    return leadId;
  },
  async convertLeadToContact(leadId, contactId) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE leads SET convertedToContactId = ? WHERE id = ?',
      [contactId, leadId]
    );
    connection.release();
    return result.affectedRows > 0;
  },

  async convertLeadToAccount(leadId, accountId) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE leads SET convertedToAccountId = ? WHERE id = ?',
      [accountId, leadId]
    );
    connection.release();
    return result.affectedRows > 0;
  },
};

module.exports = LeadModel;
