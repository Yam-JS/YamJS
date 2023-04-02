/**
 * Simple type test
 */
import { Bukkit } from 'org.bukkit'

// @ts-expect-error -- Add Recipe
Java.type('org.bukkit.Bukkit').addRecipe()

// @ts-expect-error -- Add Recipe
Java.type<typeof Bukkit>('org.bukkit.Bukkit').addRecipe()
