module.exports = function (sequelize, DataTypes) {
	const deviceRegistration_Details = sequelize.define('deviceRegistrationMaster', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			field : 'device_registration_detail_id'
        },
		orgDetailsId: {
			type : DataTypes.STRING,
			field : 'org_details_id'
		},
		grpModulesId: {
			type : DataTypes.STRING,
			field : 'grp_modules_id'
		},
		macAddress: {
			type : DataTypes.STRING,
			field : 'mac_address'
        },
        uniqueId: {
			type : DataTypes.STRING,
			field : 'unique_id'
        },
        registrationDate: {
			type : DataTypes.DATE,
			field : 'registration_date'
        },
        deviceSequence: {
			type : DataTypes.STRING,
			field : 'device_sequence'
        },
        uniqueCode: {
			type : DataTypes.STRING,
			field : 'unique_code'
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
			tableName: 'tbl_nk_device_registration_details',
			classMethods: {
				associate: function (Models) {
					// associations can be defined here
				}
			}
		});

	return deviceRegistration_Details;
};