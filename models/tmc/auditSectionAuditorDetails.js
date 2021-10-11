module.exports = function (sequelize, DataTypes) {
    const auditSectionAuditorDetails = sequelize.define('auditSectionAuditorDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        auditPlanDetailsId: DataTypes.STRING,
        sectionMasterId: DataTypes.STRING,
        auditorMasterId: DataTypes.STRING,
        isObservationSubmitted: DataTypes.BOOLEAN,
        observationSubmittedOn: DataTypes.DATE,
        isAuditExecuted: DataTypes.BOOLEAN,
        executedOn: DataTypes.DATE,

        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_AuditSectionAuditorDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return auditSectionAuditorDetails;
};