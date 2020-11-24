# Petzl

A minimal asynchronous testing harness

**Why?**

While writing [Algotia](https://github.com/Algotia), I became dissatisfied with how frameworks like Jest and Mocha kept getting in my way.

**What does it do differently then those other libraries?**

-   Does not run tests by file name, (in fact, there is no test runner at all!)
-   Does not provide hooks like `before` and `after`
-   Does not provide an assertion library
-   Tests and groups are asynchronous functions

**...so what *does* it do?**

Not a whole lot, but thats the point!

-   Wraps tests in a very thin layer that keeps track of 3 things:
    -   Whether the async callback resolves or rejects
    -   How long the test runs
    -   Any console logs that were fired during the test.
-   Wraps groups in an even thinner layer that simply
    -   Prints the name of the group
    -   Pads any console logs for visual separation
-   Provides a lightweight reporter


**Well thats not very fun...**

It's not supposed to be!
I needed a minimal, extensible solution that got the f out of my way.

**Ok... how does it work?**

Here are some recipes:

### Basic example

```js
import {test, report} from "petzl"
import assert from "assert"

// Until there is top-level async/await support, you can do something like this
// And yes, I know its ugly.

(async () => {
  try {
    await test("1 + 1 = 2", () => {
      assert(1 + 1 === 2)
    });
  } finally {
    report()
  }
})()
```

### Macro pattern

```js

import {test, report} from "petzel"
import assert from "assert"

(async () => {
  const employees = ["Michael", "Dwight", "Jim"];
  
  for (const employee of employees) {
    
	const titleFunc = (shouldBeEmployee) => shouldBeEmployee + ' test';

    await test(titleFunc, (person) => {
      assert(typeof person === "string")
    }, employee);
    
  }
});

```
