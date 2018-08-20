import { OrbitRecord } from '@ember-app/data/schema';

export interface BaseObject {
  readonly name: string;
  readonly path: Readonly<string[]>;
  readonly pathString: string;
}

export type SuccessResult<T> = ['ok', T];
export type ErrorResult = ['error', any];
export type SaveResult<T> = SuccessResult<T> | ErrorResult;

export abstract class RecordObject<T extends OrbitRecord, J> {
  constructor(protected record: T) {}
  public abstract async save(): Promise<SaveResult<T>>;
  public abstract toJSON(): J;
}
