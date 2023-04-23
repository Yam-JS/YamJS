package yamjs;

import java.util.function.Consumer;

public class JsCallback<Args> {
  public int id;
  public Consumer<Args> fn;
  public Instance instance;
  public boolean skipErrorHandling = false;

  public JsCallback(Instance instance) {
    this.instance = instance;
  }

  public JsCallback(Instance instance, boolean skipErrorHandling) {
    this.instance = instance;
    this.skipErrorHandling = skipErrorHandling;
  }

  public void register(Consumer<Args> fn) {
    this.fn = fn;
    this.id = this.instance.id;
  }

  public void execute(Args value) {
    this.execute(value, false);
  }

  public void execute(Args value, boolean throwError) {
    if (this.hasCallback() == false) {
      if (throwError) {
        throw new RuntimeException("No callback registered.");
      }

      return;
    }

    // This can help catch race conditions, such as rapid reloads.
    if (this.id != this.instance.id) {
      if (throwError) {
        throw new RuntimeException("Callback registered to a different instance.");
      }

      return;
    }

    try {
      this.fn.accept(value);
    } catch (Throwable error) {
      if (!this.skipErrorHandling) {
        this.instance.logError(error);
      } else {
        throw error;
      }
    }
  }

  private boolean hasCallback() {
    return this.fn != null;
  }
}
