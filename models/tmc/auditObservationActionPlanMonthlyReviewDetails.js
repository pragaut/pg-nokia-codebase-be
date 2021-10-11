module.exports = function (sequelize, DataTypes) {
    const auditObservationActionPlanMonthlyReviewDetails = sequelize.define('auditObservationActionPlanMonthlyReviewDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        auditPlanDetailsId: DataTypes.STRING,
        actionPlanDetailsId: DataTypes.STRING,
        yearMasterId: DataTypes.STRING,
        monthMasterId: DataTypes.STRING,
        statusMasterId: DataTypes.STRING,
        remarks: DataTypes.STRING,
        reviewNumber: DataTypes.INTEGER, 
        reviewDate: DataTypes.DATE, 
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_AuditObservationActionPlanMonthlyReviewDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return auditObservationActionPlanMonthlyReviewDetails;
};