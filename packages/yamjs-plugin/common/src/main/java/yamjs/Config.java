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

   /**
    * This property determines whether or not the JavaScript initialization
    * function should be called.
    */
   public boolean initialize = true;

   /**
    * Enables verbose logging.
    */
   public boolean verbose = true;

   /**
    * Creates a new configuration from the given options.
    */
   public Config(String root, String path) {
      Path info = Paths.get(root, path);
      if (info.toFile().exists()) {
         try {
            StringBuilder builder = new StringBuilder();
            Files.lines(info).forEach(line -> builder.append(line).append("\n"));

            ConfigurationSection object = YamlFile.loadConfiguration(info.toFile()).getRoot();

            this.main = object.getString("main");
         } catch (Throwable error) {
            error.printStackTrace();
         }
      }
   }
}
