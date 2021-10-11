module.exports = function (sequelize, DataTypes) {
    const otp = sequelize.define('dueDaysMaster', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        category: DataTypes.STRING,
        dueDay: DataTypes.INTEGER,
        dueDate:DataTypes.STRING,
        description: DataTypes.STRING,

        active: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING
    },
        {
            tableName: 'tbl_ICR_DueDaysMaster',
            classMethods: {
                associate: function (Models) {
                    // associations can be defined here
                }
            }
        });

    return otp;
};