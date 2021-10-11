module.exports = function (sequelize, DataTypes) {
    const auditObservationDetails = sequelize.define('auditObservationDetails', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        auditPlanDetailsId: DataTypes.STRING,
        scopeMasterId: DataTypes.STRING,
        auditObservationMasterId: DataTypes.STRING,
        actualScore: DataTypes.DECIMAL,
        maxScore: DataTypes.DECIMAL,
        observationRemarks: DataTypes.STRING,
        observationDate: DataTypes.DATE,
        auditorId: DataTypes.STRING,
        isSubmitted: DataTypes.BOOLEAN, 
        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    },
        {
            tableName: 'tbl_HRA_AuditObservationDetails',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return auditObservationDetails;
};