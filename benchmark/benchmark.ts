import { BinarySerializer } from "../src/serializer/serializer";
import { Person } from "../src/person";

console.log("Initializing objects...");

const iterations = 10;
const inner_iterations = 10;

const obj = new Person("Peppe", 23, new Array<number>(1_000_000).fill(1));
const json = JSON.stringify(obj);
const bytes = BinarySerializer.encode(obj);

function benchmark(label: string, fn: () => void): number {
	let total_execution_time = 0;
	for (let j = 0; j < iterations; ++j) {
		const start_iteration = Date.now();
		for (let i = 0; i < inner_iterations; ++i) {
			fn();
		}

		const execution_time = Date.now() - start_iteration;
		console.log(`Execution time for ${label}: ${execution_time}ms`);
		total_execution_time += execution_time;
	}
	return total_execution_time;
}

function logTimings(label: string, total: number) {
	console.log(
		`${label} \ttotal time ${total}ms \tavg time: ${
			total / iterations
		}ms \top/s: ${(1000 / (total / (iterations * inner_iterations))).toFixed(2)} ${
			label[label.indexOf(" ") + 1] === "s"
				? `\tencoded size: ${
						label[0] === "j" ? json.length : bytes.buffer.byteLength
					} bytes`
				: ""
		}`,
	);
}

console.log("Starting benchmark...");

console.log();
const json_ser_total = benchmark("json serializer", () => {
	JSON.stringify(obj);
});

console.log();
const binary_ser_total = benchmark("binary serializer", () => {
	BinarySerializer.encode(obj);
});

console.log();
const json_de_total = benchmark("json deserializer", () => {
	JSON.parse(json);
});

console.log();
const binary_de_total = benchmark("binary deserializer", () => {
	BinarySerializer.decode(bytes);
});

console.log("\n ---------------------------- \n");

logTimings("json serializer", json_ser_total);
logTimings("binary serializer", binary_ser_total);
logTimings("json deserializer", json_de_total);
logTimings("binary deserializer", binary_de_total);
