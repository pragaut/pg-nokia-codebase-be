module.exports = function (sequelize, DataTypes) {
    const auditFlow = sequelize.define('auditFlow', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        auditFlow: DataTypes.STRING,
        auditFlowCode: DataTypes.INTEGER,
        auditFlowOrder: DataTypes.NUMERIC,
        isSelfAuditFlow: DataTypes.BOOLEAN,
        isFinalAuditFlow: DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_AuditFlowMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return auditFlow;
};