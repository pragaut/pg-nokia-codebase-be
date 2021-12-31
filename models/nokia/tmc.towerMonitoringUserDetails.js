module.exports = function (sequelize, DataTypes) {
    const towerMonitoringUserDetails = sequelize.define('towerMonitoringUserDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: 'tower_monitoring_user_detail_id'
        },
        towerMonitoringDetailId: {
            type: DataTypes.STRING,
            field: 'tower_monitoring_detail_id'
        },
        receiverId: {
            type: DataTypes.STRING,
            field: 'receiver_id'
        },
        employeeId: {
            type: DataTypes.STRING,
            field: 'employee_id'
        },
        roleId: {
            type: DataTypes.STRING,
            field: 'role_id'
        }, 
        isNotificationApplicable: {
            type: DataTypes.BOOLEAN,
            field: 'is_notification_applicable'
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
        tableName: 'tbl_nk_tower_monitoring_user_details',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });
    return towerMonitoringUserDetails;
}