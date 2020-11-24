interface Context {
    passed: number;
    failed: number;
    totalRuntime: number;
    errors: any[];
}
declare const testManger: {
    pass: (title: string, runtime: number) => void;
    fail: (title: string, runtime: number, error: Error) => void;
    get: () => Context;
};
export default testManger;
