export default abstract class BaseSerializer<T, J> {
  public abstract fromJSON(val: J): T;
  public abstract toJSON(val: T): J;
}
