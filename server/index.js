const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Get files from a GitHub repo
app.get("/files", async (req, res) => {
  const { owner, repo } = req.query;
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents`,
      {
        headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ message: "Repository or user not found" });
    }
    if (err.response?.status === 403) {
      return res
        .status(403)
        .json({ message: "Rate limit exceeded. Try again later." });
    }
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// Generate test case summaries
app.post("/summaries", async (req, res) => {
  const { fileContents } = req.body;
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              { text: `Summarize possible test cases for:\n${fileContents}` },
            ],
          },
        ],
      },
      { params: { key: process.env.GEMINI_API_KEY } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate full test code
app.post("/generate", async (req, res) => {
  const { summary, fileContents } = req.body;
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `Generate a Jest test file for the given code summary and original file.
                        The test must:
                        - Use CommonJS syntax (require) instead of import/export.
                        - Use Chai v4 for assertions and require it.
                        - Be fully compatible with Jest without any ESM or Babel setup.
                        - Include meaningful test cases for all functions in the file.

                        Summary: ${summary}

                        Original file:
                ${fileContents}`,
              },
            ],
          },
        ],
      },
      { params: { key: process.env.GEMINI_API_KEY } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
