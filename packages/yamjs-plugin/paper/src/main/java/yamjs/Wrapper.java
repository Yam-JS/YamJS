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

import java.util.ArrayList;
import java.util.Arrays;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;

import org.graalvm.polyglot.Value;

public class Wrapper extends Command {

   /** The executor to use for this command. */
   public Value executor;

   /** The tab-completer to use for this command. */
   public Value tabCompleter;

   /** Creates a custom command with the given options. */
   public Wrapper (String name, String[] aliases) {
      super(name, "", "", Arrays.asList(aliases));
   }

   @Override
   public boolean execute (CommandSender sender, String label, String[] args) {
      try {
         this.executor.executeVoid(sender, label, args);
      } catch (Throwable error) {
         // do nothing
      }
      return true;
   }

   /** Sets this wrapper's command options. */
   public void options (String permission, String message, Value executor, Value tabCompleter) {
      this.executor = executor;
      this.tabCompleter = tabCompleter;
      this.setPermission(permission);
      this.setPermissionMessage(message);
   }

   @Override
   public ArrayList<String> tabComplete (CommandSender sender, String alias, String[] args) {
      ArrayList<String> output = new ArrayList<>();
      try {
         Value input = this.tabCompleter.execute(sender, alias, args);
         for (long index = 0; index < input.getArraySize(); index++) output.add(input.getArrayElement(index).toString());
      } catch (Throwable error) {
         // do nothing
      }
      return output;
   }
}
