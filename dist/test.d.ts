declare type Test<T extends any[]> = (...args: T) => Promise<void> | void;
interface TestFunc {
    <T extends any[]>(title: string, cb: Test<T>, ...args: T): Promise<void>;
    before: () => Promise<void> | void;
    after: () => Promise<void> | void;
}
declare const test: TestFunc;
export default test;
