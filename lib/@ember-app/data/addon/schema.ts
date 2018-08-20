import { Schema } from '@orbit/data';
import { JSONValue } from 'ts-std';

interface SchemaRegistry {
  file: FileSchema;
  project: ProjectSchema;
}

interface OrbitSchema {
  attributes: {
    [k: string]: {
      type: 'string' | 'number' | 'boolean';
    };
  };
  keys: { [k: string]: JSONValue };
  relationships: {
    [k: string]: {
      inverse: any;
      model: keyof SchemaRegistry;
      type: 'hasMany' | 'hasOne';
    };
  };
}

export type OrbitRecordAttributes<
  A extends { [k: string]: any } = {}
> = keyof A extends never
  ? {}
  : {
      attributes: { [K in keyof A]: A[K] };
    };

export type OrbitRecordRelationships<
  R extends { [k: string]: { type: 'hasMany' | 'hasOne' } } = {}
> = keyof R extends never
  ? {}
  : {
      relationships: {
        [K in keyof R]: {
          data: R[K]['type'] extends 'hasMany'
            ? (Array<{ type: string; id: string }>)
            : { type: string; id: string };
        }
      };
    };

// tslint:disable-next-line:max-line-length
export type OrbitRecord<
  A extends { [k: string]: any } = {},
  R extends { [k: string]: { type: 'hasMany' | 'hasOne' } } = {}
> = {
  type: keyof SchemaRegistry;
  id: string;
} & OrbitRecordRelationships<R> &
  OrbitRecordAttributes<A>;

export interface FileRecord
  extends OrbitRecord<
      { name: string; contents: string },
      { project: { type: 'hasOne' } }
    > {}
export interface ProjectRecord
  extends OrbitRecord<{ name: string }, { files: { type: 'hasMany' } }> {}

interface FileSchema extends OrbitSchema {
  attributes: { name: { type: 'string' } };
  keys: { remoteId: {} };
  relationships: {
    project: {
      inverse: 'files';
      model: 'project';
      type: 'hasOne';
    };
  };
}

interface ProjectSchema extends OrbitSchema {
  attributes: {
    contents: { type: 'string' };
    path: { type: 'string' };
  };
  keys: { remoteId: {} };
  relationships: {
    files: {
      inverse: 'project';
      model: 'file';
      type: 'hasMany';
    };
  };
}

const fileSchema: FileSchema = {
  attributes: { name: { type: 'string' } },
  keys: { remoteId: {} },
  relationships: {
    project: {
      inverse: 'files',
      model: 'project',
      type: 'hasOne' as 'hasOne',
    },
  },
};

const projectSchema: ProjectSchema = {
  attributes: {
    contents: { type: 'string' },
    path: { type: 'string' },
  },
  keys: { remoteId: {} },
  relationships: {
    files: {
      inverse: 'project',
      model: 'file',
      type: 'hasMany' as 'hasMany',
    },
  },
};

const schemaDefinition = {
  models: {
    file: fileSchema,
    project: projectSchema,
  },
};

const schema = new Schema(schemaDefinition);

export default schema;
