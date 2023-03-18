/*
 * MIT License
 *
 * Copyright (c) 2020 https://github.com/Dysfold/craftjs/blob/17a5b811c1ed22a1e55647a89d5e360c98f3d958/LICENSE.md
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

import java.nio.charset.StandardCharsets;

import org.graalvm.polyglot.PolyglotException;

public class Interop {
  public String bytesToString(byte[] bytes) {
    return new String(bytes, StandardCharsets.UTF_8);
  }

  /**
   * Executes a function while catching polyglot exceptions thrown by it.
   * Java exceptions that don't pass at least one layer of JS are not caught.
   * 
   * @param func A function.
   * @return An error, or null if no error occurred.
   */
  public JsError catchError(Runnable func) {
    try {
      func.run();
      return null;
    } catch (PolyglotException e) {
      return new JsError(e);
    }
  }

  public double toDouble(double value) {
    return value;
  }

}
