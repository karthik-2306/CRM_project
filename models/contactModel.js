const pool = require('../config/database');

const ContactModel = {
  async getAllContacts() {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM contacts WHERE deleted = 0;');
    connection.release();
    return rows;
  },

  async getContactById(id) {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM contacts WHERE id = ? AND deleted = 0;', [id]);
    connection.release();
    return rows.length > 0 ? rows[0] : null;
  },

  async updateContact(id, formData) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `UPDATE contacts 
      SET contactOwner=?, firstName=?, lastName=?, leadSource=?, accountName=?, title=?, email=?, department=?, 
      phone=?, homePhone=?, otherPhone=?, fax=?, mobile=?, contactDOB=?, assistant=?, assistantPhone=?, 
      mailingStreet=?, mailingCity=?, mailingState=?, mailingZip=?, mailingCountry=?, 
      otherStreet=?, otherCity=?, otherState=?, otherZip=?, otherCountry=? 
      WHERE id=?;`,
      [
        formData.contactOwner,
        formData.firstName,
        formData.lastName,
        formData.leadSource,
        formData.accountName || null,
        formData.title,
        formData.email,
        formData.department,
        formData.phone,
        formData.homePhone,
        formData.otherPhone,
        formData.fax,
        formData.mobile,
        formData.contactDOB,
        formData.assistant,
        formData.assistantPhone,
        formData.mailingStreet,
        formData.mailingCity,
        formData.mailingState,
        formData.mailingZip,
        formData.mailingCountry,
        formData.otherStreet,
        formData.otherCity,
        formData.otherState,
        formData.otherZip,
        formData.otherCountry,
        id,
      ]
    );
    connection.release();
    return result.affectedRows > 0;
  },

  async deleteContact(id) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('UPDATE contacts SET deleted = 1 WHERE id=?;', [id]);
    connection.release();
    return result.affectedRows > 0;
  },

  async createContact(formData) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO contacts 
      (contactOwner, firstName, lastName, leadSource, accountName, title, email, department, 
      phone, homePhone, otherPhone, fax, mobile, contactDOB, assistant, assistantPhone, 
      mailingStreet, mailingCity, mailingState, mailingZip, mailingCountry, 
      otherStreet, otherCity, otherState, otherZip, otherCountry) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        formData.contactOwner,
        formData.firstName,
        formData.lastName,
        formData.leadSource,
        formData.accountName || null,
        formData.title,
        formData.email,
        formData.department,
        formData.phone,
        formData.homePhone,
        formData.otherPhone,
        formData.fax,
        formData.mobile,
        formData.contactDOB,
        formData.assistant,
        formData.assistantPhone,
        formData.mailingStreet,
        formData.mailingCity,
        formData.mailingState,
        formData.mailingZip,
        formData.mailingCountry,
        formData.otherStreet,
        formData.otherCity,
        formData.otherState,
        formData.otherZip,
        formData.otherCountry,
      ]
    );
    const contactId = result.insertId;
    connection.release();
    return contactId;
  },
};

module.exports = ContactModel;
