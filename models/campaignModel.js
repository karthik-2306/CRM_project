const pool = require('../config/database');

const CampaignModel = {
  async getAllCampaigns() {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, campaignOwner, campaignName, startDate, endDate FROM campaigns'
    );
    connection.release();
    return rows;
  },

  async getCampaignById(id) {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM campaigns WHERE id = ?', [id]);
    connection.release();
    return rows.length > 0 ? rows[0] : null;
  },

  async createCampaign(formData) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO campaigns 
      (campaignOwner, campaignName, campaignType, campaignStatus, startDate, endDate, expectedRevenue, budgetedCost, actualCost, expectedResponse, numbersSent) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        formData.campaignOwner,
        formData.campaignName,
        formData.campaignType,
        formData.campaignStatus,
        formData.startDate,
        formData.endDate,
        formData.expectedRevenue,
        formData.budgetedCost,
        formData.actualCost,
        formData.expectedResponse,
        formData.numbersSent,
      ]
    );
    const campaignId = result.insertId;
    connection.release();
    return campaignId;
  },

  async updateCampaign(id, formData) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `UPDATE campaigns 
      SET campaignOwner=?, campaignName=?, campaignType=?, campaignStatus=?, startDate=?, endDate=?, 
      expectedRevenue=?, budgetedCost=?, actualCost=?, expectedResponse=?, numbersSent=? 
      WHERE id=?;`,
      [
        formData.campaignOwner,
        formData.campaignName,
        formData.campaignType,
        formData.campaignStatus,
        formData.startDate,
        formData.endDate,
        formData.expectedRevenue,
        formData.budgetedCost,
        formData.actualCost,
        formData.expectedResponse,
        formData.numbersSent,
        id,
      ]
    );
    connection.release();
    return result.affectedRows > 0;
  },

  async deleteCampaign(id) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('DELETE FROM campaigns WHERE id=?;', [id]);
    connection.release();
    return result.affectedRows > 0;
  },
};

module.exports = CampaignModel;
