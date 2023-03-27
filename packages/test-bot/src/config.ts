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

const createConfig = <T>(options: T): T & BaseConfig => {
  envConfig()

  const environment = 'dev'

  return {
    ...options,
    environment,
    isDev: environment === 'dev',
    isProd: false,
  }
}

export const appConfig = createConfig({
  user: parse(process.env.BOT_USERNAME, '', 'string'),
  password: parse(process.env.BOT_PASSWORD, '', 'string'),
  name: parse(process.env.BOT_NAME, '', 'string'),
})
