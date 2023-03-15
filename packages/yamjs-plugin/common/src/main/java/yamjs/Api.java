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

import java.io.File;

import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.UUID;

import org.graalvm.polyglot.Value;

public class Api {

   /** The underlying instance to which this API is linked. */
   private Instance instance;

   /** Builds a new YamJS API object around the given instance. */
   public Api(Instance instance) {
      this.instance = instance;
   }

   /** Destroys the current instance. */
   public void destroy() throws Exception {
      if (this.instance == YamJS.driver) {
         throw new Exception("The primary instance cannot be destroyed!");
      } else {
         this.instance.destroy();
      }
   }

   /**
    * Sends a message into the global event framework. Listeners will fire on next
    * tick.
    */
   public void emit(String channel, String message) {
      this.instance.messages.add(new Message(channel, message));
   }

   /** Creates a new file instance with the given index path. */
   public FileInstance fileInstance(String main) {
      return this.fileInstance(main, UUID.randomUUID().toString());
   }

   /** Creates a new file instance with the given index path and metadata tag. */
   public FileInstance fileInstance(String main, String meta) {
      FileInstance instance = new FileInstance(this.instance.root, main, meta);
      YamJS.instances.add(instance);
      return instance;
   }

   /** Gets the "meta" value of the current instance. */
   public String getMeta() {
      return this.instance.meta;
   }

   /** Returns the "root" of the current instance. */
   public String getRoot() {
      return this.instance.root;
   }

   /** Returns the current configuration. */
   public Config getConfig() {
      return YamJS.config;
   }

   /** Adds an unload hook to be executed just before the instance is closed. */
   public void hook(Value script) {
      this.instance.hooks.list.add(script);
   }

   /** Loads the given class from the given source, usually a JAR library. */
   public Class<?> load(File source, String name) throws ClassNotFoundException, MalformedURLException {
      URL link = source.toURI().toURL();
      String path = source.toPath().normalize().toString();
      return Class.forName(name, true, YamJS.loaders.computeIfAbsent(path, (key) -> new URLClassLoader(
            new URL[] { link },
            YamJS.class.getClassLoader())));
   }

   /** Unregisters an event listener from the channel registry. */
   public boolean off(String channel, Value listener) {
      if (YamJS.channels.containsKey(channel)) {
         return YamJS.channels.get(channel).remove(listener);
      } else {
         return false;
      }
   }

   /** Registers an event listener to the channel registry. */
   public void on(String channel, Value listener) {
      YamJS.channels.computeIfAbsent(channel, key -> new LinkedList<>()).add(listener);
   }

   /** Pushes a script into the tick loop to be fired upon next tick. */
   public void push(Value script) {
      this.instance.tasks.list.add(script);
   }

   /** Creates a new script instance with the given source code. */
   public ScriptInstance scriptInstance(String code) {
      return this.scriptInstance(code, UUID.randomUUID().toString());
   }

   /**
    * Creates a new script instance with the given source code and metadata tag.
    */
   public ScriptInstance scriptInstance(String code, String meta) {
      ScriptInstance instance = new ScriptInstance(this.instance.root, code, meta);
      YamJS.instances.add(instance);
      return instance;
   }

   /**
    * Closes and re-opens the current instance. Works best when pushed into the
    * tick loop.
    */
   public void swap() {
      this.hook(Value.asValue((Runnable) () -> this.instance.open()));
      this.instance.close();
   }

   /**
    * Closes all open instances, resets everything, and swaps the main instance.
    */
   public void reload() throws Exception {
      if (this.instance == YamJS.driver) {
         new ArrayList<>(YamJS.instances).forEach(value -> value.destroy());
         YamJS.channels.clear();
         YamJS.loaders.clear();
         this.swap();
      } else {
         throw new Exception("This method may only be called from the main context!");
      }
   }

   /**
    * Registers a tick function.
    * 
    * @param fn The function to be registered.
    */
   public void registerTickFn(Value fn) {
      this.instance.registerTickFn(fn);
   }

   public void registerOnClose(Value fn) {
      this.instance.registerOnClose(fn);
   }
}
