import { BinaryReader } from "./reader";
import { BinaryWriter } from "./writer";

enum PropertyType {
  number = 0x01,
  string,
  boolean,
  array,
  object,
}

export class BinarySerializer {
  private static readBuffer(buffer: BinaryReader, type?: PropertyType): any {
    if (!type) type = buffer.readUInt8();

    switch (type) {
      case PropertyType.array:
        const array_type = buffer.readUInt8();
        var size = buffer.readUInt16BE();
        const arr = new Array(size);

        for (let i = 0; i < size; ++i) {
          arr[i] = this.readBuffer(buffer, array_type);
        }

        return arr;

      case PropertyType.object:
        var size = buffer.readUInt16BE();
        const obj = {};

        for (let i = 0; i < size; ++i) {
          const type = buffer.readUInt8();
          const prop_name_size = buffer.readUInt8();
          const prop_name = buffer.readString(prop_name_size);
          obj[prop_name] = this.readBuffer(buffer, type);
        }

        return obj;

      case PropertyType.boolean:
        return buffer.readBoolean();

      case PropertyType.string:
        var size = buffer.readUInt16BE();
        const val = buffer.readString(size);
        return val;

      case PropertyType.number:
        return buffer.readInt32BE();

      default:
        return undefined;
    }
  }

  static decode<T>(buffer: Buffer) {
    return this.readBuffer(new BinaryReader(buffer)) as T;
  }

  private static appendInfo(
    buf: BinaryWriter,
    type: PropertyType,
    obj_is_array: boolean,
    key?: string,
  ) {
    if (!obj_is_array) {
      buf.writeUInt8(type);
      if (key) {
        buf.writeUInt8(key.length);
        buf.writeString(key);
      }
    }
  }

  private static writeBuffer(
    buf: BinaryWriter,
    obj: any,
    key?: string,
    obj_is_array: boolean = false,
    nested_level: number = 0,
  ) {
    switch (typeof obj) {
      case "object":
        if (obj instanceof Array) {
          this.appendInfo(buf, PropertyType.array, obj_is_array, key);
          buf.writeUInt8(PropertyType[typeof obj[0]]);
          buf.writeUInt16BE(obj.length);

          for (const element of obj)
            this.writeBuffer(buf, element, undefined, true);

          break;
        } else {
          if (nested_level === 3) return undefined;

          const props = Object.keys(obj);

          this.appendInfo(buf, PropertyType.object, obj_is_array, key);
          buf.writeUInt16BE(props.length);

          for (const prop of props)
            this.writeBuffer(buf, obj[prop], prop, false, nested_level + 1);

          break;
        }

      case "string":
        this.appendInfo(buf, PropertyType.string, obj_is_array, key);
        buf.writeUInt16BE(obj.length);
        buf.writeString(obj);

        break;

      case "boolean":
        this.appendInfo(buf, PropertyType.boolean, obj_is_array, key);
        buf.writeBoolean(obj);

        break;

      case "number":
        this.appendInfo(buf, PropertyType.number, obj_is_array, key);
        buf.writeInt32BE(obj);

        break;
    }

    return buf;
  }

  static encode(obj: any): Buffer | undefined {
    const buf = new BinaryWriter();
    this.writeBuffer(buf, obj);
    return buf.data;
  }
}
