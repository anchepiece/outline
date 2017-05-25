import { User, Team, Atlas, Document } from '../models';
import { sequelize } from '../sequelize';

export function flushdb() {
  const sql = sequelize.getQueryInterface();
  const tables = Object.keys(sequelize.models).map(model =>
    sql.quoteTable(sequelize.models[model].getTableName())
  );
  const query = `TRUNCATE ${tables.join(', ')} CASCADE`;

  return sequelize.query(query);
}

const seed = async () => {
  const team = await Team.create({
    name: 'Test Team',
  });

  const user = await User.create({
    id: '86fde1d4-0050-428f-9f0b-0bf77f8bdf61',
    email: 'user1@example.com',
    username: 'user1',
    name: 'User 1',
    password: 'test123!',
    teamId: team.id,
    slackId: '123',
    slackData: {
      image_192: 'http://example.com/avatar.png',
    },
  });

  const atlas = await Atlas.create({
    name: 'Collection',
    type: 'atlas',
    creatorId: user.id,
    teamId: team.id,
  });

  const document = await Document.create({
    atlasId: atlas.id,
    userId: user.id,
    lastModifiedById: user.id,
    createdById: user.id,
    teamId: team.id,
    title: 'Title',
    text: 'Content',
  });

  return { document, atlas, user, team };
};

export { seed, sequelize };
