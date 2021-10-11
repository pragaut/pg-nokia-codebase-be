module.exports = function (sequelize, DataTypes) {
    const supportingDocumentMaster = sequelize.define('supportingDocumentMaster', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },

        documentCategoryId: DataTypes.STRING,
        documentName: DataTypes.STRING,
		documentCode: DataTypes.STRING,
        order: DataTypes.INTEGER,
        isMandatory: DataTypes.BOOLEAN,
        fileRequiredType: DataTypes.STRING, 
        active : DataTypes.BOOLEAN,
        createdBy :DataTypes.STRING,
        updatedBy :DataTypes.STRING
    },
        {
            tableName: 'tbl_SupportingDocumentMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return supportingDocumentMaster;
};