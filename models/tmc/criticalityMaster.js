module.exports = function (sequelize, DataTypes) {
    const criticalityMaster = sequelize.define('criticalityMaster', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        criticalityName: DataTypes.STRING,
        criticalityCode: DataTypes.STRING,
        criticalityOrder: DataTypes.NUMERIC ,
        isInOperativeRecord: DataTypes.BOOLEAN,
        isCritical: DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_CriticalityMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return criticalityMaster;
};