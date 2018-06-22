enum Token {
    LBRACKET = 1, //[
    LBRACE, //{
    RBRACKET, //]
    RBRACE,//}
    COLON,//:
    COMMA, //,
    BOOL, // true,false
    LITERAL,
    EOF,
    SPACE,
}

function printToken(tk: Token): string {
    switch (tk) {
        case Token.LBRACE:
            return "LEFT_BRACKET"
        default:
            return "UNKNOWN";
    }
}

class Chunk {
    constructor(public kind: Token,
        public startPos?: number,
        public endPos?: number, ) { }
}

class CharStream implements IterableIterator<string>{
    pos: number;
    source: String;
    constructor(source: String) {
        this.source = source;
        this.pos = 0;
    }
    next(): IteratorResult<string> {
        if (this.pos > this.source.length - 1) {
            return { done: true, value: "EOF" }
        }
        const ch = this.source.charAt(this.pos);
        this.pos++// advance cursor
        return { value: ch, done: false }
    }
    [Symbol.iterator](): IterableIterator<string> {
        return this
    }
    rewind() {
        this.pos--
    }
}


class Scanner implements IterableIterator<Chunk>{
    stream: CharStream;
    lastToken: Chunk;
    constructor(stream: CharStream) {
        this.stream = stream;
    }
    [Symbol.iterator]() {
        return this
    }
    next(): IteratorResult<Chunk> {
        const ch = this.stream.next()
        if (ch.done) {
            let tok = new Chunk(Token.EOF)
            this.lastToken = tok
            return { value: tok, done: true }
        }
        let startPos: number;
        if (this.lastToken) {
            startPos = this.lastToken.endPos
        } else {
            startPos = 0
        }
        switch (ch.value) {
            case '[':
                this.lastToken = new Chunk(Token.LBRACKET, startPos, this.stream.pos)
                return { value: this.lastToken, done: false }
            case '{':
                this.lastToken = new Chunk(Token.LBRACE, startPos, this.stream.pos)
                return { value: this.lastToken, done: false }
            case ']':
                this.lastToken = new Chunk(Token.RBRACKET, startPos, this.stream.pos)
                return { value: this.lastToken, done: false }
            case '}':
                this.lastToken = new Chunk(Token.RBRACE, startPos, this.stream.pos)
                return { value: this.lastToken, done: false }
            case ':':
                this.lastToken = new Chunk(Token.COLON, startPos, this.stream.pos)
                return { value: this.lastToken, done: false }
            case ',':
                this.lastToken = new Chunk(Token.COMMA, startPos, this.stream.pos)
                return { value: this.lastToken, done: false }
            case ' ':
            case '\n':
            case '\t':
                this.lastToken = new Chunk(Token.SPACE, startPos, this.stream.pos)
                return { value: this.lastToken, done: false }
            default:
                return this.scanLiteral()
        }
    }

    scanLiteral(): IteratorResult<Chunk> {
        let buf = ""
        let startPos: number
        if (this.lastToken) {
            startPos = this.lastToken.endPos
        } else {
            startPos = 0
        }
        for (let ch of this.stream) {
            if (isTerminal(ch)) {
                this.stream.rewind()
                break
            }
            buf += ch
        }
        let kind: Token
        switch (buf) {
            case "true":
            case "false":
                kind = Token.BOOL
                break;
            default:
                kind = Token.LITERAL
                break;
        }
        const tok = new Chunk(kind, startPos, this.stream.pos)
        this.lastToken = tok
        return { value: tok, done: false }
    }
    text(tok: Chunk): string {
        return this.stream.source.slice(tok.startPos, tok.endPos)
    }
}

function isTerminal(ch: string): boolean {
    switch (ch) {
        case '[':
        case '{':
        case ']':
        case '}':
        case ':':
        case ',':
        case ' ':
        case '\n':
        case '\t':
        case '\r':
            return true
        default:
            return false
    }
}

export {
    Scanner, CharStream
}