enum PropertyType {
  number = 0x01,
  string,
  boolean,
  array,
  object,
}

export class BinarySerializer {
  private static notSupported = new Set<string>([
    "undefined",
    "symbol",
    "function",
  ]);

  private static readBuffer(
    buffer: Uint8Array,
    type?: PropertyType,
    start: number = 0,
  ): [number, any] {
    let size: number;
    let index = start;

    switch (type ?? buffer[index++]) {
      case PropertyType.array:
        const array_type = buffer[index++];
        size = (buffer[index + 1] << 8) + buffer[index];
        index += 2;

        const arr = new Array(size);

        for (let i = 0; i < size; ++i) {
          const values = this.readBuffer(buffer, array_type, index);

          index += values[0];
          arr[i] = values[1];
        }

        return [index - start, arr];

      case PropertyType.object:
        size = (buffer[index + 1] << 8) + buffer[index];
        index += 2;
        const obj = {};

        for (let i = 0; i < size; ++i) {
          const type = buffer[index++];
          const prop_name_size = buffer[index++];
          const string_buffer = Array<string>(prop_name_size);

          for (let j = 0; j < prop_name_size; ++j) {
            string_buffer[j] = String.fromCharCode(buffer[index++]);
          }
          const prop_name = string_buffer.join("");

          const values = this.readBuffer(buffer, type, index);

          index += values[0];
          obj[prop_name] = values[1];
        }

        return [index - start, obj];

      case PropertyType.boolean:
        return [1, buffer[index] == 1];

      case PropertyType.string:
        size = (buffer[index + 1] << 8) + buffer[index];
        index += 2;

        const string_buffer = new Array<string>(size);
        for (let i = 0; i < size; ++i) {
          string_buffer.push(String.fromCharCode(buffer[index++]));
        }

        return [index - start, string_buffer.join("")];

      case PropertyType.number:
        size = buffer[index++];
        let value: number = 0;

        for (let i = size - 1; i >= 0; --i) {
          if (buffer[index + i] !== 0) value = (value << 8) | buffer[index + i];
        }

        if (size > 1 && buffer[index] == 0) value = ~value;

        return [size + 1, value];
    }
  }

  static decode<T>(buffer: Uint8Array) {
    return this.readBuffer(buffer)[1] as T;
  }

  private static appendPropName(name: any, buffer: number[]) {
    buffer.push(name.length);
    for (let i = 0; i < name.length; ++i) {
      buffer.push(name.charCodeAt(i));
    }
  }

  private static writeString(
    obj: string,
    buffer: number[],
    key?: string,
    objIsArray: boolean = false,
  ) {
    if (!objIsArray) {
      buffer.push(PropertyType.string);
      if (key) this.appendPropName(key, buffer);
    }

    buffer.push(obj.length & 0xff);
    buffer.push(obj.length >> 8);

    for (let i = 0; i < obj.length; ++i) {
      buffer.push(obj.charCodeAt(i));
    }
  }

  private static writeBoolean(
    obj: boolean,
    buffer: number[],
    key?: string,
    objIsArray: boolean = false,
  ) {
    if (!objIsArray) {
      buffer.push(PropertyType.boolean);
      if (key) this.appendPropName(key, buffer);
    }

    buffer.push(obj ? 1 : 0);
  }

  private static writeNumber(
    obj: number,
    buffer: number[],
    key?: string,
    objIsArray: boolean = false,
  ) {
    let copy: number = obj;
    const values: number[] = [];
    let atLeastSize = 1;

    if (!objIsArray) {
      buffer.push(PropertyType.number);
      if (key) this.appendPropName(key, buffer);
    }

    // If value < 0 append 0 at the start of the buffer to recognize
    // that is a negative number
    if (copy < 0) {
      values.push(0);
      copy = ~copy;
      ++atLeastSize;
    }

    // FIXME: Doesn't work with values > 2 ^ 31 - 1 or < 2 ^ 31
    while (values.length < atLeastSize || copy > 0) {
      values.push(copy & 0xff);
      copy >>= 8;
    }

    buffer.push(values.length);
    for (const val of values) buffer.push(val);
  }

  private static writeBuffer(
    obj: any,
    buffer: number[],
    key?: string,
    objIsArray: boolean = false,
  ) {
    if (obj === undefined || this.notSupported.has(typeof obj)) return;

    switch (typeof obj) {
      case "object":
        if (obj instanceof Array) {
          buffer.push(PropertyType.array);

          if (!objIsArray && key) {
            this.appendPropName(key, buffer);
          }

          buffer.push(PropertyType[typeof obj[0]]);
          buffer.push(obj.length & 0xff);
          buffer.push(obj.length >> 8);

          for (const element of obj) {
            this.writeBuffer(element, buffer, undefined, true);
          }
        } else {
          buffer.push(PropertyType.object);

          if (!objIsArray && key) {
            this.appendPropName(key, buffer);
          }

          const props = Object.keys(obj).filter(
            (x) => !this.notSupported.has(typeof x),
          );

          buffer.push(props.length & 0xff);
          buffer.push(props.length >> 8);

          for (const prop of props) {
            this.writeBuffer(obj[prop], buffer, prop);
          }
        }
        break;

      case "string":
        this.writeString(obj, buffer, key, objIsArray);
        break;

      case "boolean":
        this.writeBoolean(obj, buffer, key, objIsArray);
        break;

      case "number":
        this.writeNumber(obj, buffer, key, objIsArray);
        break;

      default:
        break;
    }
  }

  static encode(obj: any): Uint8Array {
    if (this.notSupported.has(typeof obj)) return;

    const buffer: number[] = [];

    this.writeBuffer(obj, buffer);

    return new Uint8Array(buffer);
  }
}
