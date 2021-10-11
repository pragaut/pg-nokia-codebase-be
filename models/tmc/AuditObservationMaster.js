module.exports = function (sequelize, DataTypes) {
    const auditObservationMaster = sequelize.define('auditObservationMaster', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        observationName: DataTypes.STRING,
        observationCode: DataTypes.STRING,
        isHighestScoreApplicable: DataTypes.BOOLEAN,
        isScoreNotApplicable: DataTypes.BOOLEAN,
        observationOrder: DataTypes.INTEGER,
        isInOperativeRecord: DataTypes.BOOLEAN,
        isActionPlanRequired: DataTypes.BOOLEAN,
        isScoreApplicable: DataTypes.BOOLEAN,
        isCommentRequired: DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_AuditObservationMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return auditObservationMaster;
};