import { BinarySerializer } from "./serializer/serializer";
import { Person } from "./person";

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

const buffer = BinarySerializer.encode(person);
console.log(buffer);

const obj = BinarySerializer.decode<Person>(buffer);
console.log(obj);
