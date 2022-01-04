module.exports = function (sequelize, DataTypes) {
    const towerMonitoringNotificationSubDetails = sequelize.define('towerMonitoringNotificationSubDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: 'tower_monitoring_notification_sub_detail_id'
        },
        towerMonitoringNotificationDetailId: {
            type: DataTypes.STRING,
            field: 'tower_monitoring_notification_detail_id'
        },
        employeeId: {
            type: DataTypes.STRING,
            field: 'employee_id'
        },
        receiverId: {
            type: DataTypes.STRING,
            field: 'receiver_id'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active'
        },
        createdBy: {
            type: DataTypes.STRING,
            field: 'created_by'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_on',
        },
        modifiedBy: {
            type: DataTypes.STRING,
            field: 'modified_by'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'modified_on'
        }
    }, {
        tableName: 'tbl_nk_tower_monitoring_notification_sub_details',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });
    return towerMonitoringNotificationSubDetails
}