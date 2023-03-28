import { config as envConfig } from 'dotenv'

interface BaseConfig {
  environment: 'prod' | 'dev'
  isDev: boolean
  isProd: boolean
}

const parse = <T>(value: string | undefined, fallback: T, type: 'number' | 'string') => {
  if (value === undefined) {
    return fallback
  }

  if (type === 'number') {
    return parseInt(value) as unknown as T
  }

  return value as unknown as T
}

const createConfig = () => {
  envConfig()

  const isCi = process.env.CI === 'true'

  const options = {
    isCi,
    user: parse(process.env.BOT_USERNAME, 'testbot', 'string'),
    port: parse(process.env.BOT_PORT, 25565, 'number'),
    timeout: parse(process.env.TEST_TIMEOUT, isCi ? 60_000 : 30_000, 'number'),
  }

  const environment = 'dev'

  return {
    ...options,
    environment,
    isDev: environment === 'dev',
    isProd: false,
  }
}

export const appConfig = createConfig()
