import logging
import sys
from rich.logging import RichHandler
from rich.console import Console
from rich.panel import Panel
from rich.text import Text

console = Console()

BANNER = """
[bold cyan]
  ___ _  _______      _________              _       _   _             
 |_ _| |/ /  _\ \    / /___ / /_ _ __   __ _| | _   | |_(_) ___ __ _ 
  | || ' /|  _| \ \  / /  |_ \ / _` '_ \ / _` | |/ _ \| __| |/ __/ _` |
  | || . \| |_   \ \/ /  ___) | (_| | | | (_| | | (_| | |_| | (_| (_| |
 |___|_|\_\___|   \__/  |____/ \__,_|_| |_|\__,_|_|\___/ \__|_|\___\__,_|
                                                                         
[/bold cyan]
[bold white]Modern IPsec/IKE Analysis & Enumeration Framework[/bold white]
[italic blue]Versiyon 0.1.0 - Gelişmiş Güvenlik Analizi[/italic blue]
"""

def print_banner():
    """Prints the professional CLI banner."""
    console.print(Panel(Text.from_markup(BANNER), border_style="cyan"))

def setup_logger(level=logging.INFO):
    """Configures the logger with RichHandler for beautiful output."""
    logging.basicConfig(
        level=level,
        format="%(message)s",
        datefmt="[%X]",
        handlers=[RichHandler(rich_tracebacks=True, console=console, show_path=False)]
    )
    return logging.getLogger("ikev3analytica")

logger = setup_logger()
