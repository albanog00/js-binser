import assert = require("node:assert");
import { describe, it } from "node:test";
import { BinaryReader } from "../src/serializer/reader";

describe("reader tests", () => {
  it("should read uint8 correctly", () => {
    const expected = 128;
    const num = 128;
    const buf = Buffer.alloc(1);
    buf.writeUint8(num);

    const reader = new BinaryReader(buf);
    const actual = reader.readUInt8();

    assert.strictEqual(actual, expected);
  });

  it("should read string correctly", () => {
    const expected = "deserialize";
    const str = "deserialize";
    const buf = Buffer.alloc(str.length);
    buf.write(str);

    const reader = new BinaryReader(buf);
    const actual = reader.readString(str.length);

    assert.strictEqual(actual, expected);
  });

  it("should read boolean", () => {
    const expected = false;
    const bool = false;
    const buf = Buffer.alloc(1);
    buf.writeUint8(bool ? 1 : 0);

    const reader = new BinaryReader(buf);
    const actual = reader.readBoolean();

    assert.strictEqual(actual, expected);
  });
});
