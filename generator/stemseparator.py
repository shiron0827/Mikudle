
import torch
torch.backends.mps.is_available = lambda: False

import os
from pathlib import Path

os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"

from audio_separator.separator import Separator

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "songs" / "tomorrow"


def splitSong(path: str) -> list[str]:
    separator = Separator(
        output_dir=str(OUTPUT_DIR),
        ensemble_algorithm="avg_wave",
    )

    models = [
        "htdemucs_ft.yaml",
    ]

    separator.load_model(model_filename=models)  # type: ignore[arg-type]

    output_files = separator.separate(path)

    return output_files