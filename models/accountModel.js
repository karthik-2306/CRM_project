const pool = require('../config/database');

const AccountModel = {
  async getAllAccounts() {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM accounts WHERE deleted = 0');
    connection.release();
    return rows;
  },

  async getAccountById(id) {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM accounts WHERE id = ?', [id]);
    connection.release();
    return rows.length > 0 ? rows[0] : null;
  },

  async updateAccount(id, formData) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `UPDATE accounts 
      SET accountOwner=?, accountName=?, accountSite=?, parentAccount=?, accountNumber=?, 
      accountType=?, industry=?, annualRevenue=?, rating=?, phone=?, fax=?, website=?, 
      tickerSymbol=?, ownership=?, employees=?, sicCode=?, billingStreet=?, 
      billingCity=?, billingState=?, billingCode=?, billingCountry=?, shippingStreet=?, 
      shippingCity=?, shippingState=?, shippingCode=?, shippingCountry=? 
      WHERE id=?;`,
      [
        formData.accountOwner,
        formData.accountName,
        formData.accountSite,
        formData.parentAccount,
        formData.accountNumber,
        formData.accountType,
        formData.industry,
        formData.annualRevenue,
        formData.rating,
        formData.phone,
        formData.fax,
        formData.website,
        formData.tickerSymbol,
        formData.ownership,
        formData.employees,
        formData.sicCode,
        formData.billingStreet,
        formData.billingCity,
        formData.billingState,
        formData.billingCode,
        formData.billingCountry,
        formData.shippingStreet,
        formData.shippingCity,
        formData.shippingState,
        formData.shippingCode,
        formData.shippingCountry,
        id,
      ]
    );
    connection.release();
    return result.affectedRows > 0;
  },

  async deleteAccount(id) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('UPDATE accounts SET deleted = 1 WHERE id=?;', [id]);
    connection.release();
    return result.affectedRows > 0;
  },

  async createAccount(formData) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO accounts 
      (accountOwner, accountName, accountSite, parentAccount, accountNumber, accountType, 
      industry, annualRevenue, rating, phone, fax, website, tickerSymbol, ownership, 
      employees, sicCode, billingStreet, billingCity, billingState, billingCode, 
      billingCountry, shippingStreet, shippingCity, shippingState, shippingCode, 
      shippingCountry) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        formData.accountOwner,
        formData.accountName,
        formData.accountSite,
        formData.parentAccount,
        formData.accountNumber,
        formData.accountType,
        formData.industry,
        formData.annualRevenue,
        formData.rating,
        formData.phone,
        formData.fax,
        formData.website,
        formData.tickerSymbol,
        formData.ownership,
        formData.employees,
        formData.sicCode,
        formData.billingStreet,
        formData.billingCity,
        formData.billingState,
        formData.billingCode,
        formData.billingCountry,
        formData.shippingStreet,
        formData.shippingCity,
        formData.shippingState,
        formData.shippingCode,
        formData.shippingCountry,
      ]
    );
    const accountId = result.insertId;
    connection.release();
    return accountId;
  },
};

module.exports = AccountModel;
