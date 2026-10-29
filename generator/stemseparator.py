
import torch
torch.backends.mps.is_available = lambda: False

import os
import subprocess
from pathlib import Path

os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"

from audio_separator.separator import Separator

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "songs" / "tomorrow"


def splitSong(path: str) -> list[str]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    separator = Separator(
        output_dir=str(OUTPUT_DIR),
        ensemble_algorithm="avg_wave",
    )

    models = [
        "htdemucs_ft.yaml",
    ]

    separator.load_model(model_filename=models)  # type: ignore[arg-type]

    output_files = separator.separate(path)

    mp3_files = []

    for file in output_files:
        wav_path = OUTPUT_DIR / file
        mp3_path = wav_path.with_suffix(".mp3")

        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i", str(wav_path),
                "-codec:a", "libmp3lame",
                "-b:a", "192k",
                str(mp3_path),
            ],
            check=True,
        )

        # Remove the original WAV to save repository space.
        wav_path.unlink()

        mp3_files.append(str(mp3_path))

    return mp3_files
