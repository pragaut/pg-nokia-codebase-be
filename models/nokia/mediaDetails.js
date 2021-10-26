module.exports = function (sequelize, DataTypes) {
    const mediaDetails = sequelize.define('mediaDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },

        auditPlanDetailsId: DataTypes.STRING,
        scopeMasterId: DataTypes.STRING,
	    otherDetailsId: DataTypes.STRING,
        mediaName: DataTypes.STRING,
        mediaFullsizeAddress: DataTypes.STRING,
        mediaThumbnailAddress: DataTypes.STRING,
        isLatestMedia: DataTypes.BOOLEAN,  
		isMultiMedia: DataTypes.BOOLEAN, 
        active : DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,    
    },
        {
            tableName: 'tbl_MediaDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return mediaDetails;
};