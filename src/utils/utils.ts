export const cn = (...classes: Array<string | undefined>) => classes.filter(c => c !== undefined).join(' ');

export const lz = (v: number) => `0${v}`.slice(-2); // leading zero
