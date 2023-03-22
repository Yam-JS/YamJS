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
import org.graalvm.polyglot.PolyglotException;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.function.Consumer;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;

public class Instance {

   public static int nextId = 0;

   public int id = -1;

   /** The underlying context associated with this instance. */
   public Context context;

   /** The engine used for all instance contexts. */
   public static final Engine engine = Engine.newBuilder().option("engine.WarnInterpreterOnly", "false").build();

   /** All registered unload hooks tied to this instance. */
   public final Queue hooks = new Queue(this);

   /** All queued messages created by this instance. */
   public final LinkedList<Message> messages = new LinkedList<>();

   /** Metadata associated with this instance. */
   public String meta;

   /** The root directory of this instance. */
   public String root;

   public int tickCount = 0;

   /**
    * The tick function associated with this instance.
    */
   public JsCallback<Void> tickFn = new JsCallback<Void>(this);

   /** The close function associated with this instance. */
   public JsCallback<Void> onCloseFn = new JsCallback<Void>(this);

   /** The logger function associated with this instance. */
   public JsCallback<JsError> loggerFn = new JsCallback<JsError>(this, true);

   /** All queued tasks linked to this instance. */
   public final Queue tasks = new Queue(this);

   /** Builds a new instance from the given paths. */
   public Instance(String root, String meta) {
      this.meta = meta;
      this.root = root;
   }

   /** Closes this instance's context. */
   public void close() {
      this.onCloseFn.execute(null);
      Context context = this.context;
      this.hooks.release();

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
      this.id = Instance.nextId++;
      this.tickCount = 0;
      this.context = Context.newBuilder("js")
            .engine(Instance.engine)
            .allowAllAccess(true)
            .allowExperimentalOptions(true)
            .option("js.nashorn-compat", "true")
            .option("js.commonjs-require", "true")
            .option("js.ecmascript-version", "2022")
            .option("js.commonjs-require-cwd", this.root)
            .build();
      this.context.getBindings("js").putMember("__interop", Value.asValue(new Interop()));
      this.context.getBindings("js").putMember("Yam", Value.asValue(new Api(this)));

      try {
         this.execute();
      } catch (Throwable error) {
         error.printStackTrace();
      }
   }

   /** Executes the tick loop for this instance. */
   public void tick() {
      this.tickCount++;
      this.tickFn.execute(null);

      this.tasks.release();
      new ArrayList<>(this.messages).forEach(message -> {
         this.messages.remove(message);
         if (YamJS.channels.containsKey(message.channel)) {
            YamJS.channels.get(message.channel).forEach(listener -> {
               try {
                  listener.executeVoid(message.content);
               } catch (Throwable error) {
                  error.printStackTrace();
               }
            });
         }
      });
   }

   public void logError(Throwable error) {
      if (error instanceof IllegalStateException) {
         // Ignore the error when spinning up the environment. This happens more from
         // reloading.
         if (error.getMessage().contains("Multi threaded access requested by thread Thread") && this.tickCount < 100) {
            return;
         }

         error.printStackTrace();

         return;
      }

      if (error instanceof PolyglotException) {
         PolyglotException polyglotException = (PolyglotException) error;

         JsError jsError = new JsError(polyglotException);

         try {
            this.loggerFn.execute(jsError);
            return;
         } catch (Throwable errorError) {
            error.printStackTrace();
            return;
         }
      }

      error.printStackTrace();
   }

   // Finding: This is a `Consumer` as it works best with the reload configuration.
   // If we change it to `Value`, it breaks reloading.
   public void setTickFn(Consumer<Void> tickFn) {
      this.tickFn.register(tickFn);
   }

   public void setOnCloseFn(Consumer<Void> onCloseFn) {
      this.onCloseFn.register(onCloseFn);

   }

   public void setLoggerFn(Consumer<JsError> loggerFn) {
      this.loggerFn.register(loggerFn);

   }
}
