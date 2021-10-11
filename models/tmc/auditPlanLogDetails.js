module.exports = function (sequelize, DataTypes) {
    const auditPlanLogDetails = sequelize.define('auditPlanLogDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        auditPlanDetailsId: DataTypes.STRING,
        auditNumber: DataTypes.STRING,
        auditFlowMasterId: DataTypes.STRING,
        selfAuditPlanBasicDetailsId: DataTypes.STRING,
        selfAuditPlanDetailsId: DataTypes.STRING,
        multiCorporateAuditorTeamId: DataTypes.STRING,
        multiPlantAuditeeTeamId: DataTypes.STRING,
        yearMasterId: DataTypes.NUMERIC, 
      
        auditPlanRemarks: DataTypes.STRING,
        auditFromDate: DataTypes.DATE,
        auditToDate: DataTypes.DATE,

        auditPlannedOn: DataTypes.DATE,

        isAuditRescheduled: DataTypes.BOOLEAN,
        auditRescheduledOn: DataTypes.DATE,
        reasonOfReschedule: DataTypes.STRING,

        isAuditCancelled: DataTypes.BOOLEAN,
        auditCancelledOn: DataTypes.DATE,
        cancellationRemarks: DataTypes.STRING, 

        isAuditExecuted: DataTypes.BOOLEAN,
        auditExecutedOn: DataTypes.DATE,
        auditExecutionRemarks: DataTypes.STRING,
        auditExecutedBy: DataTypes.STRING,
        sequencenumber1: DataTypes.INTEGER,
        sequenceNumber2: DataTypes.INTEGER,


        isActionPlanUpdated: DataTypes.BOOLEAN,
        actionPlanUpdatedOn: DataTypes.DATE,
        actionPlanRemarks: DataTypes.STRING,
        actionPlanUpdatedBy: DataTypes.STRING,

        auditApprovalStatusMasterId: DataTypes.STRING,
        auditApprovalDate: DataTypes.DATE,
        auditApprovalRemarks: DataTypes.STRING,
        isAuditClosed: DataTypes.BOOLEAN,

        auditPlannedBy: DataTypes.STRING,
        auditPlannedOn: DataTypes.DATE,
        auditFinalMaxScore: DataTypes.DECIMAL,
        auditFinalActualScore: DataTypes.DECIMAL,
        auditFinalScorePercentage: DataTypes.DECIMAL,

        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_AuditPlanLogDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return auditPlanLogDetails;
};