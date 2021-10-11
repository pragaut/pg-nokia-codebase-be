module.exports = function (sequelize, DataTypes) {
    const processFlowResponsibilityMaster = sequelize.define('processFlowResponsibilityMaster', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        processFlowMasterId: DataTypes.STRING,
        companyMasterId: DataTypes.STRING,
        plantMasterId :DataTypes.STRING,
        roleMasterId: DataTypes.STRING,
        employeeMasterId: DataTypes.STRING,
        isLatestRecord: DataTypes.BOOLEAN,
        responsiblityOrder: DataTypes.NUMERIC, 
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_ProcessFlowResponsiblityMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return processFlowResponsibilityMaster;
};