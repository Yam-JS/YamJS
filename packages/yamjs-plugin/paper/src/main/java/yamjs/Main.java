/*
 * MIT License
 * 
 * Copyright (c) 2022 The Grakkit Project
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package yamjs;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.sql.DriverManager;

import java.util.HashMap;

import org.bukkit.command.CommandMap;
import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.plugin.java.JavaPlugin;

import org.graalvm.polyglot.Value;

public class Main extends JavaPlugin {

   /** A list of all registered commands. */
   public static final HashMap<String, Wrapper> commands = new HashMap<>();

   /** The internal command map used to register commands. */
   public static CommandMap registry;

   private String getPluginName() {
      // Get the input stream for the plugin.yml file
      InputStream inputStream = getResource("plugin.yml");

      // Create an InputStreamReader using the input stream and UTF-8 encoding
      InputStreamReader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);

      // Load the YAML configuration from the reader
      YamlConfiguration config = YamlConfiguration.loadConfiguration(reader);

      return config.getString("name");
   }

   @Override
   public void onLoad() {
      // Black magic. This fixes a bug, as something is breaking SQL Integration for
      // other plugins.
      // See https://github.com/yamjs/yamjs/issues/14.
      DriverManager.getDrivers();
      YamJS.patch(new Loader(this.getClassLoader())); // CORE - patch class loader with GraalJS
      try {
         Field internal = this.getServer().getClass().getDeclaredField("commandMap");
         internal.setAccessible(true);
         Main.registry = (CommandMap) internal.get(this.getServer());
      } catch (Throwable error) {
         error.printStackTrace();
      }
   }

   @Override
   public void onEnable() {
      try {
         this.getServer().getScheduler().runTaskTimer(this, YamJS::tick, 0, 1); // CORE - run task loop
      } catch (Throwable error) {
         // none
      }
      YamJS.init(this.getDataFolder().getPath(), this.getPluginName()); // CORE - initialize
   }

   @Override
   public void onDisable() {
      YamJS.close(); // CORE - close before exit
      Main.commands.values().forEach(command -> {
         command.executor = Value.asValue((Runnable) () -> {
         });
         command.tabCompleter = Value.asValue((Runnable) () -> {
         });
      });
   }

   /** Registers a custom command to the server with the given options. */
   public void register(String namespace, String name, String[] aliases, String permission, String message,
         Value executor, Value tabCompleter) {
      String key = namespace + ":" + name;
      Wrapper command;
      if (Main.commands.containsKey(key)) {
         command = Main.commands.get(key);
      } else {
         command = new Wrapper(name, aliases);
         Main.registry.register(namespace, command);
         Main.commands.put(key, command);
      }
      command.options(permission, message, executor, tabCompleter);
   }
}
