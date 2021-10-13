module.exports = function (sequelize, DataTypes) {
	const tower_Details = sequelize.define('towerMaster', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			field : 'tower_id'
        },
        orgDetailsId: {
			type : DataTypes.STRING,
			field : 'org_details_id'
		},
		towerName: {
			type : DataTypes.STRING,
			field : 'tower_name'
		},
		siteName: {
			type : DataTypes.STRING,
			field : 'site_name'
        },
        cityId: {
			type : DataTypes.STRING,
			field : 'city_id'
		},
		longitude: {
			type : DataTypes.STRING,
			field : 'longitude'
		},
		latitude: {
			type : DataTypes.STRING,
			field : 'latitude'
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
			tableName: 'tbl_nk_cm_towers',
			classMethods: {
				associate: function (Models) {
					// associations can be defined here
				}
			}
		});

	return tower_Details;
};