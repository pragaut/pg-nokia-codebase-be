module.exports = function (sequelize, DataTypes) {
    const processFlowMaster = sequelize.define('processFlowMaster', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        processFlowName: DataTypes.STRING,
        processFlowCode: DataTypes.STRING,
        processFlowOrder :DataTypes.NUMERIC,
        auditFlowMasterId: DataTypes.STRING,
        leadTime: DataTypes.NUMERIC,
        isApproval: DataTypes.BOOLEAN,
        uRL: DataTypes.STRING,
        isUserTask: DataTypes.BOOLEAN, 
        isAuditteeTask: DataTypes.BOOLEAN, 
        isAuditorTask: DataTypes.BOOLEAN, 
        isMonthlyReviewStep: DataTypes.BOOLEAN, 
        isApprovalRequired: DataTypes.BOOLEAN, 
        isEmployeeWiseApplicable: DataTypes.BOOLEAN, 
        isPlantWiseApplicable: DataTypes.BOOLEAN, 
        isCompanyWiseApplicable: DataTypes.BOOLEAN, 
        isGroupWiseApplicable: DataTypes.BOOLEAN, 
        isFeedbackStep: DataTypes.BOOLEAN, 
        isDefaultProcess: DataTypes.BOOLEAN, 

        isCorporateTeamTask: DataTypes.BOOLEAN, 
        isEditableBeforeNextStepCompletion: DataTypes.BOOLEAN, 
        isEditableAfterNextStepCompletion: DataTypes.BOOLEAN, 
        isEditableAfterNextApproverApproval: DataTypes.BOOLEAN, 
        isReopenManadatoryAfterNextApproverRejection: DataTypes.BOOLEAN, 
        sendBackProcessFlowMasterId: DataTypes.STRING, 
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_ProcessFlowMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return processFlowMaster;
};