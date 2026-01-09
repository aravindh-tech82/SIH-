import pytest
import asyncio
from ikev3analytica.utils.validators import validate_ip, validate_target
from ikev3analytica.utils.config import Config

def test_validate_ip():
    assert validate_ip("192.168.1.1") is True
    assert validate_ip("8.8.8.8") is True
    assert validate_ip("invalid-ip") is False

def test_validate_target():
    assert validate_target("example.com") is True
    assert validate_target("127.0.0.1") is True
    assert validate_target("---invalid---") is False

def test_config_default():
    cfg = Config()
    assert cfg.get("timeout") == 5
    assert cfg.get("retries") == 3

@pytest.mark.asyncio
async def test_async_placeholder():
    # Placeholder for async tests
    await asyncio.sleep(0.1)
    assert True
