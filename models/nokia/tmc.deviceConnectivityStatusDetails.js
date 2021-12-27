module.exports = function (sequelize, DataTypes) {
    const deviceConnectivityStatusDetails = sequelize.define('deviceConnectivityStatusDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: 'device_status_detail_id'
        },
        deviceRegistrationDetailId: {
            type: DataTypes.STRING,
            field: 'device_registration_detail_id'
        },
        macAddress: {
            type: DataTypes.STRING,
            field: 'mac_address'
        },
        deviceStatus: {
            type: DataTypes.STRING,
            field: 'device_status'
        },
        child1Status: {
            type: DataTypes.STRING,
            field: 'child1_status'
        },
        child2Status: {
            type: DataTypes.STRING,
            field: 'child2_status'
        },
        child3Status: {
            type: DataTypes.STRING,
            field: 'child3_status'
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
        tableName: 'tbl_nk_device_status_details',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });
    return deviceConnectivityStatusDetails;
}