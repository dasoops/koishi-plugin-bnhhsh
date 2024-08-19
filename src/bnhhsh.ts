import { CostRecord, Record, WordBucket } from "./wordBucket";


function yndp(wordBucket: WordBucket, target: string): [string, number] {
    const cost: CostRecord = { [-1]: 0 };
    const record: Record = { [-1]: [] };
    const n = Object.keys(wordBucket).length; // 假设n为词桶的最大key

    for (let x = 0; x < target.length; x++) {
        cost[x] = 2 ** 32;

        for (let k = n; k > 0; k--) {
            const s = x - k + 1;
            if (s < 0) {
                continue;
            }

            const wordEntry = wordBucket[k]?.[target.slice(s, x + 1)];
            if (wordEntry) {
                const [word, pain] = wordEntry;
                if (cost[x - k] + pain < cost[x]) {
                    cost[x] = cost[x - k] + pain;
                    record[x] = [...(record[x - k] || [])];
                    record[x].push([s, x + 1, word]);
                }
            }
        }

        if (cost[x - 1] + 1 < cost[x]) {
            cost[x] = cost[x - 1] + 1;
            record[x] = [...(record[x - 1] || [])];
        }
    }

    const targetArr = target.split("");
    for (const [a, b, c] of (record[target.length - 1] || []).reverse()) {
        targetArr.splice(a, b - a, ...c.split(""));
    }

    return [targetArr.join(""), cost[target.length - 1]];
}

function bnhhsh(wordBucket: WordBucket, message: string): string {
    return yndp(wordBucket, message)[0];
}

export default bnhhsh;
