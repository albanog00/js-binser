import { BinarySerializer } from "../src/binary-serializer";
import { Person } from "../src/person";

console.log("Benchmark...");

const person = new Person("Peppe", 23, [
  0,
  1,
  (1 << 8) - 1,
  (1 << 16) - 1,
  (1 << 31) - 1,
  -(1 << 16) + 1,
  -(1 << 31) + 1,
]);

const json = JSON.stringify(person);
const bytes = BinarySerializer.encode(person);

console.time("json.serialize");
for (let i = 0; i < 10_000_000; ++i) JSON.stringify(person);
console.timeEnd("json.serialize");

console.time("binary.serialize");
for (let i = 0; i < 10_000_000; ++i) BinarySerializer.encode(person);
console.timeEnd("binary.serialize");

console.time("json.deserialize");
for (let i = 0; i < 10_000_000; ++i) JSON.parse(json);
console.timeEnd("json.deserialize");

console.time("binary.deserialize");
for (let i = 0; i < 10_000_000; ++i) BinarySerializer.decode(bytes);
console.timeEnd("binary.deserialize");
