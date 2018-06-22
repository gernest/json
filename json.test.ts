import { Scanner, CharStream } from './json';



interface test {
    desc: string;
    run: (ctx: context) => void;
}

class context {
    pass: boolean;
    message?: string;
    messages: string[];
    children: context[];
    fn: (ctx: context) => void;
    constructor(public level = 0, public verbose = true) {
        this.pass = true;
        this.messages = [];
    }
    error(msg: string) {
        this.messages.push(msg)
        if (this.pass) {
            this.pass = false;
        }
    }
}
let results: context[] = [];

function describe(ctx: context, msg: string, fn: (ctx: context) => void) {
    let fnContext = new context(ctx.level++)
    fnContext.message = msg
    fnContext.fn = fn
    ctx.children ? ctx.children.push(fnContext) : [fnContext];
    if (ctx.level == 0) {
        results.push(fnContext)
    }
}


function run() {
    for (let ctx of results) {
        if (ctx.fn) {
            ctx.fn(ctx)
        }
    }
}