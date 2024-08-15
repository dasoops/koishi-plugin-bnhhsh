import { Context, Schema } from 'koishi'
import bnhhsh from "./bnhhsh";

export const name = 'bnhhsh'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context, config: Config) {
  ctx.command('这是什么 <message>')
    .action((argv, message) => {
      const result = bnhhsh(message);
      ctx.logger("bnhhsh").info(`${message} -> ${result}`)
      return(<>
        <quote id={argv.session.messageId}/>
        {result}
      </>)
      }
    )
}
