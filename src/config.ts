import { Schema } from "koishi";
import path from "node:path";

export const name = "@dasoops/bnhhsh";

export type Import = {
    file: string,
    pain: number,
    enable: boolean,
}

export interface Config {
    imports?: Import[];
}

export const baseDirDefault = `data/assets/${name}/wordBucket`;

export const builtIn = [
    { name: "色情词库", pain: 0.001 },
    { name: "莉沫词库", pain: 0.01 },
    { name: "色情词库_数据增强", pain: 0.1 },
    { name: "常用汉字", pain: 0.11 },
    { name: "现代汉语常用词表", pain: 0.2 },
];

const importDefault = builtIn.map(({ name, ...rest }) => {
    return {
        file: path.resolve(baseDirDefault, `${name}.json`),
        enable: true,
        ...rest,
    };
});

export const Config: Schema<Config> = Schema.object({
    imports: Schema.array(
        Schema.object({
            enable: Schema.boolean()
                .description("启用")
                .default(true),
            file: Schema.path({ filters: [{ name: "", extensions: [".json"] }] })
                .description("词库")
                .required(),
            pain: Schema.percent()
                .description("痛苦值")
                .max(1)
                .min(0.001)
                .step(0.001)
                .default(0.1),
        }),
    ).default(importDefault),
});
