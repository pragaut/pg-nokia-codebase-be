module.exports = function (sequelize, DataTypes) {
    const subSectionMaster = sequelize.define('subSectionMaster', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        subSectionName: DataTypes.STRING,
        subSectionCode: DataTypes.STRING,
        sectionMasterId: DataTypes.STRING,
        subSectionOrder: DataTypes.NUMERIC,
        isInOperativeRecord:DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_SubSectionMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return subSectionMaster;
};