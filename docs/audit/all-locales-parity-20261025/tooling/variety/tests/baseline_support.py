"""Load an untouched baseline with its own companion, without module alias drift."""
from pathlib import Path
import importlib.util
import sys

ROOT = Path(__file__).resolve().parents[1]


def load_file(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_baseline():
    companion = load_file('baseline_multilingual', ROOT / 'baseline14/variety_multilingual.py')
    previous = sys.modules.get('variety_multilingual')
    try:
        sys.modules['variety_multilingual'] = companion
        metrics = load_file('baseline_metrics', ROOT / 'baseline14/variety_metrics.py')
    finally:
        if previous is None:
            sys.modules.pop('variety_multilingual', None)
        else:
            sys.modules['variety_multilingual'] = previous
    return metrics, companion
