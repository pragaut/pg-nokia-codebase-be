module.exports = function (sequelize, DataTypes) {
    const selfAuditPlanDetails = sequelize.define('selfAuditPlanDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        selfAuditPlanBasicDetailsId: DataTypes.STRING,
        auditFlowMasterId: DataTypes.STRING,
        companyMasterId: DataTypes.STRING,
        plantMasterId: DataTypes.NUMERIC,
        selfAuditNumber: DataTypes.STRING,
        multiSectionMasterId: DataTypes.STRING,
        auditPlannedOn: DataTypes.DATE,
        auditPlanRemarks: DataTypes.STRING,
        auditFromDate: DataTypes.DATE,
        auditToDate: DataTypes.DATE,

        isAuditRescheduled: DataTypes.BOOLEAN,
        auditRescheduledOn: DataTypes.DATE,
        reasonOfReschedule: DataTypes.STRING,

        isAuditCancelled: DataTypes.BOOLEAN,
        auditCancelledOn: DataTypes.DATE,
        cancellationRemarks: DataTypes.STRING,

        isAuditTeamAssigned: DataTypes.BOOLEAN,
        teamAssignedOn: DataTypes.DATE,
        teamAssignmentRemarks: DataTypes.STRING,
        leadAuditorId: DataTypes.STRING,
        multiAuditorTeamId: DataTypes.STRING,
        multiAuditeeTeamId: DataTypes.STRING,

        isObservationSubmitted: DataTypes.BOOLEAN,
        observationSubmittedOn: DataTypes.DATE,
        isAuditExecuted: DataTypes.BOOLEAN,
        auditExecutedOn: DataTypes.DATE,
        auditExecutionRemarks: DataTypes.STRING,
        auditExecutedBy: DataTypes.STRING,
        groupSequenceNumber: DataTypes.INTEGER,
        sequenceNumber1: DataTypes.INTEGER,
        sequenceNumber2: DataTypes.INTEGER,

        auditPlannedBy: DataTypes.STRING,
        auditFinalMaxScore: DataTypes.DECIMAL,
        auditFinalActualScore: DataTypes.DECIMAL,
        auditFinalScorePercentage: DataTypes.DECIMAL,

        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_SelfAuditPlanDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        }
        // , {
        //     timestamps: false
        // }
    );

    return selfAuditPlanDetails;
};