jest.mock("@/utils/AnthropicHelper", () => ({
  getInstance: jest.fn().mockReturnValue({
    getClient: jest.fn().mockReturnValue({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{ text: "Mocked response" }],
        }),
      },
    }),
  }),
}));

export const refinePodcastTranscript = jest.fn((text) => Promise.resolve(text));
export const generateSummary = jest.fn(() => Promise.resolve("Test summary"));
export const generateTitle = jest.fn(() => Promise.resolve("Test title"));
export const suggestTags = jest.fn(() =>
  Promise.resolve({
    duration: "1:00",
    speakers: ["Speaker 1"],
    mainTopic: "Test Topic",
    expertise: "General",
    keyPoints: ["Point 1"],
    themes: ["Theme 1"],
  })
);
