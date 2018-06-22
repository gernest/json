import { context, describe, run } from './test';


describe(new context(), "test suite", (ctx: context) => {
    ctx.error("fails")
})

run()