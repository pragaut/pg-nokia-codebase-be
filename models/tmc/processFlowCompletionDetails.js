module.exports = function (sequelize, DataTypes) {
    const processFlowCompletionDetails = sequelize.define('processFlowCompletionDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        auditPlanDetailsId: DataTypes.STRING,
        processFlowMasterId: DataTypes.STRING,
        auditPlanSubDetailsId :DataTypes.STRING,
        isEditable: DataTypes.BOOLEAN,
        isCompleted: DataTypes.BOOLEAN,
        isEdited: DataTypes.BOOLEAN,
        completedOn: DataTypes.DATE,
        statusMasterId: DataTypes.STRING, 
        isApprovalRequired: DataTypes.BOOLEAN, 
        isApproved: DataTypes.BOOLEAN, 
        isSendBack: DataTypes.BOOLEAN, 
        isRejected: DataTypes.BOOLEAN, 
        approvalDate: DataTypes.DATE, 
        agging: DataTypes.INTEGER,

        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_ProcessFlowCompletionDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return processFlowCompletionDetails;
};