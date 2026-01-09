from setuptools import setup, find_packages

setup(
    name="IKEv3Analytica",
    version="0.1.0",
    author="ismailtsdln",
    description="Modern IPsec/IKE Analysis & Enumeration Framework",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "scapy>=2.5.0",
        "cryptography>=41.0.0",
        "click>=8.1.0",
        "rich>=13.0.0",
        "jsonschema>=4.19.0",
        "jinja2>=3.1.2",
    ],
    entry_points={
        "console_scripts": [
            "ikev3analytica=ikev3analytica.cli:main",
        ],
    },
    python_requires=">=3.10",
)
