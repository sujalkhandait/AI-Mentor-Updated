# backend/api.py

from fastapi import FastAPI, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gemini_api import generate_text
import os
import datetime
import re
import pyttsx3

# --------------------------
# FastAPI App
# --------------------------
app = FastAPI(title="AI Lesson Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# Request Model
# --------------------------
class LessonRequest(BaseModel):
    course: str
    topic: str
    celebrity: str

# --------------------------
# Serve Video Files
# --------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
video_output_path = os.path.join(BASE_DIR, "outputs", "video")
if not os.path.exists(video_output_path):
    os.makedirs(video_output_path, exist_ok=True)

app.mount("/video-stream", StaticFiles(directory=video_output_path), name="video-stream")

# --------------------------
# Root Route
# --------------------------
@app.get("/")
def home():
    return {"message": "AI Lesson Generator Backend Running"}

# --------------------------
# Generate Lesson Endpoint
# --------------------------
@app.post("/generate")
def generate_lesson(data: LessonRequest, background_tasks: BackgroundTasks):
    # Generate filename here so we can return it immediately
    # Sanitize topic: remove special characters, replace spaces with underscores
    topic_clean = re.sub(r'[^\w\s-]', '', data.topic).strip().replace(" ", "_")
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    base_filename = f"{topic_clean}_{timestamp}"
    
    process_lesson(data, base_filename)

    return {
        "status": "Completed",
        "filename": f"{base_filename}.mp4",
        "text_file": f"{base_filename}.txt",
        "audio_file": f"{base_filename}.mp3"
    }

# --------------------------
# Background Task
# --------------------------
def process_lesson(data: LessonRequest, base_filename: str):
    try:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # ----------------------------
        # 1️⃣ Generate SHORT AI Text (~30 sec)
        # ----------------------------
        prompt = f"""
        Generate a clear and engaging explanation 
        of around 50 words about the topic '{data.topic}' 
        in the subject '{data.course}'.

        Keep it between 45 to 60 words only.
        Explain in simple language.
        Make it natural for spoken narration.
        """
        
        script = generate_text(prompt)
        print(f"📝 Generated text: {script}")

        # ----------------------------
        # 2️⃣ Create Output Folders
        # ----------------------------
        # Optimized: centralized output folder in ai_service/outputs
        base_output_dir = os.path.join(BASE_DIR, "outputs")
        text_dir = os.path.join(base_output_dir, "text")
        audio_dir = os.path.join(base_output_dir, "audio")
        video_dir = os.path.join(base_output_dir, "video")

        os.makedirs(text_dir, exist_ok=True)
        os.makedirs(audio_dir, exist_ok=True)
        os.makedirs(video_dir, exist_ok=True)

        text_path = os.path.join(text_dir, f"{base_filename}.txt")
        audio_path = os.path.join(audio_dir, f"{base_filename}.mp3")
        final_video = os.path.join(video_dir, f"{base_filename}.mp4")

        # ----------------------------
        # 3️⃣ Save Text to File
        # ----------------------------
        with open(text_path, "w", encoding="utf-8") as f:
            f.write(script)
        print(f"💾 Saved text to: {text_path}")

        # ----------------------------
        # 4️⃣ Convert Text to Speech (pyttsx3)
        # ----------------------------
        # Optimization: Re-initialize engine inside the task to avoid loop issues in threads
        engine = pyttsx3.init()
        engine.setProperty("rate", 165)  # Faster speech for ~30 sec
        engine.save_to_file(script, audio_path)
        engine.runAndWait()
        print(f"🎵 Generated audio: {audio_path}")

        # ----------------------------
        # 5️⃣ Loop Video Until Audio Ends (FFmpeg)
        # ----------------------------
        # Use celebrity-specific video if available, otherwise use default
        input_video_dir = os.path.join(BASE_DIR, "backend", "input")
        celebrity_video = os.path.join(input_video_dir, f"{data.celebrity.lower()}.mp4")
        
        if os.path.exists(celebrity_video):
            input_video = celebrity_video
            print(f"🎬 Using celebrity video: {celebrity_video}")
        else:
            # Fallback to default video (modi.mp4)
            input_video = os.path.join(input_video_dir, "modi.mp4")
            print(f"🎬 Using default video: {input_video}")

        if not os.path.exists(input_video):
            print(f"❌ Error: Video file not found at {input_video}")
            return

        ffmpeg_command = (
            f'ffmpeg -y -stream_loop -1 -i "{input_video}" '
            f'-i "{audio_path}" '
            f'-map 0:v:0 -map 1:a:0 '
            f'-c:v copy -c:a aac -shortest "{final_video}"'
        )

        print(f"🎥 Running ffmpeg command...")
        os.system(ffmpeg_command)

        # ----------------------------
        # 6️⃣ Success Message
        # ----------------------------
        print(f"✅ Lesson ready!")
        print(f"   Text: {text_path}")
        print(f"   Audio: {audio_path}")
        print(f"   Video: {final_video}")

    except Exception as e:
        print(f"❌ Error generating lesson: {e}")
        import traceback
        traceback.print_exc()
