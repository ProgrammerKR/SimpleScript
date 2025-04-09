let editor = CodeMirror.fromTextArea(document.getElementById('scriptInput'), {
  lineNumbers: true,
  mode: 'javascript',
  theme: 'eclipse', // light theme
  tabSize: 2,
  indentUnit: 2,
  indentWithTabs: false,
});

class Lexer {
    constructor(code) {
        this.code = code;
        this.tokens = this.tokenize(code);
    }

    tokenize(code) {
        const TOKEN_SPECIFICATION = [
            ['NUMBER',   /\b\d+(\.\d+)?\b/],
            ['STRING',   /"(?:[^"\\]|\\.)*"/],
            ['TRUE',     /\btrue\b/],
            ['FALSE',    /\bfalse\b/],
            ['NULL',     /\bnull\b/],
            ['LET',      /\blet\b/],
            ['PRINT',    /\bprint\b/],
            ['IF',       /\bif\b/],
            ['THEN',     /\bthen\b/],
            ['ENDIF',    /\bendif\b/],
            ['FOR',      /\bfor\b/],
            ['TO',       /\bto\b/],
            ['DO',       /\bdo\b/],
            ['ENDFOR',   /\bendfor\b/],
            ['WHILE',    /\bwhile\b/],
            ['ENDWHILE', /\bendwhile\b/],
            ['INPUT',    /\binput\b/],
            ['FUNCTION', /\bfunction\b/],
            ['ENDFUNCTION', /\bendfunction\b/],
            ['RETURN',   /\breturn\b/],
            ['CALL',     /\bcall\b/],
            ['BREAK',    /\bbreak\b/],
            ['CONTINUE', /\bcontinue\b/],
            ['IDENT',    /[a-zA-Z_][a-zA-Z0-9_]*/],
            ['ASSIGN',   /=/],
            ['PLUS',     /\+/],
            ['MINUS',    /-/],
            ['MUL',      /\*/],
            ['DIV',      /\//],
            ['MOD',      /%/],
            ['EQ',       /==/],
            ['NEQ',      /!=/],
            ['LT',       /</],
            ['GT',       />/],
            ['LE',       /<=/],
            ['GE',       />=/],
            ['AND',      /\band\b/],
            ['OR',       /\bor\b/],
            ['NOT',      /\bnot\b/],
            ['COMMA',    /,/],
            ['LPAREN',   /\(/],
            ['RPAREN',   /\)/],
            ['LBRACKET', /\[/],
            ['RBRACKET', /\]/],
            ['NEWLINE',  /\n/],
            ['SKIP',     /[ \t\r]+/],
            ['COMMENT',  /\/\/.*/],
        ];

        const regex = new RegExp(TOKEN_SPECIFICATION.map(([name, pattern]) => `(?<${name}>${pattern.source})`).join('|'), 'g');
        const tokens = [];
        let match;

        while ((match = regex.exec(code)) !== null) {
            const groups = match.groups;
            for (const name in groups) {
                if (groups[name] !== undefined) {
                    if (!['SKIP', 'COMMENT', 'NEWLINE'].includes(name)) {
                        let value = groups[name];
                        if (name === 'NUMBER') value = parseFloat(value);
                        if (name === 'STRING') value = value.slice(1, -1);
                        if (name === 'TRUE') value = true;
                        if (name === 'FALSE') value = false;
                        if (name === 'NULL') value = null;
                        tokens.push([name, value]);
                    }
                    break;
                }
            }
        }

        tokens.push(['EOF', null]);
        return tokens;
    }

    next_token() {
        return this.tokens.shift();
    }
}

