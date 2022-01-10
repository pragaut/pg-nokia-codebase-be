module.exports = function (sequelize, DataTypes) {
    const towerMonitoringNotificationDetails = sequelize.define('towerMonitoringNotificationDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: 'tower_monitoring_notification_detail_id'
        },
        towerMonitoringDetailId: {
            type: DataTypes.STRING,
            field: 'tower_monitoring_detail_id'
        },
        deviceRegistrationDetailId: {
            type: DataTypes.STRING,
            field: 'device_registration_detail_id'
        },
        notificationId: {
            type: DataTypes.STRING,
            field: 'notification_id'
        },
        macAddress: {
            type: DataTypes.STRING,
            field: 'mac_address'
        },
        title: {
            type: DataTypes.STRING,
            field: 'title'
        },
        Date: {
            type: DataTypes.DATE,
            field: 'Date'
        },
        message: {
            type: DataTypes.STRING,
            field: 'message'
        },
        isClosed: {
            type: DataTypes.BOOLEAN,
            field: 'is_closed'
        },
        statusUpdatedBy: {
            type: DataTypes.STRING,
            field: 'status_updated_by'
        },
        isRemarksRequired: {
            type: DataTypes.BOOLEAN,
            field: 'is_remarks_required'
        },
        remarks: {
            type: DataTypes.STRING,
            field: 'remarks'
        },
        statusUpdatedOn: {
            type: DataTypes.DATE,
            field: 'status_updated_on'
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
        tableName: 'tbl_nk_tower_monitoring_notification_details',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });
    return towerMonitoringNotificationDetails
}