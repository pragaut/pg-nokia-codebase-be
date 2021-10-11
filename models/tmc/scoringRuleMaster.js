module.exports = function (sequelize, DataTypes) {
    const scoringRuleMaster = sequelize.define('scoringRuleMaster', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        sectionMasterid: DataTypes.STRING,
        criticalityMasterId: DataTypes.STRING,
        observationMasterId: DataTypes.STRING,
        highestScore: DataTypes.NUMERIC,
        actualScore: DataTypes.NUMERIC,
        isHighestScoreApplicable : DataTypes.BOOLEAN,
        isInOperativeRecord : DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_ScoringRuleMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return scoringRuleMaster;
};