module.exports = function (sequelize, DataTypes) {
    const towerMonitoringSubDetails = sequelize.define('towerMonitoringSubDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: 'tower_monitoring_sub_detail_id'
        },
        macAddress: {
            type: DataTypes.STRING,
            field: 'mac_address'
        },
        towerMonitoringDetailId: {
            type: DataTypes.STRING,
            field: 'tower_monitoring_detail_id'
        },
        deviceRegistrationDetailsId: {
            type: DataTypes.STRING,
            field: 'device_registration_detail_id'
        },
        clampCount: {
            type: DataTypes.STRING,
            field: 'clamp_count'
        },
        seaLevelHeight: {
            type: DataTypes.STRING,
            field: 'sea_level_height'
        },
        userHeight: {
            type: DataTypes.DECIMAL,
            field: 'user_height'
        },
        userHeight1: {
            type: DataTypes.STRING,
            field: 'user_height_1'
        },
        userHeight2: {
            type: DataTypes.DECIMAL,
            field: 'user_height_2'
        },
        userHeight3: {
            type: DataTypes.DECIMAL,
            field: 'user_height_3'
        },
        heightMargin: {
            type: DataTypes.DECIMAL,
            field: 'height_margin'
        },
        heightUOM: {
            type: DataTypes.STRING,
            field: 'height_uom'
        },
        workingMinutes: {
            type: DataTypes.INTEGER,
            field: 'working_minutes'
        },
        isClamp1Connected: {
            type: DataTypes.BOOLEAN,
            field: 'is_clamp1_connected'
        },
        clamp1Status: {
            type: DataTypes.STRING,
            field: 'clamp1_status'
        },
        isClamp2Connected: {
            type: DataTypes.BOOLEAN,
            field: 'is_clamp2_connected'
        },
        clamp2Status: {
            type: DataTypes.STRING,
            field: 'clamp2_status'
        },
        statusOn: {
            type: DataTypes.DATE,
            field: 'status_on'
        },
        isWorkStarted: {
            type: DataTypes.BOOLEAN,
            field: 'is_work_started'
        },
        dataOrder: {
            type: DataTypes.INTEGER,
            field: 'data_order'
        },
        isSkipped: {
            type: DataTypes.BOOLEAN,
            field: 'is_skipped'
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
        tableName: 'tbl_nk_tower_monitoring_sub_details',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });
    return towerMonitoringSubDetails;
}