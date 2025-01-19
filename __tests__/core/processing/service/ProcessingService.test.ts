import { ProcessingService } from "@/app/core/processing/service/ProcessingService";
import {
  ProcessingAdapter,
  ProcessingOptions,
  ProcessingResult,
  ProcessingFormat,
  ProcessingStatus,
} from "@/app/core/processing/types";

// Mock adapter implementation
class MockAdapter implements ProcessingAdapter {
  mockValidate = jest.fn();
  mockProcess = jest.fn();
  mockGetStatus = jest.fn();

  async validate(input: string): Promise<boolean> {
    return this.mockValidate(input);
  }

  async process(
    input: string,
    options: ProcessingOptions
  ): Promise<ProcessingResult> {
    return this.mockProcess(input, options);
  }

  async getStatus(id: string): Promise<ProcessingResult> {
    return this.mockGetStatus(id);
  }
}

describe("ProcessingService", () => {
  let service: ProcessingService;
  let mockPodcastAdapter: MockAdapter;
  let mockPostAdapter: MockAdapter;

  beforeEach(() => {
    mockPodcastAdapter = new MockAdapter();
    mockPostAdapter = new MockAdapter();
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
    const validInput = "valid input";
    const options: ProcessingOptions = {
      format: "post",
      quality: "draft",
      analyzeSentiment: true,
      extractEntities: true,
    };

    it("should validate input before processing", async () => {
      mockPostAdapter.mockValidate.mockResolvedValue(true);
      mockPostAdapter.mockProcess.mockResolvedValue({
        id: "123",
        status: "completed" as ProcessingStatus,
        output: "processed",
        metadata: {
          format: "post",
          platform: "default",
          processedAt: expect.any(String),
        },
      });

      await service.process("post", validInput, options);
      expect(mockPostAdapter.mockValidate).toHaveBeenCalledWith(validInput);
    });

    it("should throw error for invalid input", async () => {
      mockPostAdapter.mockValidate.mockResolvedValue(false);

      const result = await service.process("post", validInput, options);
      expect(result.status).toBe("failed" as ProcessingStatus);
      expect(result.error).toBe("Invalid input");
    });

    it("should process valid input", async () => {
      const expectedResult: ProcessingResult = {
        id: "123",
        status: "completed" as ProcessingStatus,
        output: "processed",
        metadata: {
          format: "post",
          platform: "default",
          processedAt: new Date().toISOString(),
        },
      };

      mockPostAdapter.mockValidate.mockResolvedValue(true);
      mockPostAdapter.mockProcess.mockResolvedValue(expectedResult);

      const result = await service.process("post", validInput, options);
      expect(result).toEqual(expectedResult);
      expect(mockPostAdapter.mockProcess).toHaveBeenCalledWith(
        validInput,
        options
      );
    });

    it("should handle processing errors", async () => {
      mockPostAdapter.mockValidate.mockResolvedValue(true);
      mockPostAdapter.mockProcess.mockRejectedValue(
        new Error("Processing failed")
      );

      const result = await service.process("post", validInput, options);
      expect(result.status).toBe("failed" as ProcessingStatus);
      expect(result.error).toBe("Processing failed");
    });
  });

  describe("getStatus", () => {
    it("should return processing status", async () => {
      const expectedStatus: ProcessingResult = {
        id: "123",
        status: "completed" as ProcessingStatus,
        output: "",
        metadata: {
          format: "post",
          platform: "default",
          processedAt: new Date().toISOString(),
        },
      };

      mockPostAdapter.mockGetStatus.mockResolvedValue(expectedStatus);

      const result = await service.getStatus("post", "123");
      expect(result).toEqual(expectedStatus);
      expect(mockPostAdapter.mockGetStatus).toHaveBeenCalledWith("123");
    });

    it("should handle status check errors", async () => {
      mockPostAdapter.mockGetStatus.mockRejectedValue(
        new Error("Status check failed")
      );

      await expect(service.getStatus("post", "123")).rejects.toThrow(
        "Status check failed"
      );
    });
  });
});
