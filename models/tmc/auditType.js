module.exports = function (sequelize, DataTypes) {
    const auditType = sequelize.define('auditType', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        auditType: DataTypes.STRING,
        auditTypeCode: DataTypes.INTEGER,
        auditTypeOrder: DataTypes.NUMERIC,
        isHRAudit: DataTypes.BOOLEAN,
        isOperationAudit: DataTypes.BOOLEAN,
        isInOperativeRecord: DataTypes.BOOLEAN,
        isOtherAudit: DataTypes.BOOLEAN, 
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_AuditType',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return auditType;
};