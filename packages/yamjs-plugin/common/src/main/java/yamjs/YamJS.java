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

import java.net.URL;
import java.net.URLClassLoader;

import java.nio.file.Paths;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;

import org.graalvm.polyglot.Value;

public class YamJS {

   /** All registered cross-context channels. */
   public static final HashMap<String, LinkedList<Value>> channels = new HashMap<>();

   /** The instance running on the main thread. */
   public static FileInstance driver;

   /** All instances created with the instance management system. */
   public static final LinkedList<Instance> instances = new LinkedList<>();

   /** All registered class loaders. */
   public static final HashMap<String, URLClassLoader> loaders = new HashMap<>();

   /** Current configuration */
   public static Config config;

   /** Closes all open instances. */
   public static void close() {
      YamJS.driver.close();
      new ArrayList<>(YamJS.instances).forEach(value -> value.destroy());
   }

   /** Initializes the YamJS Environment. */
   public static void init(String root, String pluginName) {
      Paths.get(root).toFile().mkdir();
      YamJS.config = new Config(root, "config.yml", pluginName);
      YamJS.driver = new FileInstance(root, YamJS.config.main, "yamjs");

      try {
         YamJS.driver.open();
      } catch (Throwable error) {
         error.printStackTrace();
      }
   }

   /** Locates the given class's true source location. */
   public static URL locate(Class<?> clazz) {
      try {
         URL resource = clazz.getProtectionDomain().getCodeSource().getLocation();
         if (resource instanceof URL)
            return resource;
      } catch (SecurityException | NullPointerException error) {
         // do nothing
      }
      URL resource = clazz.getResource(clazz.getSimpleName() + ".class");
      if (resource instanceof URL) {
         String link = resource.toString();
         String suffix = clazz.getCanonicalName().replace('.', '/') + ".class";
         if (link.endsWith(suffix)) {
            String path = link.substring(0, link.length() - suffix.length());
            if (path.startsWith("jar:"))
               path = path.substring(4, path.length() - 2);
            try {
               return new URL(path);
            } catch (Throwable error) {
               // do nothing
            }
         }
      }
      return null;
   }

   /** Executes the task loop for all instances. */
   public static void tick() {
      YamJS.driver.tick();
      YamJS.instances.forEach(value -> value.tick());
   }

   /** Updates the current ClassLoader to one which supports the GraalJS engine. */
   public static void patch(Loader loader) {
      try {
         loader.addURL(YamJS.locate(YamJS.class));
         Thread.currentThread().setContextClassLoader((ClassLoader) loader);
      } catch (Throwable error) {
         throw new RuntimeException("Failed to load classes!", error);
      }
   }
}
