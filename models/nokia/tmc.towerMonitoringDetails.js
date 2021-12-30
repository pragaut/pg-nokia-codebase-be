module.exports = function (sequelize, DataTypes) {
    const towerMonitoringDetails = sequelize.define('towerMonitoringDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: 'tower_monitoring_detail_id'
        },
        towerId: {
            type: DataTypes.STRING,
            field: 'tower_id'
        },
        deviceRegistrationDetailId: {
            type: DataTypes.STRING,
            field: 'device_registration_detail_id'
        },
        riggerEmployeeId: {
            type: DataTypes.STRING,
            field: 'rigger_employee_id'
        },
        startDateTime: {
            type: DataTypes.DATE,
            field: 'start_date_time'
        },
        endDateTime: {
            type: DataTypes.DATE,
            field: 'end_date_time'
        },
        yearId: {
            type: DataTypes.STRING,
            field: 'year_id'
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
        tableName: 'tbl_nk_tower_monitoring_details',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });
    return towerMonitoringDetails;
}