import yaml from 'yaml'

type BukkitYmlProps = {
  settings: {
    'allow-end': boolean
    'warn-on-overload': boolean
    'permissions-file': string
    'update-folder': string
    'plugin-profiling': boolean
    'connection-throttle': number
    'query-plugins': boolean
    'deprecated-verbose': string
    'shutdown-message': string
    'minimum-api': string
    'use-map-color-cache': boolean
  }
  'spawn-limits': {
    monsters: number
    animals: number
    'water-animals': number
    'water-ambient': number
    'water-underground-creature': number
    axolotls: number
    ambient: number
  }
  'chunk-gc': {
    'period-in-ticks': number
  }
  'ticks-per': {
    'animal-spawns': number
    'monster-spawns': number
    'water-spawns': number
    'water-ambient-spawns': number
    'water-underground-creature-spawns': number
    'axolotl-spawns': number
    'ambient-spawns': number
    autosave: number
  }
  aliases: string
}

const defaultBukkitBukkitYmlProps: BukkitYmlProps = {
  settings: {
    'allow-end': true,
    'warn-on-overload': true,
    'permissions-file': 'permissions.yml',
    'update-folder': 'update',
    'plugin-profiling': false,
    'connection-throttle': 4000,
    'query-plugins': true,
    'deprecated-verbose': 'default',
    'shutdown-message': 'Server closed',
    'minimum-api': 'none',
    'use-map-color-cache': true,
  },
  'spawn-limits': {
    monsters: 70,
    animals: 10,
    'water-animals': 5,
    'water-ambient': 20,
    'water-underground-creature': 5,
    axolotls: 5,
    ambient: 15,
  },
  'chunk-gc': {
    'period-in-ticks': 600,
  },
  'ticks-per': {
    'animal-spawns': 400,
    'monster-spawns': 1,
    'water-spawns': 1,
    'water-ambient-spawns': 1,
    'water-underground-creature-spawns': 1,
    'axolotl-spawns': 1,
    'ambient-spawns': 1,
    autosave: 6000,
  },
  aliases: 'now-in-commands.yml',
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

const defaultOverrides: RecursivePartial<BukkitYmlProps> = {
  settings: {
    'connection-throttle': -1,
  },
}

export const createBukkitYml = (overrides?: Partial<BukkitYmlProps>): string => {
  const props = {
    ...defaultBukkitBukkitYmlProps,
    ...defaultOverrides,
    ...overrides,

    settings: {
      ...defaultBukkitBukkitYmlProps.settings,
      ...defaultOverrides.settings,
      ...overrides?.settings,
    },

    // TODO: Add support for other properties
  }

  return yaml.stringify(props)
}
