module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('stars', {
      id: {
        type: 'UUID',
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: 'UUID',
        allowNull: false,
      },
      documentId: {
        type: 'UUID',
        allowNull: false,
      },
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('stars');
  },
};
