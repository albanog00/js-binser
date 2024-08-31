import assert = require("node:assert");
import { describe, it } from "node:test";
import { BinaryWriter } from "../src/serializer/writer";

describe("writer tests", () => {
  it("should write uint8 like Buffer", () => {
    const writer = new BinaryWriter();
    const buffer = Buffer.alloc(1);

    writer.writeUInt8(128);
    buffer.writeUInt8(128);

    assert.equal(buffer.compare(writer.data), 0);
  });
});
