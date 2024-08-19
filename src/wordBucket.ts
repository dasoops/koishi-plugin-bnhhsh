import pinyin from "pinyin";
import fs from "node:fs";
import path from "node:path";
import { Logger } from "koishi";
import { builtIn, Import } from "./config";

export type CostRecord = {
    [key: number]: number;
};

export type Record = {
    [key: number]: [number, number, string][];
};

type Bucket = {
    [key: number]: {
      [key: string]: [string, number];
    };
};

export class WordBucket {
    private logger: Logger;
    baseDir: string;
    private bucket: Bucket = [];

    constructor(props: {
        logger: Logger,
        baseDir: string,
        imports: Import[],
    }) {
        this.baseDir = props.baseDir;
        this.logger = props.logger;

        const isInitlization = fs.existsSync(this.baseDir);
        if (!isInitlization) this.initlization();

        this.load(props.imports);
    }

    private initlization(): void {
        this.logger.info("load builtIn wordBucket");
        fs.mkdirSync(this.baseDir, { recursive: true });
        builtIn.forEach(({ name }) => {
            const nameWithExt = `${name}.json`;
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const content = JSON.stringify(require(`../assets/${nameWithExt}`));
            fs.writeFileSync(path.resolve(this.baseDir, nameWithExt), content);
        });
    }

    load(imports: Import[]): void {
        imports
            .filter(it => it.enable)
            .forEach(({ file, pain }) => {
                this.logger.debug(`load ${file}`);
                let content: string;
                try {
                    content = fs.readFileSync(file).toString();
                } catch (e) {
                    this.logger.error(`load failed: ${file}`, e);
                }
                const words = JSON.parse(content);
                for (const word of words) {
                    const key = WordBucket.pinyinFirstLetter(word);
                    const lengthBucket = this.bucket[word.length] || {};

                    if (lengthBucket[key]) {
                        if (lengthBucket[key][1] > pain) {
                            lengthBucket[key] = [word, pain];
                        }
                    } else {
                        lengthBucket[key] = [word, pain];
                    }

                    this.bucket[word.length] = lengthBucket;
                }
            });
    }

    private static pinyinFirstLetter(chinese: string): string {
        const q = pinyin(chinese, { style: pinyin.STYLE_FIRST_LETTER });
        return q.map((x: string[]) => x[0].toLowerCase()).join("");
    }


    private yndp(target: string): [string, number] {
        const cost: CostRecord = { [-1]: 0 };
        const record: Record = { [-1]: [] };
        const n = Object.keys(this.bucket).length; // 假设n为词桶的最大key

        for (let x = 0; x < target.length; x++) {
            cost[x] = 2 ** 32;

            for (let k = n; k > 0; k--) {
                const s = x - k + 1;
                if (s < 0) {
                    continue;
                }

                const wordEntry = this.bucket[k]?.[target.slice(s, x + 1)];
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

    bnhhsh(message: string): string {
        return this.yndp(message)[0];
    }
}
