import { postService } from "../app/services/postService";
import { Template } from "../app/types/template";
import * as AnthropicActions from "@/app/actions/anthropicActions";

// Mock the AnthropicActions module
jest.mock("@/app/actions/anthropicActions");

describe("postService", () => {
  describe("shortlistTemplatesByTags", () => {
    const mockTemplates: Template[] = [
      {
        id: "1",
        name: "Template 1",
        description: "Desc 1",
        body: "Body 1",
        emoji: "😀",
        tags: ["tag1", "tag2"],
      },
      {
        id: "2",
        name: "Template 2",
        description: "Desc 2",
        body: "Body 2",
        emoji: "😃",
        tags: ["tag2", "tag3"],
      },
      {
        id: "3",
        name: "Template 3",
        description: "Desc 3",
        body: "Body 3",
        emoji: "😄",
        tags: ["tag3", "tag4"],
      },
    ];

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should return templates with matching tags", async () => {
      (AnthropicActions.getSimilarTemplates as jest.Mock).mockResolvedValue([
        "1",
        "2",
      ]);

      const tags = ["tag1", "tag2"];
      const result = await postService.shortlistTemplatesByTags(
        tags,
        mockTemplates
      );

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("2");
    });

    it("should handle case-insensitive tags", async () => {
      (AnthropicActions.getSimilarTemplates as jest.Mock).mockResolvedValue([
        "1",
      ]);

      const tags = ["TAG1", "Tag2"];
      const result = await postService.shortlistTemplatesByTags(
        tags,
        mockTemplates
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("should handle tags with hashtags", async () => {
      (AnthropicActions.getSimilarTemplates as jest.Mock).mockResolvedValue([
        "1",
      ]);

      const tags = ["#tag1", "#tag2"];
      const result = await postService.shortlistTemplatesByTags(
        tags,
        mockTemplates
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("should return all templates (up to 10) if no tags are provided", async () => {
      const emptyTags: string[] = [];
      const result = await postService.shortlistTemplatesByTags(
        emptyTags,
        mockTemplates
      );

      expect(result).toHaveLength(3); // All templates are returned
      expect(AnthropicActions.getSimilarTemplates).not.toHaveBeenCalled();
    });

    it("should return an empty array if no templates match the provided tags", async () => {
      (AnthropicActions.getSimilarTemplates as jest.Mock).mockResolvedValue([]);

      const tags = ["nonexistent"];
      const result = await postService.shortlistTemplatesByTags(
        tags,
        mockTemplates
      );

      expect(result).toHaveLength(0);
    });

    it("should handle errors from getSimilarTemplates", async () => {
      (AnthropicActions.getSimilarTemplates as jest.Mock).mockRejectedValue(
        new Error("API Error")
      );

      const tags = ["tag1"];
      const result = await postService.shortlistTemplatesByTags(
        tags,
        mockTemplates
      );

      expect(result).toHaveLength(0);
    });
  });
});
