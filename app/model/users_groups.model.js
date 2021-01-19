module.exports = (sequelize, Sequelize) => {
	const UsersGroup = sequelize.define('users_groups', {
	  role: {
		type: Sequelize.STRING,
		allowNull: false,
		isIn: {
            args: [['admin', 'moderator','member']]
        }
      },
	}, { timestamps: false });
	
	return UsersGroup;
}