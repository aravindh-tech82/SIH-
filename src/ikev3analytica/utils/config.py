import json
import os
from typing import Any, Dict

DEFAULT_CONFIG = {
    "timeout": 5,
    "retries": 3,
    "threads": 10,
    "user_agent": "IKEv3Analytica/0.1.0",
}

class Config:
    def __init__(self, config_path: str = None):
        self.data = DEFAULT_CONFIG.copy()
        if config_path and os.path.exists(config_path):
            self.load(config_path)

    def load(self, path: str):
        with open(path, "r") as f:
            self.data.update(json.load(f))

    def get(self, key: str, default: Any = None) -> Any:
        return self.data.get(key, default)

config = Config()
