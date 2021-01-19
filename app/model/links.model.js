module.exports = (sequelize, Sequelize) => {
	const Link = sequelize.define('link', {
      link: {
		type: Sequelize.STRING,
        allowNull: false,
	  },
	  name:
	  {
		type: Sequelize.STRING,
		allowNull: false
	  }
	});
	
	return Link;
}