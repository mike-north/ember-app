import { JSONObject } from 'ts-std';

export default abstract class BaseSerializer<T, J > {
  abstract fromJSON(val: J): T;
  abstract toJSON(val: T): J;
}
