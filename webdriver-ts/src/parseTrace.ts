import { cpuBenchmarkInfos } from "./benchmarksCommon.js";
import { BenchmarkOptions, config, initializeFrameworks } from "./common.js";
import { computeResultsCPU, parseCPUTrace, PlausibilityCheck } from "./timeline.js";

async function debugSingle() {
  let values = [];
  // for (let i = 0; i < 12; i++) {
  const trace = `unittests/dojo-v8.0.0-keyed_02_replace1k_0.json`;
  // const trace = `traces/alpine-v3.12.0-keyed_07_create10k_${i}.json`;
  // const trace = `traces/alpine-v3.12.0-keyed_07_create10k_0.jsontraces/1more-v0.1.18-keyed_01_run1k_0.json`;
  // const trace = `traces/alpine-v3.12.0-keyed_07_create10k_0.json`;
  // const trace = `traces/arrowjs-v1.0.0-alpha.9-keyed_07_create10k_0.json`;
  // const trace = `traces/better-react-v1.1.3-keyed_04_select1k_1.json`;
  // const trace = `traces/1more-v0.1.18-keyed_01_run1k_0.json`;
  console.log("analyzing trace ", trace);
  const cpuTrace = await computeResultsCPU(trace);
  console.log(trace, cpuTrace);
  values.push(cpuTrace.duration);
  // console.log(trace, await computeResultsJS(cpuTrace, config, trace, DurationMeasurementMode.LAST_PAINT))
  // }
  console.log(values);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function debugAll() {
  let benchmarkOptions: BenchmarkOptions = {
    port: 8080,
    host: "localhost",
    browser: "chrome",
    remoteDebuggingPort: 9999,
    chromePort: 9998,
    headless: true,
    chromeBinaryPath: undefined,
    numIterationsForCPUBenchmarks:
      config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
    numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
    numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
    batchSize: 1,
    resultsDirectory: "results",
    tracesDirectory: "traces",
    allowThrottling: false,
  };

  let frameworks = await initializeFrameworks(benchmarkOptions);
  let cpuCPUBenchmarks = Object.values(cpuBenchmarkInfos);
  let plausibilityCheck = new PlausibilityCheck();
  for (let framework of frameworks) {
    for (let benchmarkInfo of cpuCPUBenchmarks) {
      await parseCPUTrace(benchmarkOptions, framework, benchmarkInfo, plausibilityCheck);
    }
  }
  plausibilityCheck.print();
}

debugSingle()
  .then(() => console.log("done"))
  .catch((err) => console.log(err));
