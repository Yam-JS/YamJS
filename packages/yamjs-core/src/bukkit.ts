import { Bukkit } from 'org.bukkit'

export const bukkitManager = Bukkit.getPluginManager()
export const bukkitPlugin = bukkitManager.getPlugin(Yam.getConfig().pluginName)
export const bukkitServer = Bukkit.getServer()
