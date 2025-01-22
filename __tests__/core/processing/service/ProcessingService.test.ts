import { ProcessingService } from "@/app/core/processing/service/ProcessingService";
import type {
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingResult,
  ProcessingState,
  ProcessingStatus,
  ProcessingFormat,
} from "@/app/types/processing";

// Create mock result
const createMockResult = (overrides = {}): ProcessingResult => ({
  id: "test-id",
  status: "completed" as ProcessingStatus,
  success: true,
  output: "test output",
  metadata: {
    format: "post" as ProcessingFormat,
    platform: "test",
    processedAt: new Date().toISOString(),
  },
  format: "post" as ProcessingFormat,
  analysis: {
    title: "Test",
    summary: "Test summary",
  },
  entities: {
    people: [],
    organizations: [],
    locations: [],
    events: [],
  },
  timeline: [],
  ...overrides,
});

// Mock adapter implementation
const mockAdapter: ProcessingAdapter = {
  validate: jest.fn().mockResolvedValue(true),
  process: jest.fn().mockResolvedValue(createMockResult()),
  getStatus: jest.fn().mockResolvedValue(createMockResult()),
};

describe("ProcessingService", () => {
  let service: ProcessingService;
  let mockPodcastAdapter: jest.Mocked<ProcessingAdapter>;
  let mockPostAdapter: jest.Mocked<ProcessingAdapter>;

  beforeEach(() => {
    mockPodcastAdapter = {
      validate: jest.fn(),
      process: jest.fn(),
      getStatus: jest.fn(),
    };
    mockPostAdapter = {
      validate: jest.fn(),
      process: jest.fn(),
      getStatus: jest.fn(),
    };
    service = new ProcessingService();
    service.registerAdapter("podcast", mockPodcastAdapter);
    service.registerAdapter("post", mockPostAdapter);
  });

  describe("adapter registration", () => {
    const defaultOptions: ProcessingOptions = {
      format: "post",
      quality: "draft",
    };

    it("should register adapters correctly", () => {
      expect(() =>
        service.process("podcast", "test", {
          ...defaultOptions,
          format: "podcast",
        })
      ).not.toThrow();
      expect(() =>
        service.process("post", "test", { ...defaultOptions, format: "post" })
      ).not.toThrow();
    });

    it("should throw error for unregistered format", async () => {
      await expect(
        service.process("invalid" as ProcessingFormat, "test", {
          ...defaultOptions,
          format: "invalid" as ProcessingFormat,
        })
      ).rejects.toThrow("No adapter registered for format: invalid");
    });
  });

  describe("process", () => {
    const validInput = "test input";
    const options: ProcessingOptions = {
      format: "post" as ProcessingFormat,
      quality: "draft",
    };

    it("should validate input before processing", async () => {
      mockPostAdapter.validate.mockResolvedValue(true);
      mockPostAdapter.process.mockResolvedValue(createMockResult());

      await service.process("post", validInput, options);
      expect(mockPostAdapter.validate).toHaveBeenCalledWith(validInput);
    });

    it("should throw error for invalid input", async () => {
      mockPostAdapter.validate.mockResolvedValue(false);

      const result = await service.process("post", validInput, options);
      expect(result.status).toBe("error");
    });

    it("should process valid input", async () => {
      const expectedResult = createMockResult();

      mockPostAdapter.validate.mockResolvedValue(true);
      mockPostAdapter.process.mockResolvedValue(expectedResult);

      const result = await service.process("post", validInput, options);
      expect(result).toEqual(expectedResult);
      expect(mockPostAdapter.process).toHaveBeenCalledWith(validInput, options);
    });

    it("should handle processing errors", async () => {
      mockPostAdapter.validate.mockResolvedValue(true);
      mockPostAdapter.process.mockRejectedValue(new Error("Processing failed"));

      const result = await service.process("post", validInput, options);
      expect(result.status).toBe("error");
    });
  });

  describe("getStatus", () => {
    it("should return processing status", async () => {
      const expectedStatus = createMockResult();

      mockPostAdapter.getStatus.mockResolvedValue(expectedStatus);

      const result = await service.getStatus("post", "123");
      expect(result).toEqual(expectedStatus);
      expect(mockPostAdapter.getStatus).toHaveBeenCalledWith("123");
    });

    it("should handle status check errors", async () => {
      mockPostAdapter.getStatus.mockRejectedValue(
        new Error("Status check failed")
      );

      const result = await service.getStatus("post", "123");
      expect(result.status).toBe("error");
    });
  });
});
