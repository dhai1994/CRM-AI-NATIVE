import axios from "axios";

export const callOpenRouter =
  async (prompt) => {
    try {
      const response =
        await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model:
              "deepseek/deepseek-chat-v3-0324",

            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },

          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      return response.data.choices[0]
        .message.content;
    } catch (error) {
      console.log(error.response?.data);

      throw new Error(
        "OpenRouter Error"
      );
    }
  };