import asyncio
from ikev3analytica.scanner.ikev1 import IKEv1Scanner
from ikev3analytica.scanner.ikev2 import IKEv2Scanner
from ikev3analytica.utils.logger import logger

class AsyncScanner:
    """Async engine to run multiple scans concurrently."""
    def __init__(self, target: str, protocols: list):
        self.target = target
        self.protocols = protocols
        self.results = []

    async def run(self):
        tasks = []
        if "IKEv1" in self.protocols or "Both" in self.protocols:
            tasks.append(IKEv1Scanner(self.target).scan())
        if "IKEv2" in self.protocols or "Both" in self.protocols:
            tasks.append(IKEv2Scanner(self.target).scan())
        
        logger.info(f"Running {len(tasks)} scan tasks concurrently...")
        self.results = await asyncio.gather(*tasks)
        return self.results
