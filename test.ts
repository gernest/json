export class context {
    pass: boolean;
    message?: string;
    messages: string[];
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
    report() {
        if (this.pass) {
            if (this.message) {
                console.log(indent('✔ ' + this.message, this.level));
            }
        } else {
            if (this.message) {
                console.log(indent('✖ ' + this.message, this.level));
            }
            if (this.messages.length > 0) {
                this.messages.forEach((v: string) => {
                    console.log(indent('--- ' + v, this.level + 1))
                })
            }
        }

    }
    exec() {
        if (this.fn) {
            this.fn(this);
        }
        this.report()
    }
}

function indent(src: string, n: number): string {
    let x = "";
    for (let index = 0; index < n; index++) {
        x += ' '
    }
    return x + src
}

const results: context[] = [];

export function describe(ctx: context, msg: string, fn: (ctx: context) => void) {
    ctx.message = msg
    ctx.fn = fn
    results.push(ctx)
}

export function run() {
    results.forEach((v: context) => {
        v.exec()
    })
}