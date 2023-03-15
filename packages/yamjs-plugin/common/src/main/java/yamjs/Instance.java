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

import org.graalvm.polyglot.Engine;

import java.util.ArrayList;
import java.util.LinkedList;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;

public class Instance {

   /** The underlying context associated with this instance. */
   public Context context;

   /* Track whether the context is active, to safely close if needed. */
   public boolean isContextActive = false;

   /** The engine used for all instance contexts. */
   public static final Engine engine = Engine.newBuilder().option("engine.WarnInterpreterOnly", "false").build();

   /** All registered unload hooks tied to this instance. */
   public final Queue hooks = new Queue();

   /** All queued messages created by this instance. */
   public final LinkedList<Message> messages = new LinkedList<>();

   /** Metadata associated with this instance. */
   public String meta;

   /** The root directory of this instance. */
   public String root;

   /**
    * The tick function associated with this instance, if any.
    * This is provided by the JavaScript implementation.
    */
   public Value tickFn;

   /**
    * The close function associated with this instance, if any.
    */
   public Value onClose;

   /** All queued tasks linked to this instance. */
   public final Queue tasks = new Queue();

   /** Builds a new instance from the given paths. */
   public Instance(String root, String meta) {
      this.meta = meta;
      this.root = root;
   }

   /** Closes this instance's context. */
   public void close() {
      if (this.isContextActive == false) {
         return;
      }

      Context context = this.context;
      if (this.onClose != null) {
         try {
            this.onClose.executeVoid();
         } catch (Throwable error) {
            error.printStackTrace();
         }
      }

      this.tasks.release();
      this.hooks.release();
      this.tickFn = null;
      this.onClose = null;

      context.close();

   }

   /** Closes this instance and removes it from the instance registry. */
   public void destroy() {
      this.close();
      YamJS.instances.remove(this);
   }

   /** Executes this instance by calling its entry point. */
   public void execute() throws Throwable {
      // do nothing
   }

   /** Opens this instance's context. */
   public void open() {
      this.context = Context.newBuilder("js")
            .engine(Instance.engine)
            .allowAllAccess(true)
            .allowExperimentalOptions(true)
            .option("js.nashorn-compat", "true")
            .option("js.commonjs-require", "true")
            .option("js.ecmascript-version", "2022")
            .option("js.commonjs-require-cwd", this.root)
            .build();
      this.context.getBindings("js").putMember("Yam", Value.asValue(new Api(this)));
      try {
         this.execute();
         this.isContextActive = true;
      } catch (Throwable error) {
         error.printStackTrace();
      }
   }

   /** Executes the tick loop for this instance. */
   public void tick() {
      if (this.tickFn != null && this.isContextActive == true) {
         try {
            this.tickFn.executeVoid();
         } catch (IllegalStateException error) {
            // do nothing when context is already closed
            error.printStackTrace();
         } catch (Throwable error) {
            error.printStackTrace();
         }
      }

      this.tasks.release();
      new ArrayList<>(this.messages).forEach(message -> {
         this.messages.remove(message);
         if (YamJS.channels.containsKey(message.channel)) {
            YamJS.channels.get(message.channel).forEach(listener -> {
               try {
                  listener.executeVoid(message.content);
               } catch (Throwable error) {
                  // do nothing
               }
            });
         }
      });
   }

   public void registerTickFn(Value fn) {
      this.tickFn = fn;
   }

   public void registerOnClose(Value fn) {
      this.onClose = fn;
   }
}
