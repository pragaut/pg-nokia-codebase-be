module.exports = function (sequelize, DataTypes) {
    const sectionMaster = sequelize.define('sectionMaster', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        sectionName: DataTypes.STRING,
        sectionCode: DataTypes.STRING,
        auditTypeId: DataTypes.STRING,
        barColor: DataTypes.STRING,
        sectionOrder: DataTypes.NUMERIC,
        isMandatorySection: DataTypes.BOOLEAN,
        isInOperativeRecord: DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_SectionMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return sectionMaster;
};