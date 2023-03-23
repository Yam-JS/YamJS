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

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.PolyglotException.StackFrame;
import org.graalvm.polyglot.SourceSection;

public class JsError {

  public static class FrameInfo {

    /**
     * Whether this frame is Java or JS code.
     */
    public final boolean javaFrame;

    /**
     * Source module. For Java frames, this is a fully qualified class name.
     * For JS frames, this is path relative to plugin root.
     */
    public final String source;

    /**
     * Java method or JS function name.
     */
    public final String methodName;

    /**
     * File name (not path).
     */
    public final String fileName;

    /**
     * Line number in the file.
     */
    public final int line;

    public final StackFrame frame;

    public FrameInfo(StackFrame frame) {
      this.javaFrame = frame.isHostFrame();

      this.frame = frame;

      if (javaFrame) {
        StackTraceElement hostFrame = frame.toHostFrame();
        this.source = hostFrame.getClassName();
        this.methodName = hostFrame.getMethodName();
        this.fileName = hostFrame.getFileName();
        this.line = hostFrame.getLineNumber();
      } else {
        SourceSection location = frame.getSourceLocation();
        if (location != null) {
          this.source = location.getSource().getName();
          this.fileName = Path.of(source).getFileName().toString();
          this.line = location.getStartLine();
        } else {
          // Location is not available, fall back to defaults
          this.source = "unknown";
          this.fileName = "unknown";
          this.line = -1;
        }
        this.methodName = frame.getRootName();
      }

    }
  }

  /**
   * Error or exception name.
   */
  public final String name;

  /**
   * Error message.
   */
  public final String message;

  /**
   * Stack frames.
   */
  public final List<FrameInfo> stack;

  public JsError(PolyglotException e) {
    if (e.isHostException()) {
      this.name = e.asHostException().getClass().getName();
      this.message = e.getMessage();
    } else {
      this.name = e.getMessage();
      this.message = null;
    }
    this.stack = new ArrayList<>();
    for (StackFrame frame : e.getPolyglotStackTrace()) {
      stack.add(new FrameInfo(frame));
    }
  }
}