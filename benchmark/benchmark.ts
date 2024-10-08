import { BinarySerializer } from "../src/serializer/serializer";
import { Person } from "../src/person";

console.log("Creating objects...");

const person = new Person(
  "Peppe",
  23,
  new Array<number>(1_000_000).fill(1),
);

const lengthTestArray = 10;
const iterations = 10;
const innerIterations = 1;

const personArray = new Array<Person>(lengthTestArray).fill(person);
const jsonArray = new Array<string>(lengthTestArray).fill(
  JSON.stringify(person),
);
const bytesArray = new Array<Buffer>(lengthTestArray).fill(
  BinarySerializer.encode(person),
);

console.log("Starting benchmark...");

function Benchmark(label: string, fn: () => void): number {
  let start = Date.now();

  for (let j = 0; j < iterations; ++j) {
    const startIteration = Date.now();

    for (let i = 0; i < innerIterations; ++i) fn();

    const executionTime = Date.now() - startIteration;

    console.log(`Execution time for ${label}: ${executionTime}ms`);
  }

  return Date.now() - start;
}

const jsonSerTotal = Benchmark("json serializer", () => {
  for (const person of personArray) JSON.stringify(person);
});

console.log("\n");

const binarySerTotal = Benchmark("binary serializer", () => {
  for (const person of personArray) BinarySerializer.encode(person);
});

console.log("\n");

const jsonDeTotal = Benchmark("json deserializer", () => {
  for (const json of jsonArray) JSON.parse(json);
});

console.log("\n");

const binaryDeTotal = Benchmark("binary deserializer", () => {
  for (const bytes of bytesArray) BinarySerializer.decode(bytes);
});

console.log("\n");
console.log(" --------------------------- ");
console.log("\n");

console.log(
  `json serializer \ttotal time ${jsonSerTotal}ms \tavg time: ${
    jsonSerTotal / iterations
  }ms \top/s: ${
    jsonSerTotal / (iterations * innerIterations * lengthTestArray)
  }ms \tencoded size: ${jsonArray[0].length} bytes`,
);

console.log(
  `binary serializer \ttotal time ${binarySerTotal}ms \tavg time: ${
    binarySerTotal / iterations
  }ms \top/s: ${
    binarySerTotal / (iterations * innerIterations * lengthTestArray)
  }ms \t encoded size: ${bytesArray[0].length} bytes`,
);

console.log(
  `json deserializer \ttotal time ${jsonDeTotal}ms \tavg time: ${
    jsonDeTotal / iterations
  }ms \top/s: ${
    jsonDeTotal / (iterations * innerIterations * lengthTestArray)
  }ms`,
);

console.log(
  `binary deserializer \ttotal time ${binaryDeTotal}ms \tavg time: ${
    binaryDeTotal / iterations
  }ms \top/s: ${
    binaryDeTotal / (iterations * innerIterations * lengthTestArray)
  }ms`,
);
