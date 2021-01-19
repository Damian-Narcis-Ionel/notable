module.exports = (sequelize, Sequelize) => {
	const Note = sequelize.define('note', {
      content: {
		type: Sequelize.BLOB('long'),
		allowNull: false
	  },
	  type:
	  {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  name:
	  {
		type: Sequelize.STRING,
		allowNull: false
	  }
	}, { timestamps: false });
	
	return Note;
}