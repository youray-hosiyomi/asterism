export class Value<V> {
  protected val: V;
  constructor(val: V) {
    this.val = val;
  }
  getVal(): V {
    return this.val;
  }
  setVal(val: V) {
    this.val = val;
  }
}

export class NullableValue<V> extends Value<V | null> {
  constructor(val: V | null = null) {
    super(val);
  }
  getValOr(ifNullValue: V): V {
    if (this.val) {
      return this.val;
    } else {
      return ifNullValue;
    }
  }
  map<T>(handler: (val: V) => T): NullableValue<T> {
    if (this.val) {
      return new NullableValue(handler(this.val));
    } else {
      return new NullableValue();
    }
  }
  mapOr<T>(handler: (val: V) => T, ifNullValue: T): T {
    if (this.val) {
      return handler(this.val);
    } else {
      return ifNullValue;
    }
  }
}
