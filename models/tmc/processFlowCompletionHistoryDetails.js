module.exports = function (sequelize, DataTypes) {
    const processFlowCompletionHistoryDetails = sequelize.define('processFlowCompletionHistoryDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        processFlowCompletionDetailsId: DataTypes.STRING,
        roleMasterId: DataTypes.STRING,
        companyMasterId: DataTypes.STRING,
        plantMasterId: DataTypes.STRING,
        userMasterId: DataTypes.STRING,
        statusMasterId: DataTypes.STRING,
        completedOn: DataTypes.DATE,
        statusMasterId: DataTypes.STRING,
        isCompleted: DataTypes.BOOLEAN,
        completedOn: DataTypes.DATE,
        isApproved: DataTypes.BOOLEAN,
        isSendBack: DataTypes.BOOLEAN,
        isRejected: DataTypes.BOOLEAN,
        remarks: DataTypes.STRING,
        agging: DataTypes.INTEGER,
        responsiblityOrder: DataTypes.INTEGER,

        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_ProcessFlowCompletionHistoryDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return processFlowCompletionHistoryDetails;
};