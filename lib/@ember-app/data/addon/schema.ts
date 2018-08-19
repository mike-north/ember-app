import { Schema } from '@orbit/data';

const schemaDefinition = {
  models: {
    moon: {
      attributes: {
        name: { type: 'string' },
      },
      relationships: {
        planet: {
          inverse: 'moons',
          model: 'planet',
          type: 'hasOne' as 'hasOne',
        },
      },
    },
    planet: {
      attributes: {
        classification: { type: 'string' },
        name: { type: 'string' },
      },
      relationships: {
        moons: {
          inverse: 'planet',
          model: 'moon',
          type: 'hasMany' as 'hasMany',
        },
      },
    },
  },
};

const schema = new Schema(schemaDefinition);

export default schema;
