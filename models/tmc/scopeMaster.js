module.exports = function (sequelize, DataTypes) {
    const scopeMaster = sequelize.define('scopeMaster', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        sectionMasterId: DataTypes.STRING,
        subSectionMasterId: DataTypes.STRING,
        auditModeMasterId: DataTypes.STRING,
        criticalityMasterId: DataTypes.STRING,
        question: DataTypes.STRING,
        expectedStandard: DataTypes.STRING,
        referenceDocumentToBeChecked: DataTypes.STRING,
        maxScore: DataTypes.DECIMAL,
        scopeOrder: DataTypes.DECIMAL,
        scopeStartDate: DataTypes.DATE,
        isScopeClosed: DataTypes.BOOLEAN,
        scopeClosureDate: DataTypes.DATE,
        scopeClosureRemarks: DataTypes.STRING, 
        scopeNumber: DataTypes.STRING,
        scopeSequence: DataTypes.INTEGER,
        multiObservationMasterId: DataTypes.STRING, 
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_ScopeMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return scopeMaster;
};