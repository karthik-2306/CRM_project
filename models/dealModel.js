const pool = require('../config/database');

const DealModel = {
  async getAllDeals() {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, dealOwner, dealName, dealAccountName, dealAmount FROM deals'
    );
    connection.release();
    return rows;
  },

  async getDealById(id) {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM deals WHERE id = ?', [id]);
    connection.release();
    return rows.length > 0 ? rows[0] : null;
  },

  async createDeal(formData) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO deals 
      (dealOwner, dealName, dealAccountName, dealType, dealNextStep, dealLeadSource, 
      dealContactName, dealAmount, dealClosingDate, dealStage, dealProbability, 
      dealExpectedRevenue, dealCampaignSource) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        formData.dealOwner,
        formData.dealName,
        formData.dealAccountName || null,
        formData.dealType,
        formData.dealNextStep || null,
        formData.dealLeadSource || null,
        formData.dealContactName || null,
        formData.dealAmount,
        formData.dealClosingDate,
        formData.dealStage || null,
        formData.dealProbability || null,
        formData.dealExpectedRevenue || null,
        formData.dealCampaignSource || null,
      ]
    );
    const dealId = result.insertId;
    connection.release();
    return dealId;
  },

  async updateDeal(id, formData) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `UPDATE deals 
      SET dealOwner=?, dealName=?, dealAccountName=?, dealType=?, dealNextStep=?, 
      dealLeadSource=?, dealContactName=?, dealAmount=?, dealClosingDate=?, 
      dealStage=?, dealProbability=?, dealExpectedRevenue=?, dealCampaignSource=? 
      WHERE id=?;`,
      [
        formData.dealOwner,
        formData.dealName,
        formData.dealAccountName || null,
        formData.dealType,
        formData.dealNextStep || null,
        formData.dealLeadSource || null,
        formData.dealContactName || null,
        formData.dealAmount,
        formData.dealClosingDate,
        formData.dealStage || null,
        formData.dealProbability || null,
        formData.dealExpectedRevenue || null,
        formData.dealCampaignSource || null,
        id,
      ]
    );
    connection.release();
    return result.affectedRows > 0;
  },
  async deleteDeal(id) {
  const connection = await pool.getConnection();
  const [result] = await connection.execute('DELETE FROM deals WHERE id = ?', [id]);
  connection.release();
  return result.affectedRows > 0;
}

};

module.exports = DealModel;
