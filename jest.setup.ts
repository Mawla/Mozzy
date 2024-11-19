// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

if (typeof global.TextEncoder === "undefined") {
  const util = require("util");
  global.TextEncoder = util.TextEncoder;
  global.TextDecoder = util.TextDecoder;
  global.ArrayBuffer = ArrayBuffer;
  global.Uint8Array = Uint8Array;
}

if (typeof global.fetch === "undefined") {
  const nodeFetch = require("node-fetch");
  global.fetch = nodeFetch;
  global.Headers = nodeFetch.Headers;
  global.Request = nodeFetch.Request;
  global.Response = nodeFetch.Response;
}
