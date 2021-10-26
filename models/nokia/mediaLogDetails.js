module.exports = function (sequelize, DataTypes) {
    const mediaLogDetails = sequelize.define('mediaLogDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        mediaDetailsId: DataTypes.STRING,
        invoiceLogDetailsId : DataTypes.STRING,
        invoiceDetailsId: DataTypes.STRING,
        supportingDocumentMasterId: DataTypes.STRING,
		paymentDetailsId: DataTypes.STRING,
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
            tableName: 'tbl_MediaLogDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return mediaLogDetails;
};