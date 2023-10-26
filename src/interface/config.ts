

interface IAxiomConfig {
    token: string
    orgId: string
}


interface ISlackConfig {
  signingSecret: string;
  botToken: string;
  appToken: string;
  clientId: string;
  clientSecret: string;
}

interface IDB {
  url: string;
  name: string
}
export interface IConfig {
    axiom: IAxiomConfig
    slack?: ISlackConfig
    port: number
    slackDataset: string
    db: IDB
}