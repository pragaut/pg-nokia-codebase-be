module.exports = function (sequelize, DataTypes) {
    const deviceNetworkConnectivityStatusDetails = sequelize.define('deviceNetworkConnectivityStatusDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: 'network_connectivity_status_id'
        },
        macAddress: {
            type: DataTypes.STRING,
            field: 'mac_address'
        },
        wlanStatus: {
            type: DataTypes.STRING,
            field: 'wlan_status'
        },
        wlanIP: {
            type: DataTypes.STRING,
            field: 'wlan_ip'
        },
        wwanStatus: {
            type: DataTypes.STRING,
            field: 'wwan_status'
        },
        wwanIP: {
            type: DataTypes.STRING,
            field: 'wwan_ip'
        },
        internetConnectivityStatus: {
            type: DataTypes.STRING,
            field: 'internet_connectivity_status'
        },
        isActive: {
            type: DataTypes.BOOLEN,
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
        tableName: 'tbl_nk_network_connectivity_status',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });
    return deviceNetworkConnectivityStatusDetails
}