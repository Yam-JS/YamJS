package yamjs;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.simpleyaml.configuration.ConfigurationSection;
import org.simpleyaml.configuration.file.YamlFile;

public class Config {
   /*
    * The "main" property within the config.
    */
   public String main = "index.js";

   public String pluginName = "YamJS";

   /**
    * This property determines whether the JavaScript initialization
    * function should be called.
    */
   public boolean initialize = true;

   /**
    * Enables verbose logging.
    */
   public boolean verbose = false;

   /**
    * Creates a new configuration from the given options.
    */
   public Config(String root, String path, String pluginName) {
      this.pluginName = pluginName;

      Path info = Paths.get(root, path);
      if (info.toFile().exists()) {
         try {
            StringBuilder builder = new StringBuilder();
            Files.lines(info).forEach(line -> builder.append(line).append("\n"));

            ConfigurationSection object = YamlFile.loadConfiguration(info.toFile()).getRoot();

            this.main = object.getString("main", this.main);
            this.verbose = object.getBoolean("verbose", this.verbose);
         } catch (Throwable error) {
            error.printStackTrace();
         }
      }
   }
}
