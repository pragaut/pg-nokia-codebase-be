module.exports = function (sequelize, DataTypes) {
    const auditTypeAuditorRelation = sequelize.define('auditTypeAuditorRelation', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        auditTypeId: DataTypes.STRING,
        userId: DataTypes.STRING, 
        isInOperativeRecord: DataTypes.BOOLEAN, 
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_AuditTypeAuditorRelationMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return auditTypeAuditorRelation;
};