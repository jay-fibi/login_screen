import ast
import operator
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the HTML frontend

# Supported operators mapped to safe Python functions
OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Mod: operator.mod,
    ast.USub: operator.neg,  # Unary minus (e.g., -5)
    ast.UAdd: operator.pos,  # Unary plus
}


def safe_eval(expression: str):
    """
    Safely evaluate a mathematical expression using Python's AST module.
    Only allows numbers and basic arithmetic operators — no arbitrary code execution.
    """
    try:
        tree = ast.parse(expression, mode='eval')
    except SyntaxError:
        raise ValueError("Invalid expression syntax")

    def _eval(node):
        if isinstance(node, ast.Expression):
            return _eval(node.body)
        elif isinstance(node, ast.Constant):
            if isinstance(node.value, (int, float)):
                return node.value
            raise ValueError("Only numeric constants are allowed")
        elif isinstance(node, ast.BinOp):
            op_type = type(node.op)
            if op_type not in OPERATORS:
                raise ValueError(f"Unsupported operator: {op_type.__name__}")
            left = _eval(node.left)
            right = _eval(node.right)
            if op_type == ast.Div and right == 0:
                raise ZeroDivisionError("Division by zero")
            if op_type == ast.Mod and right == 0:
                raise ZeroDivisionError("Modulo by zero")
            return OPERATORS[op_type](left, right)
        elif isinstance(node, ast.UnaryOp):
            op_type = type(node.op)
            if op_type not in OPERATORS:
                raise ValueError(f"Unsupported unary operator: {op_type.__name__}")
            return OPERATORS[op_type](_eval(node.operand))
        else:
            raise ValueError(f"Unsupported expression type: {type(node).__name__}")

    return _eval(tree)


@app.route('/calculate', methods=['POST'])
def calculate():
    """
    POST /calculate
    Request body: { "expression": "3 + 5 * 2" }
    Response:     { "result": "13" }
               or { "error": "Division by zero" }
    """
    data = request.get_json()

    if not data or 'expression' not in data:
        return jsonify({'error': 'Missing expression in request body'}), 400

    expression = data['expression'].strip()

    if not expression:
        return jsonify({'error': 'Expression cannot be empty'}), 400

    try:
        result = safe_eval(expression)

        # Format result: remove unnecessary trailing zeros for floats
        if isinstance(result, float):
            # Round to 10 decimal places to avoid floating point noise
            result = round(result, 10)
            # Convert to int if it's a whole number
            if result == int(result):
                result = int(result)

        return jsonify({'result': str(result)})

    except ZeroDivisionError as e:
        return jsonify({'error': str(e)}), 200
    except ValueError as e:
        return jsonify({'error': f'Invalid expression: {e}'}), 400
    except Exception as e:
        return jsonify({'error': f'Calculation error: {e}'}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'message': 'Calculator API is running'})


if __name__ == '__main__':
    print("🧮 Calculator API starting on http://localhost:5000")
    print("   POST /calculate  — evaluate a math expression")
    print("   GET  /health     — check server status")
    app.run(debug=True, host='0.0.0.0', port=5000)
