import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post("/generate-video", async (req, res) => {
  try {
    const { course, celebrity, topic } = req.body;

    // Helper to check if file size is stable (finished writing)
    const waitForFileStability = async (filePath) => {
      let lastSize = -1;
      let stableCount = 0;
      const maxStabilityChecks = 5; // Try for up to 5s of stability

      let currentSize = 0;
      for (let i = 0; i < maxStabilityChecks; i++) {
        if (!fs.existsSync(filePath)) return false;
        const stats = fs.statSync(filePath);
        currentSize = stats.size;

        if (currentSize > 0 && currentSize === lastSize) {
          stableCount++;
          if (stableCount >= 2) return true; // Stable for 2 consecutive checks
        } else {
          stableCount = 0;
        }

        lastSize = currentSize;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      return currentSize > 0;
    };

    // ----------------------------------------------------
    // 1. Trigger Generation (Python API)
    // ----------------------------------------------------
    console.log("🚀 Triggering new video generation...");
    const ai_service_url = `http://127.0.0.1:8000/generate`;

    let videoFileName = ""; // Will be set by API response
    let textFileName = ""; // Will be set by API response

    try {
      const aiResponse = await fetch(ai_service_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, topic, celebrity }),
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || `AI service returned status ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      // The API now returns the exact filename it is generating!
      videoFileName = aiData.filename;
      textFileName = aiData.text_file;
      console.log(`✅ AI service started. Filename to poll: ${videoFileName}`);

    } catch (aiError) {
      console.error("❌ AI Service Error:", aiError.message);
      return res.status(500).json({
        error: "AI Service Unavailable",
        message: aiError.message
      });
    }

    // ----------------------------------------------------
    // 2. Setup Paths & Poll
    // ----------------------------------------------------
    const aiServiceVideoPath = path.join(
      __dirname,
      "../../ai_service/outputs/video",
      videoFileName
    );
    const aiServiceTextPath = path.join(
      __dirname,
      "../../ai_service/outputs/text",
      textFileName || videoFileName.replace('.mp4', '.txt')
    );
    const backendVideosFolder = path.join(__dirname, "../videos");
    const backendVideoPath = path.join(backendVideosFolder, videoFileName);

    // Ensure backend/videos exists
    if (!fs.existsSync(backendVideosFolder)) {
      fs.mkdirSync(backendVideosFolder, { recursive: true });
    }

    // Poll for the file
    const maxWaitTime = 120000; // 120 seconds
    const pollInterval = 3000; // Check every 3 seconds
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      if (fs.existsSync(aiServiceVideoPath)) {
        console.log("⏳ Video file detected, checking stability...");
        if (await waitForFileStability(aiServiceVideoPath)) {
          console.log("✅ Video generation complete and file verified!");
          await fs.promises.copyFile(aiServiceVideoPath, backendVideoPath);
          
          // Read text file content if it exists
          let textContent = "";
          if (fs.existsSync(aiServiceTextPath)) {
            textContent = await fs.promises.readFile(aiServiceTextPath, 'utf-8');
            console.log("✅ Text file also loaded!");
            console.log("📝 Text content length:", textContent.length);
            console.log("📝 Text preview:", textContent.substring(0, 100));
          } else {
            console.log("⚠️ Text file not found at:", aiServiceTextPath);
          }
          
          return res.json({
            status: "success",
            message: "Video generated successfully",
            videoUrl: `http://localhost:5000/videos/${videoFileName}`,
            textContent: textContent,
            topic,
            celebrity,
          });
        }
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
      elapsed += pollInterval;
      if (elapsed % 15000 === 0) console.log(`Polling... ${elapsed / 1000}s elapsed`);
    }

    // Timeout
    return res.status(408).json({
      error: "Video generation timeout",
      message: "Generation is taking longer than expected.",
    });

  } catch (error) {
    console.error("🔥 Route Error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message
      });
    }
  }
});

export default router;
