module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
	  email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	  },
	  firstName: {
		type: Sequelize.STRING,
		allowNull: false
      },
      lastName: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  password: {
		type: Sequelize.STRING,
		allowNull: false,
		len: [8,30]
      },
      avatar: {
          type: Sequelize.BLOB('long')
      }
	});
	
	return User;
}