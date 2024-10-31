import assert = require("node:assert");
import { describe, it } from "node:test";
import { Person } from "../src/person";
import { BinarySerializer } from "../src/serializer/serializer";

describe("reader tests", () => {
	it("should serialize and deserialize object correctly", () => {
		const obj = new Person("Peppe", 23, new Array<number>(100).fill(1));
		const ser = BinarySerializer.encode(obj);
		const des = BinarySerializer.decode<Person>(ser);

		assert.strictEqual(obj.age, des.age);
		assert.strictEqual(obj.name, des.name);
		assert.strictEqual(obj.isAdult, des.isAdult);
		assert.deepStrictEqual(obj.grades, des.grades);
	});
});
