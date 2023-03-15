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

import net.minestom.server.MinecraftServer;

import net.minestom.server.extensions.Extension;

import net.minestom.server.timer.SchedulerManager;
import net.minestom.server.utils.time.TimeUnit;

public class Main extends Extension {
   private SchedulerManager schedulerManager = MinecraftServer.getSchedulerManager();
   @Override

   public LoadStatus initialize() {
      YamJS.patch(new Loader(this.getClass().getClassLoader())); // CORE - patch class loader with GraalJS
      schedulerManager.buildTask(() -> {
         schedulerManager.buildTask(() -> {
            YamJS.tick();
         }).repeat(1, TimeUnit.TICK).schedule(); // CORE - run task loop
         YamJS.init(this.getDataDirectory().toString()); // CORE - initialize
      }).delay(50, TimeUnit.MILLISECOND).schedule(); // delay 1/2 a second
      this.getLogger().info("[YamJS] Initialized!");
      return LoadStatus.SUCCESS;
   }
   @Override
   public void terminate() {
      YamJS.close(); // CORE - close before exit
   }
}
