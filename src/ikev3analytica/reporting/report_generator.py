import json
import os
from datetime import datetime
from jinja2 import Template

class ReportGenerator:
    """Base class for report generation."""
    def __init__(self, data: list, output_dir: str):
        self.data = data
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    def generate_json(self):
        """Generates a JSON report."""
        filename = os.path.join(self.output_dir, f"report_{self.timestamp}.json")
        with open(filename, "w") as f:
            json.dump(self.data, f, indent=4)
        return filename

    def generate_html(self):
        """Generates an HTML report using Jinja2."""
        filename = os.path.join(self.output_dir, f"report_{self.timestamp}.html")
        template_str = """
<!DOCTYPE html>
<html>
<head>
    <title>IKEv3Analytica Report</title>
    <style>
        body { font-family: sans-serif; margin: 20px; background-color: #f4f4f9; color: #333; }
        h1 { color: #2c3e50; }
        .result-card { background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status-open { color: green; font-weight: bold; }
        .status-closed { color: red; }
    </style>
</head>
<body>
    <h1>IKEv3Analytica Scan Results</h1>
    <p>Generated at: {{ timestamp }}</p>
    {% for item in data %}
    <div class="result-card">
        <h3>Protocol: {{ item.protocol }}</h3>
        <p>Status: <span class="status-{{ item.status.lower() }}">{{ item.status }}</span></p>
        {% if item.details %}
        <p>Details: {{ item.details }}</p>
        {% endif %}
        {% if item.response %}
        <pre>{{ item.response }}</pre>
        {% endif %}
    </div>
    {% endfor %}
</body>
</html>
        """
        template = Template(template_str)
        html_content = template.render(data=self.data, timestamp=self.timestamp)
        with open(filename, "w") as f:
            f.write(html_content)
        return filename
