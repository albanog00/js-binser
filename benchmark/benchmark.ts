import { BinarySerializer } from "../src/serializer/serializer";
import { Person } from "../src/person";

const person = new Person("Peppe", 23, [
  0,
  1,
  (1 << 8) - 1,
  -1,
  (1 << 16) - 1,
  Math.pow(2, 31) - 1,
  -Math.pow(2, 16),
  -Math.pow(2, 31) + 1,
]);

console.log("Benchmarking...");

const bytes = BinarySerializer.encode(person).data;
const json = JSON.stringify(person);

console.time("json.serialize");
for (let j = 0; j < 100; ++j)
  for (let i = 0; i < 100_000; ++i) JSON.stringify(person);
console.timeEnd("json.serialize");

console.time("json.deserialize");
for (let j = 0; j < 100; ++j)
  for (let i = 0; i < 100_000; ++i) JSON.parse(json);
console.timeEnd("json.deserialize");

console.time("binary.serialize");
for (let j = 0; j < 100; ++j)
  for (let i = 0; i < 100_000; ++i) BinarySerializer.encode(person);
console.timeEnd("binary.serialize");

console.time("binary.deserialize");
for (let j = 0; j < 100; ++j)
  for (let i = 0; i < 100_000; ++i) BinarySerializer.decode(bytes);
console.timeEnd("binary.deserialize");
