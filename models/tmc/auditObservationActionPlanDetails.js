module.exports = function (sequelize, DataTypes) {
    const auditObservationActionPlanDetails = sequelize.define('auditObservationActionPlanDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        auditPlanDetailsId: DataTypes.STRING,
        auditObservationDetailsId: DataTypes.STRING,
        actionProposed: DataTypes.STRING,
        outcomeExpected: DataTypes.STRING,
        responsibility: DataTypes.STRING,
        targetDate: DataTypes.DATE,
        isActionPlanSubmitted: DataTypes.BOOLEAN,
        actionPlanSubmittedOn: DataTypes.DATE,
        isActionPlanReviewCompleted: DataTypes.STRING,
        reviewCompletionYearMasterId: DataTypes.STRING,
        reviewCompletionMonthMasterId: DataTypes.STRING,
        reviewCompletionDate: DataTypes.DATE,
        reviewCompletionMonthNumber: DataTypes.INTEGER, 
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_AuditObservationActionPlanDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return auditObservationActionPlanDetails;
};