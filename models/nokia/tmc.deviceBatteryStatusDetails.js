module.exports = function (sequelize, DataTypes) {
    const deviceBatteryStatusDetails = sequelize.define('deviceBatteryStatusDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: 'device_battery_status_detail_id'
        },
        macAddress: {
            type: DataTypes.STRING,
            field: 'mac_address'
        },
        mainDeviceBattery: {
            type: DataTypes.DECIMAL,
            field: 'main_device_battery'
        },
        child1DeviceBattery: {
            type: DataTypes.DECIMAL,
            field: 'child1_device_battery'
        },
        child2DeviceBattery: {
            type: DataTypes.DECIMAL,
            field: 'child2_device_battery'
        },
        child3DeviceBattery: {
            type: DataTypes.DECIMAL,
            field: 'child3_device_battery'
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
        tableName: 'tbl_nk_device_battery_status_details',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });
    return deviceBatteryStatusDetails
}