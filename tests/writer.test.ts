import assert = require("node:assert");
import { describe, it } from "node:test";
import { BinaryWriter } from "../src/serializer/writer";

describe("writer tests", () => {
  it("should write uint8 like Buffer", () => {
    const num = 128;
    const writer = new BinaryWriter();
    const buffer = Buffer.alloc(1);

    writer.writeUInt8(num);
    buffer.writeUInt8(num);

    assert.strictEqual(buffer.compare(writer.data), 0);
  });

  it("should write string like Buffer", () => {
    const str = "serialize";
    const writer = new BinaryWriter();
    const buffer = Buffer.alloc(str.length);

    writer.writeString(str);
    buffer.write(str);

    assert.strictEqual(buffer.compare(writer.data), 0);
  });

  it("should write boolean like Buffer", () => {
    const bool = false;
    const writer = new BinaryWriter();
    const buffer = Buffer.alloc(1);

    writer.writeBoolean(bool);
    buffer.writeUint8(bool ? 1 : 0);

    assert.strictEqual(buffer.compare(writer.data), 0);
  });
});
