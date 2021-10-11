module.exports = function (sequelize, DataTypes) {
    const escalationDurationMaster = sequelize.define('escalationDurationMaster', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },

        frequencyMasterId: DataTypes.STRING, 
		durationName: DataTypes.STRING,
        durationCode: DataTypes.STRING,
        durationOrder: DataTypes.DECIMAL,
        active : DataTypes.BOOLEAN,
        createdBy : DataTypes.STRING,
        updatedby : DataTypes.STRING
    },
        {
            tableName: 'tbl_EscalationDurationMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return escalationDurationMaster;
};