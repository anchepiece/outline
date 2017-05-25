// @flow
import { DataTypes, sequelize } from '../sequelize';

const Star = sequelize.define(
  'star',
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
      },
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'documents',
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'documentId'],
      },
    ],
  }
);

export default Star;
