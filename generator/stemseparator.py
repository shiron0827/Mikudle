import torch
torch.backends.mps.is_available = lambda: False

import os
os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"

from audio_separator.separator import Separator

def splitSong(path: str) -> list[str]:
    # Initialize the Separator class with custom parameters
    separator = Separator(
        output_dir='../public/songs/tomorrow',
        ensemble_algorithm='avg_wave',
    )

    # List of models to ensemble
    # Note: These models will be downloaded automatically if not present
    models = [
        'htdemucs_ft.yaml',
    ]

    # Specify multiple models for ensembling
    separator.load_model(model_filename=models) # type: ignore[arg-type]

    # Perform separation
    output_files = separator.separate(path)

    return output_files