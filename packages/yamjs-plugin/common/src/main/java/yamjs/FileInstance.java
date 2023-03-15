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
import java.io.IOException;

import java.nio.file.Paths;

import org.graalvm.polyglot.Source;

public class FileInstance extends Instance {

   /** The main path of this instance, which ideally points to a JavaScript file. */
   public String main;
   
   /** Builds a new file-based instance from the given paths. */
   public FileInstance (String root, String main, String meta) {
      super(root, meta);
      this.main = main;
   }

   /** Executes this InstanceFile */
   @Override
   public void execute () throws IOException {
      File index = Paths.get(this.root).resolve(this.main).toFile();
      if (index.exists()) {
         this.context.eval(Source.newBuilder("js", index).mimeType("application/javascript+module").build());
      } else {
         index.createNewFile();
      }
   }
}
