interface ServerProperties {
  'enable-jmx-monitoring': boolean
  'rcon.port': number
  'rcon.password': string
  'level-seed': string
  gamemode: string
  'enable-command-block': boolean
  'enable-query': boolean
  'generator-settings': any
  'enforce-secure-profile': boolean
  'level-name': string
  motd: string
  'query.port': number
  pvp: boolean
  'generate-structures': boolean
  'max-chained-neighbor-updates': number
  difficulty: string
  'network-compression-threshold': number
  'max-tick-time': number
  'require-resource-pack': boolean
  'use-native-transport': boolean
  'max-players': number
  'online-mode': boolean
  'enable-status': boolean
  'allow-flight': boolean
  'initial-disabled-packs': string
  'broadcast-rcon-to-ops': boolean
  'view-distance': number
  'server-ip': string
  'resource-pack-prompt': string
  'allow-nether': boolean
  'server-port': number
  'enable-rcon': boolean
  'sync-chunk-writes': boolean
  'op-permission-level': number
  'prevent-proxy-connections': boolean
  'hide-online-players': boolean
  'resource-pack': string
  'entity-broadcast-range-percentage': number
  'simulation-distance': number
  'player-idle-timeout': number
  debug: boolean
  'force-gamemode': boolean
  'rate-limit': number
  hardcore: boolean
  'white-list': boolean
  'broadcast-console-to-ops': boolean
  'spawn-npcs': boolean
  'previews-chat': boolean
  'spawn-animals': boolean
  'function-permission-level': number
  'initial-enabled-packs': string
  'level-type': 'normal' | 'flat' | 'large_biomes' | 'amplified'
  'text-filtering-config': string
  'spawn-monsters': boolean
  'enforce-whitelist': boolean
  'spawn-protection': number
  'resource-pack-sha1': string
  'max-world-size': number
}

const baseServerProperties: ServerProperties = {
  'enable-jmx-monitoring': false,
  'rcon.port': 25575,
  'rcon.password': '',
  'level-seed': '',
  gamemode: 'survival',
  'enable-command-block': false,
  'enable-query': false,
  'generator-settings': '',
  'enforce-secure-profile': true,
  'level-name': 'world',
  motd: 'A Minecraft Server',
  'query.port': 25565,
  pvp: true,
  'generate-structures': true,
  'max-chained-neighbor-updates': 1000000,
  difficulty: 'easy',
  'network-compression-threshold': 256,
  'max-tick-time': 60000,
  'require-resource-pack': false,
  'use-native-transport': true,
  'max-players': 20,
  'online-mode': true,
  'enable-status': true,
  'allow-flight': false,
  'initial-disabled-packs': '',
  'broadcast-rcon-to-ops': true,
  'view-distance': 10,
  'server-ip': '',
  'resource-pack-prompt': '',
  'allow-nether': true,
  'server-port': 25565,
  'enable-rcon': false,
  'sync-chunk-writes': true,
  'op-permission-level': 4,
  'prevent-proxy-connections': false,
  'hide-online-players': false,
  'resource-pack': '',
  'entity-broadcast-range-percentage': 100,
  'simulation-distance': 10,
  'player-idle-timeout': 0,
  debug: false,
  'force-gamemode': false,
  'rate-limit': 0,
  hardcore: false,
  'white-list': false,
  'broadcast-console-to-ops': true,
  'spawn-npcs': true,
  'previews-chat': false,
  'spawn-animals': true,
  'function-permission-level': 2,
  'initial-enabled-packs': 'vanilla',
  'level-type': 'normal',
  'text-filtering-config': '',
  'spawn-monsters': true,
  'enforce-whitelist': false,
  'spawn-protection': 16,
  'resource-pack-sha1': '',
  'max-world-size': 29999984,
}

const defaultOverrides: Partial<ServerProperties> = {
  'level-type': 'flat',
  'online-mode': false,
}

export const createServerProperties = (overrides?: Partial<ServerProperties>): string => {
  const serverProperties = {
    ...baseServerProperties,
    ...defaultOverrides,
    ...overrides,
    ['level-type']: `minecraft:${overrides?.['level-type'] ?? baseServerProperties['level-type']}`,
  }

  const keys = Object.keys(serverProperties) as Array<keyof ServerProperties>

  return keys.map((key) => `${key}=${serverProperties[key]}`).join('\n')
}
