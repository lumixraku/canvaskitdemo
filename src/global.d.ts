// global.d.ts
declare global {
    interface Window {
        state: {
            pos: {
                x: number;
                y: number;
            };
        };
    }    
    interface GlobalThis {
        state: {
            pos: {
                x: number;
                y: number;
            };
        };
    }
}

export { };