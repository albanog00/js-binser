import { describe, it } from "node:test";
import assert = require("node:assert");
import { BinaryWriter } from "../src/serializer/writer";

describe("writer tests", () => {
  it("should write uint8 like Buffer", () => {
    const writer = new BinaryWriter();
    writer.writeUInt8(128);
    assert.ok(Buffer.from([128]).compare(writer.data));
  });
});
