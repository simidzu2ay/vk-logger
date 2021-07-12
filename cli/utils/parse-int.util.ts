import { InvalidArgumentError } from 'commander';

export const parseIntArrayUtil = (value: string, prev: number[]) => {
    const ans: number[] = [];
    if (prev) ans.push(...prev);
    ans.push(parseIntUtil(value));

    return ans;
};

export const parseIntUtil = (value: string) => {
    const num = +value;

    if (isNaN(num)) throw new InvalidArgumentError('Not a number.');

    return num;
};
