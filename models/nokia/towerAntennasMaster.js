module.exports = function (sequelize, DataTypes) {
	const towerAntennas_Details = sequelize.define('towerAntennasMaster', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			field : 'tower_antenna_id'
        },
		towerId: {
			type : DataTypes.STRING,
			field : 'tower_id'
		},
		antennaName: {
			type : DataTypes.STRING,
			field : 'antenna_name'
        },
		antennaCode: {
			type : DataTypes.STRING,
			field : 'antenna_code'
        },
		macAddress: {
			type : DataTypes.STRING,
			field : 'mac_address'
        },
        aisuDeviceId: {
			type : DataTypes.STRING,
			field : 'aisu_device_id'
        },
        uniqueId: {
			type : DataTypes.STRING,
			field : 'unique_id'
        },
		isActive: {
			type : DataTypes.BOOLEAN,
			field : 'is_active'
		},		
		createdBy: {
			type : DataTypes.STRING,
			field : 'created_by'
		},
		createdAt: {
			type: DataTypes.DATE,
			field: 'created_on',
		  },
		modifiedBy: {
			type : DataTypes.STRING,
			field : 'modified_by'
		},
		updatedAt: {
			type: DataTypes.DATE,
			field: 'modified_on'
		  }
	},
		{
			tableName: 'tbl_nk_cm_tower_antennas',
			classMethods: {
				associate: function (Models) {
					// associations can be defined here
				}
			}
		});

	return towerAntennas_Details;
};