class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.current_token = lexer.next_token();
    }

    eat(token_type) {
        if (this.current_token[0] === token_type) {
            this.current_token = this.lexer.next_token();
        } else {
            throw new Error(`Expected ${token_type} but got ${this.current_token[0]}`);
        }
    }

    parse() {
        const statements = [];
        while (this.current_token[0] !== 'EOF') {
            statements.push(this.statement());
        }
        return statements;
    }

    statement() {
        switch (this.current_token[0]) {
            case 'LET':
                return this.assignment();
            case 'PRINT':
                return this.print_statement();
            case 'IF':
                return this.if_statement();
            case 'FOR':
                return this.for_loop();
            case 'WHILE':
                return this.while_loop();
            case 'INPUT':
                return this.input_statement();
            default:
                return this.expression();
        }
    }

    assignment() {
        this.eat('LET');
        const var_name = this.current_token[1];
        this.eat('IDENT');
        this.eat('ASSIGN');
        const expr = this.expression();
        return ['assign', var_name, expr];
    }

    print_statement() {
        this.eat('PRINT');
        const expr = this.expression();
        return ['print', expr];
    }

    if_statement() {
        this.eat('IF');
        const condition = this.expression();
        this.eat('THEN');
        const body = [];
        while (this.current_token[0] !== 'ENDIF') {
            body.push(this.statement());
        }
        this.eat('ENDIF');
        return ['if', condition, body];
    }

    for_loop() {
        this.eat('FOR');
        const var_name = this.current_token[1];
        this.eat('IDENT');
        this.eat('ASSIGN');
        const start = this.expression();
        this.eat('TO');
        const end = this.expression();
        this.eat('DO');
        const body = [];
        while (this.current_token[0] !== 'ENDFOR') {
            body.push(this.statement());
        }
        this.eat('ENDFOR');
        return ['for', var_name, start, end, body];
    }

    while_loop() {
        this.eat('WHILE');
        const condition = this.expression();
        this.eat('DO');
        const body = [];
        while (this.current_token[0] !== 'ENDWHILE') {
            body.push(this.statement());
        }
        this.eat('ENDWHILE');
        return ['while', condition, body];
    }

    input_statement() {
        this.eat('INPUT');
        const var_name = this.current_token[1];
        this.eat('IDENT');
        return ['input', var_name];
    }

    expression() {
        let node = this.term();
        while (['PLUS', 'MINUS', 'OR'].includes(this.current_token[0])) {
            const op = this.current_token[0];
            this.eat(op);
            node = ['binop', op, node, this.term()];
        }
        return node;
    }

    term() {
        let node = this.factor();
        while (['MUL', 'DIV', 'MOD', 'AND'].includes(this.current_token[0])) {
            const op = this.current_token[0];
            this.eat(op);
            node = ['binop', op, node, this.factor()];
        }
        return node;
    }

    factor() {
        const token = this.current_token;
        switch (token[0]) {
            case 'NUMBER':
            case 'STRING':
            case 'TRUE':
            case 'FALSE':
            case 'NULL':
                this.eat(token[0]);
                return ['literal', token[1]];
            case 'IDENT':
                this.eat('IDENT');
                if (this.current_token[0] === 'LPAREN') {
                    this.eat('LPAREN');
                    const args = [];
                    if (this.current_token[0] !== 'RPAREN') {
                        args.push(this.expression());
                        while (this.current_token[0] === 'COMMA') {
                            this.eat('COMMA');
                            args.push(this.expression());
                        }
                    }
                    this.eat('RPAREN');
                    return ['call', token[1], args];
                }
                return ['var', token[1]];
            case 'NOT':
                this.eat('NOT');
                return ['unary', 'NOT', this.factor()];
            case 'LPAREN':
                this.eat('LPAREN');
                const expr = this.expression();
                this.eat('RPAREN');
                return expr;
            case 'LBRACKET':
                this.eat('LBRACKET');
                const elements = [];
                if (this.current_token[0] !== 'RBRACKET') {
                    elements.push(this.expression());
                    while (this.current_token[0] === 'COMMA') {
                        this.eat('COMMA');
                        elements.push(this.expression());
                    }
                }
                this.eat('RBRACKET');
                return ['list', elements];
            default:
                throw new Error(`Unexpected token: ${token}`);
        }
    }
}

class Interpreter {
    constructor(parser) {
        this.parser = parser;
        this.env = {};
    }

    interpret() {
        const tree = this.parser.parse();
        for (const stmt of tree) {
            this.eval(stmt);
        }
    }

    eval(node) {
        switch (node[0]) {
            case 'assign':
                this.env[node[1]] = this.eval_expr(node[2]);
                break;
            case 'print':
                const output = this.eval_expr(node[1]);
                document.getElementById('output').textContent += output + '\n';
                break;
            case 'if':
                if (this.eval_expr(node[1])) {
                    for (const stmt of node[2]) this.eval(stmt);
                }
                break;
            case 'for':
                for (let i = this.eval_expr(node[2]); i <= this.eval_expr(node[3]); i++) {
                    this.env[node[1]] = i;
                    for (const stmt of node[4]) this.eval(stmt);
                }
                break;
            case 'while':
                while (this.eval_expr(node[1])) {
                    for (const stmt of node[2]) this.eval(stmt);
                }
                break;
            case 'input':
                const val = prompt(`Enter ${node[1]}:`);
                this.env[node[1]] = isNaN(val) ? val : parseFloat(val);
                break;
            default:
                this.eval_expr(node);
                break;
        }
    }

    eval_expr(expr) {
        switch (expr[0]) {
            case 'literal':
                return expr[1];
            case 'var':
                return this.env[expr[1]] ?? null;
            case 'binop':
                const left = this.eval_expr(expr[2]);
                const right = this.eval_expr(expr[3]);
                switch (expr[1]) {
                    case 'PLUS': return left + right;
                    case 'MINUS': return left - right;
                    case 'MUL': return left * right;
                    case 'DIV': return left / right;
                    case 'MOD': return left % right;
                    case 'AND': return left && right;
                    case 'OR': return left || right;
                    default: throw new Error(`Unknown binop: ${expr[1]}`);
                }
            case 'unary':
                const val = this.eval_expr(expr[2]);
                return !val;
            case 'call':
                return this.call_function(expr[1], expr[2].map(e => this.eval_expr(e)));
            case 'list':
                return expr[1].map(e => this.eval_expr(e));
            default:
                throw new Error(`Invalid expression: ${expr}`);
        }
    }

    call_function(name, args) {
        switch (name) {
            case 'len': return args[0].length;
            case 'push': args[0].push(args[1]); return args[0];
            case 'pop': return args[0].pop();
            case 'join': return args[0].join(args[1] || '');
            case 'split': return args[0].split(args[1] || '');
            case 'reverse': return args[0].reverse();
            case 'sort': return args[0].sort();
            case 'map': return args[0].map(x => x);
            case 'filter': return args[0].filter(Boolean);
            case 'max': return Math.max(...args[0]);
            case 'min': return Math.min(...args[0]);
            case 'sum': return args[0].reduce((a, b) => a + b, 0);
            default: throw new Error(`Unknown function: ${name}`);
        }
    }
}

function runSimpleScript() {
    const code = editor.getValue();
    const outputEl = document.getElementById('output');
    outputEl.textContent = '';

    try {
        new Function(code);
        outputEl.textContent = 'Error: HEY! Stop putting JS here, we are learning SimpleScript! Enter VALID SimpleScript code.';
        return;
    } catch (e) {
        // Continue to SimpleScript parsing
    }



    try {
        const lexer = new Lexer(code);
        const parser = new Parser(lexer);
        const interpreter = new Interpreter(parser);
        interpreter.interpret();
    } catch (err) {
        outputEl.textContent = 'Error: ' + err.message;
    }
}
