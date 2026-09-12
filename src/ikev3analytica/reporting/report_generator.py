import json
import os
from datetime import datetime
from jinja2 import Template

# --- NOVELTY IMPORTS ---
from ikev3analytica.novelties.llm_copilot import explain_finding
from ikev3analytica.novelties.pqc_checker import pqc_score
from ikev3analytica.novelties.blockchain_audit import log_report
# -----------------------


class ReportGenerator:
    """Base class for report generation."""

    def __init__(self, data: list, output_dir: str):
        self.data = data
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # --- NOVELTY: enrich data with AI + PQC + Blockchain ---
        self.enriched = self._enrich_data(self.data)
        # -------------------------------------------------------

    def _enrich_data(self, findings: list) -> dict:
        """Add LLM explanations, PQC score, and blockchain anchor."""
        enriched_findings = []
        for f in findings:
            # Ensure finding is a dict
            item = f if isinstance(f, dict) else {"issue": str(f)}
            # Add AI explanation
            try:
                item["ai_explanation"] = explain_finding(item)
            except Exception as e:
                item["ai_explanation"] = f"[LLM error: {e}]"
            enriched_findings.append(item)

        # Build enriched report structure
        enriched_report = {
            "generated_at": self.timestamp,
            "findings": enriched_findings,
        }

        # Post-Quantum Readiness Score
        try:
            enriched_report["pqc"] = pqc_score(enriched_findings)
        except Exception as e:
            enriched_report["pqc"] = {"error": str(e)}

        # Blockchain Audit Trail (tamper-proof hash)
        try:
            enriched_report["blockchain_hash"] = log_report(enriched_report)
        except Exception as e:
            enriched_report["blockchain_hash"] = f"[Blockchain error: {e}]"

        return enriched_report

    def generate_json(self):
        """Generates a JSON report with novelties included."""
        filename = os.path.join(self.output_dir, f"report_{self.timestamp}.json")
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(self.enriched, f, indent=4, default=str)
        return filename

    def generate_html(self):
        """Generates an HTML report using Jinja2 (with novelties displayed)."""
        filename = os.path.join(self.output_dir, f"report_{self.timestamp}.html")
        template_str = """
<!DOCTYPE html>
<html>
<head>
    <title>IPsec Sentinel - IKEv3Analytica Report</title>
    <style>
        body { font-family: sans-serif; margin: 20px; background-color: #f4f4f9; color: #333; }
        h1 { color: #2c3e50; }
        h2 { color: #34495e; border-bottom: 2px solid #ccc; padding-bottom: 5px; }
        .result-card { background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status-open { color: green; font-weight: bold; }
        .status-closed { color: red; }
        .novelty-box { background: #eef6ff; border-left: 4px solid #2c7be5; padding: 12px; margin: 12px 0; border-radius: 6px; }
        .pqc-score { font-size: 2em; font-weight: bold; color: #2c7be5; }
        .blockchain { font-family: monospace; word-break: break-all; background: #f0f0f0; padding: 8px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>🛡️ IPsec Sentinel Report</h1>
    <p>Generated at: {{ data.generated_at }}</p>

    <!-- AI + PQC + Blockchain summary -->
    <h2>🧬 Post-Quantum Readiness</h2>
    <div class="novelty-box">
        <p>Quantum Readiness Score: 
           <span class="pqc-score">{{ data.pqc.quantum_readiness_score }}%</span>
        </p>
        <p>Vulnerable findings: {{ data.pqc.vulnerable_count }} / {{ data.pqc.total_findings }}</p>
    </div>

    <h2>⛓️ Blockchain Audit Trail</h2>
    <div class="novelty-box">
        <p>Report Hash:</p>
        <div class="blockchain">{{ data.blockchain_hash }}</div>
    </div>

    <h2>🔍 Findings + AI Explanations</h2>
    {% for item in data.findings %}
    <div class="result-card">
        <h3>Protocol: {{ item.get('protocol', 'N/A') }}</h3>
        <p>Status: 
           <span class="status-{{ item.get('status', 'unknown').lower() }}">
           {{ item.get('status', 'N/A') }}</span>
        </p>
        {% if item.get('details') %}<p>Details: {{ item.details }}</p>{% endif %}
        {% if item.get('response') %}<pre>{{ item.response }}</pre>{% endif %}

        <div class="novelty-box">
            <strong>🤖 AI Copilot Explanation:</strong>
            <p>{{ item.get('ai_explanation', 'N/A') }}</p>
        </div>
    </div>
    {% endfor %}
</body>
</html>
        """
        template = Template(template_str)
        html_content = template.render(data=self.enriched)
        with open(filename, "w", encoding="utf-8") as f:
            f.write(html_content)
        return filename