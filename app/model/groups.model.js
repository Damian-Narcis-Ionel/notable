module.exports = (sequelize, Sequelize) => {
	const Group = sequelize.define('group', {
	  group_name: {
		type: Sequelize.STRING,
		allowNull: false
      }
	}, { timestamps: false });
	
	return Group;
}