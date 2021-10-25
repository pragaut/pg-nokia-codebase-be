module.exports = function ( sequelize, DataTypes){
    const deviceLocationDetails = sequelize.define('deviceLocationDetails', {
        id: {
			type: DataTypes.STRING,
			primaryKey: true,
            field : 'device_location_detail_id'
		}, 
        deviceRegistrationDetailId :{
            type : DataTypes.STRING,
            field : 'device_registration_detail_id'
        },
        macAddress :{
            type : DataTypes.STRING,
            field : 'mac_address'
        },
        longitude :{
            type : DataTypes.STRING,
            field : 'longitude'
        },
        latitude :{
            type : DataTypes.STRING,
            field : 'latitude'
        },
        date :{
            type : DataTypes.STRING,
            field : 'date'
        },
        isDeviceActive :{
            type : DataTypes.STRING,
            field : 'is_device_active'
        },
        isActive :{
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

    }, {
        tableName: 'tbl_nk_device_location_details',
        classMethods: {
            associate: function (Models) {
                // associations can be defined here
            }
        }
    });
    return deviceLocationDetails
}