import ipaddress
import re

def validate_ip(ip: str) -> bool:
    """Validates if the given string is a valid IP address."""
    try:
        ipaddress.ip_address(ip)
        return True
    except ValueError:
        return False

def validate_target(target: str) -> bool:
    """Validates if the given string is a valid IP or hostname."""
    if validate_ip(target):
        return True
    # Simple hostname validation
    hostname_regex = re.compile(
        r'^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*'
        r'([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$'
    )
    return bool(hostname_regex.match(target))
