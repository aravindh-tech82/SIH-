import click
from rich.console import Console
from rich.table import Table
from rich.live import Live
from rich.status import Status
from ikev3analytica.utils.logger import logger, print_banner
from ikev3analytica.utils.validators import validate_target

console = Console()

@click.group()
@click.version_option(version="0.1.0")
def main():
    """IKEv3Analytica - Modern IPsec/IKE Analysis & Enumeration Framework"""
    print_banner()

@main.command()
@click.option("--target", "-t", required=True, help="Target IP or hostname")
@click.option("--protocol", "-p", type=click.Choice(["IKEv1", "IKEv2", "Both"]), default="Both", help="IKE protocol version")
@click.option("--full-enum", is_flag=True, help="Perform full enumeration")
def scan(target, protocol, full_enum):
    """Scan a target for IKE/IPsec services."""
    import asyncio
    from ikev3analytica.scanner.async_scanner import AsyncScanner
    
    if not validate_target(target):
        logger.error(f"Invalid target: {target}")
        return

    logger.info(f"Starting scan on [bold cyan]{target}[/bold cyan] using [green]{protocol}[/green]...")
    
    with console.status(f"[bold green]Scanning {target}...", spinner="dots") as status:
        scanner = AsyncScanner(target, [protocol])
        results = asyncio.run(scanner.run())
    
    table = Table(title=f"Scan Results for {target}")
    table.add_column("Protocol", style="cyan", no_wrap=True)
    table.add_column("Status", style="bold")
    table.add_column("Details", style="magenta")
    table.add_column("Summary", style="white")

    for result in results:
        status_text = "[green]Open[/green]" if result["status"] == "Open" else "[red]Closed[/red]"
        table.add_row(
            result["protocol"],
            status_text,
            result.get("details", "N/A"),
            result.get("response", "N/A")
        )
    
    console.print(table)

@main.command()
@click.option("--target", "-t", required=True, help="Target IP or hostname")
@click.option("--xauth-users", type=click.Path(exists=True), required=True, help="Path to XAUTH users wordlist")
@click.option("--psk-list", type=click.Path(exists=True), help="Path to PSK wordlist")
def brute(target, xauth_users, psk_list):
    """Perform brute-force attacks against a target."""
    import asyncio
    from ikev3analytica.brute.xauth import XAuthBrute
    
    logger.info(f"Starting brute-force against [bold cyan]{target}[/bold cyan]...")
    
    with open(xauth_users, "r") as f:
        users = [line.strip() for line in f if line.strip()]
        
    with console.status(f"[bold yellow]Brute-forcing XAUTH on {target}...", spinner="bouncingBar") as status:
        bruter = XAuthBrute(target, users)
        results = asyncio.run(bruter.run())
    
    if results["results"]:
        logger.info(f"[bold green]Found {len(results['results'])} valid accounts![/bold green]")
        for user in results["results"]:
            logger.info(f"  [bold white]•[/bold white] User: [green]{user}[/green]")
    else:
        logger.warning("No valid accounts found.")

@main.command()
@click.option("--output", "-o", type=click.Choice(["json", "html"]), default="json", help="Report format")
@click.option("--dest", "-d", type=click.Path(), default="./reports/", help="Destination directory")
def report(output, dest):
    """Generate analysis reports (mock data for now)."""
    from ikev3analytica.reporting.report_generator import ReportGenerator
    
    # Mock data for demonstration
    mock_results = [
        {"protocol": "IKEv1", "status": "Open", "details": "IKEv1 detected", "response": "ISAKMP SA Proposal Accepted"},
        {"protocol": "IKEv2", "status": "Closed", "details": "No response", "response": ""}
    ]
    
    logger.info(f"Generating [bold green]{output}[/bold green] report in [bold cyan]{dest}[/bold cyan]...")
    generator = ReportGenerator(mock_results, dest)
    
    if output == "json":
        path = generator.generate_json()
    else:
        path = generator.generate_html()
        
    logger.info(f"Report saved to: [bold underline]{path}[/bold underline]")

if __name__ == "__main__":
    main()
