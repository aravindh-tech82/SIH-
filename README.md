# IKEv3Analytica – Modern IPsec/IKE Analiz & Enumeration Framework

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)
![Protocol](https://img.shields.io/badge/protocol-IKEv1%2Fv2-orange.svg)

**IKEv3Analytica** is a next-generation analysis and enumeration framework for IPsec VPNs. It replaces legacy tools like `ikeforce` with a modern, modular, and performant engine supporting both IKEv1 and IKEv2 protocols.

## 🚀 Key Features

- **Full Protocol Analysis**: Comprehensive support for IKEv1 & IKEv2.
- **Auto-Enumeration**: Automatically discover Group IDs and transform sets.
- **XAUTH Brute Force**: Advanced dictionary attacks with prioritize likely candidates.
- **Async Scanning Engine**: High-performance, multi-threaded scanning capabilities.
- **Risk Scoring**: Automated security analysis of cipher suites and protocol settings.
- **Structured Reporting**: Export results in JSON, HTML, and XML formats.
- **Docker Ready**: Easy deployment using containerization.

## 🛠️ Installation

### Using Pip

```bash
git clone https://github.com/ismailtsdln/IKEv3Analytica
cd IKEv3Analytica
pip install -r requirements.txt
python setup.py install
```

### Using Docker

```bash
docker build -t ikev3analytica .
docker run -it ikev3analytica --help
```

## 📊 Usage Examples

### Scan a Target

```bash
ikev3analytica scan --target 10.0.0.5 --protocol IKEv2 --full-enum
```

### Brute-force XAUTH

```bash
ikev3analytica brute --target 10.0.0.5 --xauth-users users.txt --psk-list psk.lst
```

### Generate HTML Report

```bash
ikev3analytica report --output html --dest ./reports/
```

## 📐 Project Architecture

```text
IKEv3Analytica/
├── src/
│   ├── scanner/      # IKEv1/v2 Scanning Engines
│   ├── brute/        # Brute-force Modules
│   ├── reporting/    # Result Exporters
│   └── utils/        # Common Utilities
├── tests/            # Unit & Integration Tests
└── docs/             # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please read the `CONTRIBUTING.md` for guidelines.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
