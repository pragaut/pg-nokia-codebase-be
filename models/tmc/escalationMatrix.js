module.exports = function (sequelize, DataTypes) {
    const escalationMatrix = sequelize.define('escalationMatrix', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },

        notificationMasterId: DataTypes.STRING,
        roleId: DataTypes.STRING,
		notificationType: DataTypes.STRING,
        frequencyMasterId: DataTypes.STRING,
        durationMasterId: DataTypes.STRING,
        dayAfterDueDate: DataTypes.INTEGER,
        isNotificationOn: DataTypes.BOOLEAN,  
        active : DataTypes.BOOLEAN
    },
        {
            tableName: 'tbl_EscalationMatrix',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return escalationMatrix;
};