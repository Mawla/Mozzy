// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  global.ArrayBuffer = ArrayBuffer;
  global.Uint8Array = Uint8Array;
}

if (typeof global.fetch === "undefined") {
  const fetch = require("node-fetch").default;
  const { Headers, Request, Response } = require("node-fetch");

  global.fetch = fetch;
  global.Headers = Headers;
  global.Request = Request;
  global.Response = Response;
}

// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "test-uuid",
  },
});
