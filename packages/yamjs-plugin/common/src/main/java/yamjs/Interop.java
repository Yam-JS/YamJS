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
