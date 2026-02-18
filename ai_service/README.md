# AI Lesson Generator Service

This service generates AI-powered short video lessons using:
- **Google Gemini** for script generation.
- **pyttsx3** for offline Text-to-Speech (TTS).
- **FFmpeg** for video processing and looping.
- **FastAPI** for the backend API.

The service currently generates a video by looping a source video (e.g., a celebrity clip) for the duration of the generated audio.

---

## 🚀 Prerequisites

Ensure you have the following installed:

1.  **Python 3.10+**: Required for compatibility.
2.  **FFmpeg**: Essential for video and audio processing.
    *   **Windows (winget)**: `winget install ffmpeg`
    *   **Manual**: Download from [ffmpeg.org](https://ffmpeg.org/download.html), extract, and add the `bin` folder to your System PATH.
    *   **Verify**: Run `ffmpeg -version` in your terminal.

---

## 📥 Installation

Follow these steps to set up the environment:

### 1. Create a Virtual Environment

Navigate to the `ai_service` directory:

```bash
cd ai_service
python -m venv venv
```

### 2. Activate the Virtual Environment

*   **Windows**:
    ```bash
    .\venv\Scripts\activate
    ```
*   **Linux/Mac**:
    ```bash
    source venv/bin/activate
    ```

### 3. Install Dependencies

Install the required Python packages from `requirements_active.txt`:

```bash
pip install -r backend/requirements_active.txt
```

---

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file inside the `ai_service/backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Input Videos

Place your source videos in `ai_service/backend/input/`.
The service looks for videos matching the celebrity name (e.g., `modi.mp4`, `elon.mp4`).
*   Default fallback: `modi.mp4`

---

## 🏃 Running the Service

Start the FastAPI server:

```bash
cd backend
uvicorn api:app --reload --port 8000
```

The service will be available at `http://localhost:8000`.

### API Endpoint

**POST** `/generate`

**Body:**
```json
{
  "course": "Physics",
  "topic": "Newton's Laws",
  "celebrity": "Einstein"
}
```

**Response:**
```json
{
  "status": "Processing started",
  "filename": "Newtons_Laws_20240213_123045.mp4",
  "text_file": "Newtons_Laws_20240213_123045.txt",
  "audio_file": "Newtons_Laws_20240213_123045.wav"
}
```

---

## 📂 Project Structure

*   `backend/`:
    *   `api.py`: Main FastAPI application.
    *   `gemini_api.py`: Interaction with Google Gemini.
    *   `input/`: Source video files for looping.
    *   `requirements_active.txt`: Active dependencies.
*   `outputs/`: Generated files (auto-created).
    *   `video/`: Final `.mp4` lessons.
    *   `audio/`: Generated audio.
    *   `text/`: Generated scripts.

---

## 🛠 Troubleshooting

*   **FFmpeg Error**: Ensure FFmpeg is added to your system PATH.
*   **Gemini Error**: Check your API key in `.env`.
*   **ModuleNotFoundError**: Ensure your virtual environment is active (`venv`).
