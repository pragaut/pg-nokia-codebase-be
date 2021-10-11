module.exports = function (sequelize, DataTypes) {
    const selfAuditPlanBasicDetails = sequelize.define('selfAuditPlanBasicDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        yearMasterId: DataTypes.STRING,
        auditPlanNumber: DataTypes.STRING,
        multiSectionMasterId :DataTypes.STRING,
        auditPlanRemarks: DataTypes.STRING,
        auditPlannedBy: DataTypes.STRING,
        auditPlantDate: DataTypes.DATE,
        sequenceNumber1: DataTypes.INTEGER,

        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_SelfAuditPlanBasicDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return selfAuditPlanBasicDetails;
};