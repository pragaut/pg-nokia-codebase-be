module.exports = function (sequelize, DataTypes) {
	const towerAllotment_Details = sequelize.define('towerAllotmentMaster', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			field : 'tower_allotment_id'
        },
        orgDetailsId: {
			type : DataTypes.STRING,
			field : 'org_details_id'
		},
		towerId: {
			type : DataTypes.STRING,
			field : 'tower_id'
		},
		relationOrder: {
			type : DataTypes.STRING,
			field : 'relation_order'
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
			tableName: 'tbl_nk_cm_tower_allotments',
			classMethods: {
				associate: function (Models) {
					// associations can be defined here
				}
			}
		});

	return towerAllotment_Details;
};