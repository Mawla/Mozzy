export const AnthropicHelper = {
  getInstance: jest.fn().mockReturnValue({
    getClient: jest.fn().mockReturnValue({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{ text: "Mocked response" }],
        }),
      },
    }),
  }),
};

export default AnthropicHelper;
