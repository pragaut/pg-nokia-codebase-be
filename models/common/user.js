module.exports = function (sequelize, DataTypes) {
	const user = sequelize.define('user', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		Code: DataTypes.STRING,
		title: DataTypes.STRING,
		firstName: DataTypes.STRING,
		lastName: DataTypes.STRING,
		plantMasterId: DataTypes.STRING,
		departmentMasterId: DataTypes.STRING,

		city: DataTypes.STRING,
		state: DataTypes.STRING,

		mobile: DataTypes.STRING,
		email: DataTypes.STRING,
		mobileConfirmed: DataTypes.BOOLEAN,
		emailConfirmed: DataTypes.BOOLEAN,
		userName: DataTypes.STRING,
		password: DataTypes.STRING,
		passwordSalt: DataTypes.STRING,

		reconciliation_session_id: DataTypes.STRING,
		isActive: DataTypes.BOOLEAN,

		active: DataTypes.BOOLEAN,
		createdBy: DataTypes.STRING,
		updatedBy: DataTypes.STRING
	},
		{
			tableName: 'tbl_UserDetails',
			classMethods: {
				associate: function (Models) {
					// associations can be defined here
				}
			}
		});

	return user;
};