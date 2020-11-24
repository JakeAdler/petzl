declare const log: (...messages: any[]) => void;
declare const addPadding: () => void;
declare const subtractPadding: () => void;
declare const hijackLogs: () => void, restoreLogs: () => void, printLogs: () => void;
export { log, addPadding, subtractPadding, hijackLogs, restoreLogs, printLogs };
