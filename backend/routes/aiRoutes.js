import express from "express";
import fs from "fs";

const router = express.Router();

router.post("/generate-video", (req, res) => {
  const { courseTitle, celebrity } = req.body;
  //generate video by calling ai_service
  
  
  setTimeout(() => {
    fs.readFile(`./videos/${celebrity}.mp4`, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to read video file" });
      } else {
        console.log("Video file read successfully");
        res.json({
          videoUrl: `http://localhost:5000/videos/${celebrity}.mp4`,
          captions: `This is a sample ${courseTitle} lesson video.`
        })
      }
    })
  }, 1000);
});

// ✅ THIS LINE IS REQUIRED
export default router;
