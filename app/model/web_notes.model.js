module.exports = (sequelize, Sequelize) => {
	const WebNote = sequelize.define('web_note', {
      content: {
		type: Sequelize.TEXT,
        allowNull: false,
        default: ""
	  },
	  name:
	  {
		type: Sequelize.STRING,
		allowNull: false
	  }
	});
	
	return WebNote;
}