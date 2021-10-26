module.exports = function (sequelize, DataTypes) {
    const notificationDetails = sequelize.define('notificationDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },

        notificationName: DataTypes.STRING,
        notificationCode: DataTypes.STRING,
		notificationType: DataTypes.STRING,
        subject: DataTypes.STRING,
        bodyContent: DataTypes.STRING,
        multiRoleIds: DataTypes.STRING,
		isAcceptanceNotification: DataTypes.BOOLEAN,
        isPaymentNotification: DataTypes.BOOLEAN,
        active : DataTypes.BOOLEAN,
        isNotificationON: DataTypes.BOOLEAN,
        forType: DataTypes.STRING 
    },
        {
            tableName: 'tbl_NotificationDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return notificationDetails;
};