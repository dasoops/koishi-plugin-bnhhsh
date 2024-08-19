import { Context, Schema } from "koishi";
import bnhhsh from "./bnhhsh";
import { baseDirDefault, Config as ConfigImport, name as nameImport } from "./config";
import { WordBucket } from "./wordBucket";

export const name = nameImport;
export type Config = ConfigImport;
export const Config: Schema<Config> = ConfigImport;

export function apply(ctx: Context, config: Config): void {
    const logger = ctx.logger("bnhhsh");
    const wordBucket = new WordBucket({
        logger: logger,
        baseDir: baseDirDefault,
        imports: config.imports,
    });

    ctx.command("bnhhsh <message>")
        .alias("这是什么")
        .action((argv, message) => {
            const result = bnhhsh(wordBucket, message);
            logger.debug(`${message} -> ${result}`);
            return (<>
                <quote id={argv.session.messageId}/>
                {result}
            </>);
        });
}
