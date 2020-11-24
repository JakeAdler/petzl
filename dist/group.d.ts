declare const group: (title: string, cb: () => Promise<void> | void) => Promise<void>;
export default group;
