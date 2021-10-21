module.exports = function (sequelize, DataTypes) {
	const antennaRotationDetails = sequelize.define('antennaRotationDetails', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			field : 'antenna_rotation_detail_id'
        },
		towerAntennaId: {
			type : DataTypes.STRING,
			field : 'tower_antenna_id'
		},
		macOrAntennaCode: {
			type : DataTypes.STRING,
			field : 'mac_or_antenna_code'
        },
		azimuth: {
			type : DataTypes.STRING,
			field : 'azimuth'
        },
		height: {
			type : DataTypes.STRING,
			field : 'height'
        },
        direction: {
			type : DataTypes.STRING,
			field : 'direction'
        },
        tiltX: {
			type : DataTypes.STRING,
			field : 'tilt_x'
        },
		tiltY: {
			type : DataTypes.STRING,
			field : 'tilt_y'
        },
		tiltZ: {
			type : DataTypes.STRING,
			field : 'tilt_z'
        },
		azimuthPrev: {
			type : DataTypes.STRING,
			field : 'azimuth_prev'
        },
		heightPrev: {
			type : DataTypes.STRING,
			field : 'height_prev'
        },
        directionPrev: {
			type : DataTypes.STRING,
			field : 'direction_prev'
        },
        tiltXPrev: {
			type : DataTypes.STRING,
			field : 'tilt_x_prev'
        },
		tiltYPrev: {
			type : DataTypes.STRING,
			field : 'tilt_y_prev'
        },
		tiltZPrev: {
			type : DataTypes.STRING,
			field : 'tilt_z_prev'
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
			tableName: 'tbl_nk_antenna_rotation_details',
			classMethods: {
				associate: function (Models) {
					// associations can be defined here
				}
			}
		});

	return antennaRotationDetails;
};