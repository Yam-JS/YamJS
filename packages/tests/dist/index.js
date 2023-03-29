/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// NAMESPACE OBJECT: ../yamjs-legacy/src/stdlib/index.ts
var stdlib_namespaceObject = {};
__webpack_require__.r(stdlib_namespaceObject);
__webpack_require__.d(stdlib_namespaceObject, {
  "chain": () => (chain),
  "command": () => (command),
  "context": () => (context),
  "data": () => (data),
  "desync": () => (desync),
  "env": () => (env),
  "fetch": () => (fetch),
  "file": () => (file),
  "load": () => (load),
  "push": () => (push),
  "regex": () => (regex),
  "reload": () => (reload),
  "root": () => (root),
  "session": () => (session),
  "simplify": () => (simplify),
  "sync": () => (sync),
  "task": () => (task)
});

;// CONCATENATED MODULE: ../yamjs-core/src/bukkit.ts
var Bukkit = Java.type("org.bukkit.Bukkit");
var bukkitManager = Bukkit.getPluginManager();
var bukkit_bukkitPlugin = bukkitManager.getPlugin(Yam.getConfig().pluginName);
var bukkitServer = Bukkit.getServer();
;// CONCATENATED MODULE: ../yamjs-core/src/debug.ts
var Runtime = Java.type("java.lang.Runtime");
var System = Java.type("java.lang.System");

var scan = javaObject => {
  var keys = Object.keys(javaObject);
  var result = keys.reduce((acc, key) => {
    var _value$toString;
    var value = javaObject[key];
    acc[key] = value === null || value === void 0 ? void 0 : (_value$toString = value.toString) === null || _value$toString === void 0 ? void 0 : _value$toString.call(value);
    return acc;
  }, {});
  return result;
};
var getDebugInfo = () => {
  var Long = Java.type('java.lang.Long');
  var Bukkit = Java.type('org.bukkit.Bukkit');
  var serverRoot = bukkitPlugin.getDataFolder().getParentFile().getParentFile();
  var plugins = Bukkit.getPluginManager().getPlugins().map(plugin => plugin.getName());
  var info = {
    yamJS: {
      coreVersion: '0.0.1',
      pluginVersion: '0.0.1',
      legacyVersion: '0.0.1',
      instance: scan(Yam.instance)
    },
    server: {
      players: "".concat(Bukkit.getOnlinePlayers().size(), " / ").concat(Bukkit.getMaxPlayers()),
      plugins,
      minecraftVersion: Bukkit.getVersion(),
      bukkitVersion: Bukkit.getBukkitVersion(),
      onlineMode: Bukkit.getOnlineMode()
    },
    java: {
      version: System.getProperty('java.version'),
      vendor: System.getProperty('java.vendor'),
      vendorUrl: System.getProperty('java.vendor.url'),
      home: System.getProperty('java.home'),
      command: System.getProperty('sun.java.command'),
      timezone: System.getProperty('user.timezone')
    },
    system: {
      os: {
        name: System.getProperty('os.name'),
        version: System.getProperty('os.version'),
        arch: System.getProperty('os.arch')
      },
      cpu: {
        cores: Runtime.getRuntime().availableProcessors()
      },
      memory: {
        free: Runtime.getRuntime().freeMemory(),
        max: Runtime.getRuntime().maxMemory() == Long.MAX_VALUE ? 'unlimited' : Runtime.getRuntime().maxMemory(),
        total: Runtime.getRuntime().totalMemory()
      },
      storage: {
        free: serverRoot === null || serverRoot === void 0 ? void 0 : serverRoot.getFreeSpace(),
        total: serverRoot === null || serverRoot === void 0 ? void 0 : serverRoot.getTotalSpace(),
        usable: serverRoot === null || serverRoot === void 0 ? void 0 : serverRoot.getUsableSpace()
      }
    }
    // TODO: Context count
    // TODO: Event registered count
    // TODO: Command registered count
    // TODO: Server started at
    // TODO: Plugins loaded at
  };

  // "   build date: " + ManifestUtil.getManifestValue("Build-Date"),
  // "   build git revision: " + ManifestUtil.getManifestValue("Git-Revision"),
  // "   build number: " + ManifestUtil.getManifestValue("Build-Number"),
  // "   build origin: " + ManifestUtil.getManifestValue("Build-Origin"),

  return info;
};
;// CONCATENATED MODULE: ../../node_modules/vlq/src/index.js
/** @type {Record<string, number>} */
let char_to_integer = {};

/** @type {Record<number, string>} */
let integer_to_char = {};

'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	.split('')
	.forEach(function (char, i) {
		char_to_integer[char] = i;
		integer_to_char[i] = char;
	});

/** @param {string} string */
function decode(string) {
	/** @type {number[]} */
	let result = [];

	let shift = 0;
	let value = 0;

	for (let i = 0; i < string.length; i += 1) {
		let integer = char_to_integer[string[i]];

		if (integer === undefined) {
			throw new Error('Invalid character (' + string[i] + ')');
		}

		const has_continuation_bit = integer & 32;

		integer &= 31;
		value += integer << shift;

		if (has_continuation_bit) {
			shift += 5;
		} else {
			const should_negate = value & 1;
			value >>>= 1;

			if (should_negate) {
				result.push(value === 0 ? -0x80000000 : -value);
			} else {
				result.push(value);
			}

			// reset
			value = shift = 0;
		}
	}

	return result;
}

/** @param {number | number[]} value */
function encode(value) {
	if (typeof value === 'number') {
		return encode_integer(value);
	}

	let result = '';
	for (let i = 0; i < value.length; i += 1) {
		result += encode_integer(value[i]);
	}

	return result;
}

/** @param {number} num */
function encode_integer(num) {
	let result = '';

	if (num < 0) {
		num = (-num << 1) | 1;
	} else {
		num <<= 1;
	}

	do {
		let clamped = num & 31;
		num >>>= 5;

		if (num > 0) {
			clamped |= 32;
		}

		result += integer_to_char[clamped];
	} while (num > 0);

	return result;
}

;// CONCATENATED MODULE: ../yamjs-core/src/sourceMap.ts
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

function createCachedMap(raw) {
  // Parse VLQ-formatted line and column positions
  var lines = raw.mappings.split(';').map(line => line.split(','));
  var decoded = lines.map(line => line.map(col => vlq.decode(col)));
  return {
    sources: raw.sources,
    mappings: decoded,
    startOffset: 0
  };
}
function loadSourceMap(fileContents) {
  var sourceMap = JSON.parse(fileContents);
  return createCachedMap(sourceMap);
}

/**
 * Cached source maps.
 */
var cachedMaps = new Map();
function cacheSourceMap(file, content, startOffset) {
  var map = loadSourceMap(content);
  if (map) {
    map.startOffset = startOffset;
    cachedMaps.set(file, map);
    return true;
  }
  return false;
}
function mapLineInternal(_ref, jsLine) {
  var {
    mappings,
    sources
  } = _ref;
  // Advance through both files and lines in source map
  var sourceLine = 0;
  var sourceFile = 0;
  var result = 0;
  for (var i = 0; i < mappings.length; i++) {
    var line = mappings[i];
    line.forEach(segment => {
      var _segment$, _segment$2;
      sourceLine += (_segment$ = segment[2]) !== null && _segment$ !== void 0 ? _segment$ : 0;
      sourceFile += (_segment$2 = segment[1]) !== null && _segment$2 !== void 0 ? _segment$2 : 0;
    });

    // Return TS file/line number when we reach given JS line number
    if (i + 1 === jsLine) {
      result = sourceLine + 1;
      return {
        file: sources[sourceFile],
        line: result
      };
    }
  }
  throw new Error("source map failed for line ".concat(jsLine));
}
function mapLineToSource(file, line) {
  var map = cachedMaps.get("".concat(file));
  if (map) {
    line -= map.startOffset; // Apply start offset
    if (line <= 0) {
      return {
        file: file,
        line: line
      }; // Not mapped line
    }

    var result = mapLineInternal(map, line);
    if (result.file.startsWith('webpack://test/')) {
      result.file = result.file.replace('webpack://test/', '');
    }
    if (result.file.startsWith('../')) {
      result.file = result.file.replace('../', './');
    }
    return result;
  } else {
    // Mapping not found, return original JS file and line
    return {
      file,
      line
    };
  }
}
;// CONCATENATED MODULE: ../yamjs-core/src/errors.ts
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var errors_Bukkit = Java.type('org.bukkit.Bukkit');
var MiniMessage = Java.type('net.kyori.adventure.text.minimessage.MiniMessage');
var space = '      ';
var javaSourceMethodSkips = ['yamjs.Interop.catchError', 'com.oracle.truffle.polyglot.PolyglotFunctionProxyHandler.invoke', 'jdk.proxy1.$Proxy75.run'];
var jsFileSkips = ['webpack/runtime/make'];
var jsMethodSkips = ['catchAndLogUnhandledErrors'];
var formatError = error => {
  var list = [];
  list.push(error.name);
  var _loop = function _loop() {
    var item = error.stack[i];

    // JAVA
    if (item.javaFrame) {
      if (javaSourceMethodSkips.includes("".concat(item.source, ".").concat(item.methodName))) return "continue";
      list.push("".concat(space, "at ").concat(item.source, ".").concat(item.methodName, "(").concat(item.fileName, ":").concat(item.line, ")"));
      return "continue";
    }

    // JAVASCRIPT
    var source = mapLineToSource(item.source, item.line);

    // - SKIPS
    if (jsFileSkips.some(skip => source.file.includes(skip))) return "continue";
    if (jsMethodSkips.includes(item.methodName)) return "continue";
    if (source.line === 0) return "continue";
    var methodName = item.methodName || '<anonymous>';
    if (item.methodName === ':=>') {
      methodName = '<anonymous>';
    }
    list.push("".concat(space, "at ").concat(methodName, " (").concat(source.file, ":").concat(source.line, ") [").concat(item.source, ":").concat(item.line, "]"));
  };
  for (var i = 0; i < error.stack.length; i++) {
    var _ret = _loop();
    if (_ret === "continue") continue;
  }
  return list.join('\n');
};
var logError = (error, msg) => {
  var jsError;
  try {
    var _error$getClass$getNa, _error$getClass, _error$getClass$call, _error$getClass$call$;
    // @ts-expect-error
    var errorType = (_error$getClass$getNa = error === null || error === void 0 ? void 0 : (_error$getClass = error.getClass) === null || _error$getClass === void 0 ? void 0 : (_error$getClass$call = _error$getClass.call(error)) === null || _error$getClass$call === void 0 ? void 0 : (_error$getClass$call$ = _error$getClass$call.getName) === null || _error$getClass$call$ === void 0 ? void 0 : _error$getClass$call$.call(_error$getClass$call)) !== null && _error$getClass$getNa !== void 0 ? _error$getClass$getNa : undefined;
    if (errorType !== null && errorType !== void 0 && errorType.includes('yamjs.JsError')) {
      jsError = error;
    } else {
      // @ts-expect-error
      jsError = __interop.catchError(() => {
        throw error;
      });
    }
    var errorMsg = formatError(jsError);
    msg && errors_Bukkit.getConsoleSender().sendMessage(msg);
    errors_Bukkit.getConsoleSender().sendMessage(MiniMessage.miniMessage().deserialize("<red>".concat(errorMsg, "</red>")));
  } catch (logError) {
    console.log('ERROR: There was an error logging an error. Please report to YamJS. ', logError.name);
    console.log(logError.message, logError.stack);
    // @ts-expect-error
    console.log('Original error: ', error === null || error === void 0 ? void 0 : error.name);
    // @ts-expect-error
    console.log(error === null || error === void 0 ? void 0 : error.message, error === null || error === void 0 ? void 0 : error.stack);
  }
};
var catchAndLogUnhandledError = (fn, msg) => {
  try {
    return fn();
  } catch (error) {
    logError(error, msg);
  }
};
var asyncCatchAndLogUnhandledError = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (fn, msg) {
    try {
      return yield fn();
    } catch (error) {
      logError(error, msg);
    }
  });
  return function asyncCatchAndLogUnhandledError(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var createCatchAndLogUnhandledErrorHandler = (fn, msg) => function () {
  try {
    return fn(...arguments);
  } catch (error) {
    logError(error, msg);
  }
};
;// CONCATENATED MODULE: ../yamjs-core/src/registerEvent.ts
var EventPriority = Java.type("org.bukkit.event.EventPriority");
var Listener = Java.type("org.bukkit.event.Listener");



/** A valid event priority. */

var createEventListener = () => new (Java.extend(Listener, {}))();
var MainInstanceListener = createEventListener();

// @ts-expect-error

var registerEvent = function registerEvent(eventClass, eventListenerArg) {
  var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'HIGHEST';
  var listener = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : MainInstanceListener;
  var eventListener = {
    priority: 'priority' in eventListenerArg ? eventListenerArg.priority : priority,
    script: 'script' in eventListenerArg ? eventListenerArg.script : eventListenerArg
  };

  // @ts-expect-error [java-ts-bind classes missing class prototype methods]
  var name = eventClass.class.toString();
  bukkitManager.registerEvent(
  // @ts-expect-error [java-ts-bind missing class prototype]
  eventClass.class, listener, EventPriority.valueOf(eventListener.priority),
  // @ts-expect-error [EventExecutor]
  (x, signal) => {
    // @ts-expect-error [instancetype error]
    if (signal instanceof eventClass) {
      catchAndLogUnhandledError(() => {
        eventListener.script(signal);
      }, "An error occured while attempting to handle the \"".concat(name, "\" event!"));
    }
  }, bukkit_bukkitPlugin);
};
;// CONCATENATED MODULE: ../yamjs-core/src/util.ts
var isVerboseLoggingEnabled = undefined;
var logVerbose = function logVerbose() {
  if (isVerboseLoggingEnabled === undefined) {
    isVerboseLoggingEnabled = Yam.getConfig().verbose;
  }
  if (isVerboseLoggingEnabled) {
    console.log(...arguments);
  }
};
;// CONCATENATED MODULE: ../yamjs-core/src/ticker.ts
function ticker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function ticker_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { ticker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { ticker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Context = Symbol('TickContext');
var nextTick = () => {
  var ctx = ticker[Context];
  if (!ctx.isActive) return;
  for (var fn of ctx.tickFns) {
    fn(ctx.tick);
  }
  if (ctx.tick % 20 === 0) {
    logVerbose('Tick', ctx.tick);
  }
  ctx.tick += 1;
};
var createTicker = () => {
  var ctx = {
    tick: 0,
    task: undefined,
    isActive: false,
    tickFns: []
  };
  var start = () => {
    ctx.isActive = true;
    Yam.instance.setTickFn(nextTick);
  };
  var stop = /*#__PURE__*/function () {
    var _ref = ticker_asyncToGenerator(function* () {
      ctx.isActive = false;
      if (ctx.task) ctx.task.cancel();
      return;
    });
    return function stop() {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    [Context]: ctx,
    start,
    stop,
    getTick: () => ctx.tick,
    registerTickFn: fn => {
      ctx.tickFns.push(fn);
    }
  };
};
var ticker = createTicker();
;// CONCATENATED MODULE: ../yamjs-core/src/tasks.ts

var isTick = tick => true;
var isTaskId = id => true;
var tick = tick => tick;
var taskId = id => id;
var createTickerTasks = () => {
  var context = {
    nextId: 0
  };
  var taskIdMap = new Map();
  var remove = id => {
    if (!isTaskId(id)) return;
    taskIdMap.delete(id);
  };
  var add = (fn, baseTick, options) => {
    var _options$nextId;
    if (!isTick(baseTick)) return;
    var id = taskId((_options$nextId = options === null || options === void 0 ? void 0 : options.nextId) !== null && _options$nextId !== void 0 ? _options$nextId : context.nextId++);
    var targetTick = tick(ticker.getTick() + Math.max(baseTick, 1));

    // Handle TaskIdMap
    taskIdMap.set(id, {
      baseTick,
      tick: targetTick,
      fn,
      reset: (options === null || options === void 0 ? void 0 : options.reset) || false,
      id
    });
    return id;
  };
  var runTask = task => {
    taskIdMap.delete(task.id);
    task.fn();
    if (task.reset) {
      add(task.fn, task.baseTick, {
        reset: task.reset,
        nextId: task.id
      });
    }
  };
  var run = tick => {
    if (!isTick(tick)) return;
    for (var [, task] of taskIdMap) {
      if (tick >= task.tick) {
        runTask(task);
      }
    }
  };
  return {
    add,
    run,
    remove,
    initialize: () => {
      ticker.registerTickFn(tick => run(tick));
    }
  };
};
var tickerTasks = createTickerTasks();
;// CONCATENATED MODULE: ../yamjs-core/src/timers.ts


var baseTimer = (callback, delay, options) => {
  var modifier = delay / 50;
  return tickerTasks.add(createCatchAndLogUnhandledErrorHandler(callback, 'Unhandled timer'), modifier, options);
};
var timers_setTimeout = (callback, delay) => baseTimer(callback, delay);
var timers_setInterval = (callback, delay) => baseTimer(callback, delay, {
  reset: true
});
var setImmediate = callback => timers_setTimeout(callback, 0);
var timers_clearTimeout = id => tickerTasks.remove(id);
var initializeTimers = () => {
  // @ts-expect-error
  globalThis.setTimeout = timers_setTimeout;
  // @ts-expect-error
  globalThis.setInterval = timers_setInterval;
  // @ts-expect-error
  globalThis.setImmediate = setImmediate;
  // @ts-ignore
  globalThis.clearTimeout = timers_clearTimeout;
  // @ts-ignore
  globalThis.clearInterval = timers_clearTimeout;
};
;// CONCATENATED MODULE: ../yamjs-core/src/lifecycle.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function lifecycle_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function lifecycle_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { lifecycle_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { lifecycle_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


var __INTERNAL_LIFECYCLE = Symbol('lifecycle');
var createLifecycleHandler = () => {
  var hooks = new Map();
  var nextId = 0;
  var isReloading = false;
  var executeHooks = /*#__PURE__*/function () {
    var _ref = lifecycle_asyncToGenerator(function* (type) {
      var group = hooks.get(type);
      var _loop = function* _loop(i) {
        var priorityHooks = [...group.values()].filter(hook => hook.priority === i);
        var _loop2 = function* _loop2(hook) {
          name && console.log("".concat(type === 'onEnable' ? 'Enabling' : 'Disabling', " ").concat(name));
          yield asyncCatchAndLogUnhandledError( /*#__PURE__*/lifecycle_asyncToGenerator(function* () {
            return yield hook === null || hook === void 0 ? void 0 : hook();
          }), "Error while executing ".concat(type, " hook"));
        };
        for (var {
          hook,
          name
        } of priorityHooks) {
          yield* _loop2(hook);
        }
      };
      for (var i = 1; i <= 5; i++) {
        yield* _loop(i);
      }
      hooks.delete(type);
    });
    return function executeHooks(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  Yam.instance.setOnCloseFn( /*#__PURE__*/lifecycle_asyncToGenerator(function* () {
    yield executeHooks('onDisable');
  }));
  return {
    [__INTERNAL_LIFECYCLE]: {
      executeHooks
    },
    reload: function () {
      var _reload = lifecycle_asyncToGenerator(function* () {
        logVerbose('Reloading YamJS');
        isReloading = true;
        yield executeHooks('onDisable');
        Yam.reload();
        logVerbose('Finished reloading YamJS');
        isReloading = false;
      });
      function reload() {
        return _reload.apply(this, arguments);
      }
      return reload;
    }(),
    register: (name, hook) => {
      var _hooks$get;
      var id = nextId++;
      var callbacks = (_hooks$get = hooks.get(name)) !== null && _hooks$get !== void 0 ? _hooks$get : new Map();
      callbacks.set(id, _objectSpread({
        priority: 3
      }, hook));
      hooks.set(name, callbacks);
      return () => delete callbacks[id];
    }
  };
};
var lifecycle = createLifecycleHandler();
;// CONCATENATED MODULE: ../yamjs-core/src/initialize.ts





var HandlerList = Java.type("org.bukkit.event.HandlerList");


var isInitialized = false;
var initialize = () => {
  if (isInitialized) return;
  ticker.start();
  tickerTasks.initialize();
  initializeTimers();
  Yam.instance.setLoggerFn(error => logError(error));

  // TODO: Validate
  if (Yam.getMeta() === 'yamjs') {
    // Driver instance should unregister all listeners
    lifecycle.register('onDisable', {
      name: 'Event Listeners',
      hook: () => {
        HandlerList.unregisterAll(bukkit_bukkitPlugin);
      },
      priority: 5
    });
  } else {
    // Context instance should unregister only its own listeners
    lifecycle.register('onDisable', {
      name: 'Context Event Listeners',
      hook: () => {
        HandlerList.unregisterAll(MainInstanceListener);
      },
      priority: 5
    });
  }

  // TODO: 'onEnable' doesn't work
  lifecycle[__INTERNAL_LIFECYCLE].executeHooks('onEnable');
  isInitialized = true;
};
if (Yam.getConfig().initialize) {
  initialize();
}
;// CONCATENATED MODULE: ../yamjs-core/src/index.ts







;// CONCATENATED MODULE: ../yamjs-legacy/src/stdlib/index.ts
var stdlib_dirname = "/";
function stdlib_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function stdlib_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { stdlib_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { stdlib_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// @ts-expect-error
var stdlib_Yam = globalThis.Yam;
var Core = stdlib_Yam;

/** A serializable object. */

if ('Yam' in globalThis) {
  Object.assign(globalThis, {
    Core: stdlib_Yam
  });
} else if ('Core' in globalThis) {
  Object.assign(globalThis, {
    Yam: Core
  });
} else if ('Polyglot' in globalThis) {
  throw 'YamJS was not detected (or is very outdated) in your environment!';
} else if ('Java' in globalThis) {
  throw 'GraalJS was not detected in your environment!';
} else {
  throw 'Java was not detected in your environment!';
}

/** A session container for this module. */
var session = {
  data: new Map(),
  load: new Map(),
  poly: {
    index: 0,
    list: new Map()
  },
  task: {
    list: new Set(),
    tick: 0
  }
};
var Files = Java.type('java.nio.file.Files');
var JavaString = Java.type('java.lang.String');
var Paths = Java.type('java.nio.file.Paths');
var Pattern = Java.type('java.util.regex.Pattern');
var Scanner = Java.type('java.util.Scanner');
var URL = Java.type('java.net.URL');
var UUID = Java.type('java.util.UUID');

/** A system which simplifies asynchronous cross-context code execution. */
var desync = {
  /** Provides the result to a desync request within an auxilliary file. If this method is called while not within a desync-compatible context, it will fail. */
  provide(provider) {
    return stdlib_asyncToGenerator(function* () {
      try {
        var {
          data: _data,
          uuid
        } = JSON.parse(context.meta);
        try {
          context.emit(uuid, JSON.stringify({
            data: yield provider(_data),
            status: true
          }));
        } catch (error) {
          context.emit(uuid, JSON.stringify({
            data: error,
            status: false
          }));
        }
      } catch (error) {
        throw "The current context's metadata is incompatible with the desync system!";
      }
    })();
  },
  /** Sends a desync request to another file. If said file has a valid desync provider, that provider will be triggered and a response will be sent back when ready. */
  request(path) {
    var _arguments = arguments;
    return stdlib_asyncToGenerator(function* () {
      var data = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : {};
      var script = file(path);
      if (script.exists) {
        var uuid = UUID.randomUUID().toString();
        var _promise = context.on(uuid);
        context.create('file', file(path).io.getAbsolutePath(), JSON.stringify({
          data,
          uuid
        })).open();
        var _response = JSON.parse(yield _promise);
        if (_response.status) return _response.data;else throw _response.data;
      } else {
        throw 'That file does not exist!';
      }
    })();
  },
  /** Runs a task off the main server thread. */
  shift(script) {
    switch (env.name) {
      case 'bukkit':
        return new Promise((resolve, reject) => {
          env.content.server.getScheduler().runTaskAsynchronously(env.content.plugin,
          // @ts-expect-error
          new env.content.Runnable( /*#__PURE__*/stdlib_asyncToGenerator(function* () {
            try {
              resolve(yield script());
            } catch (error) {
              reject(error);
            }
          })));
        });
      case 'minestom':
        return new Promise( /*#__PURE__*/function () {
          var _ref2 = stdlib_asyncToGenerator(function* (resolve, reject) {
            try {
              resolve(yield script());
            } catch (error) {
              reject(error);
            }
          });
          return function (_x, _x2) {
            return _ref2.apply(this, arguments);
          };
        }());
    }
  }
};

/** It's even more complicated. */
function chain(input, handler) {
  var loop = input => {
    try {
      return handler(input, loop);
    } catch (error) {
      throw error;
    }
  };
  return loop(input);
}

/** Registers a custom command to the server. */
function command(options) {
  switch (env.name) {
    case 'bukkit':
      {
        // @ts-expect-error
        env.content.plugin.register(options.namespace || env.content.plugin.getName(), options.name, options.aliases || [], options.permission || '', options.message || '', (sender, label, args) => {
          catchAndLogUnhandledError(() => {
            if (!options.permission || sender.hasPermission(options.permission)) {
              options.execute && options.execute(sender, ...args);
            } else {
              sender.sendMessage(options.message || '');
            }
          }, "An error occured while attempting to execute the \"".concat(label, "\" command!"));
        }, (sender, alias, args) => {
          var _catchAndLogUnhandled;
          return (_catchAndLogUnhandled = catchAndLogUnhandledError(() => options.tabComplete && options.tabComplete(sender, ...args) || [], "An error occured while attempting to tab-complete the \"".concat(alias, "\" command!"))) !== null && _catchAndLogUnhandled !== void 0 ? _catchAndLogUnhandled : [];
        });
        break;
      }
    case 'minestom':
      {
        var _command = new env.content.Command(options.name);
        _command.addSyntax((sender, context) => {
          try {
            options.execute && options.execute(sender, ...context.getInput().split(' ').slice(1));
          } catch (error) {
            console.error("An error occured while attempting to execute the \"".concat(options.name, "\" command!"));
            console.error(error.stack || error.message || error);
          }
        }, env.content.ArgumentType.StringArray('tab-complete').setSuggestionCallback((sender, context, suggestion) => {
          for (var completion of options.tabComplete(sender, ...context.getInput().split(' ').slice(1)) || []) {
            suggestion.addEntry(new env.content.SuggestionEntry(completion));
          }
        }));
        env.content.registry.register(_command);
      }
  }
}

/**
 * A simple task scheduler.
 * @deprecated
 */
var task = {
  /** Cancels a previously scheduled task. */
  cancel(handle) {
    session.task.list.delete(handle);
  },
  /** Schedules a task to run infinitely at a set interval. */
  interval(script) {
    var period = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var future = task.timeout(function () {
      try {
        future.tick += Math.ceil(period < 1 ? 1 : period);
        script(...arguments);
      } catch (err) {
        console.error('future task interval error', err);
      }
    }, 0, ...args);
    return future;
  },
  /** Schedules a task to run after a set timeout. */
  timeout(_script) {
    var period = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }
    var future = {
      tick: session.task.tick + Math.ceil(period < 0 ? 0 : period),
      args,
      script: function script() {
        try {
          _script(...arguments);
        } catch (err) {
          console.error('future task timeout error', err);
        }
      }
    };
    session.task.list.add(future);
    return future;
  }
};
var context = {
  /** Creates a new context and returns its instance. If `type` is file, `content` refers to a JS file path relative to the JS root folder. If `type` is script, `content` refers to a piece of JS code. */
  create(type, content, meta) {
    return stdlib_Yam["".concat(type, "Instance")](content, meta);
  },
  /** Destroys the currently running context. */
  destroy() {
    stdlib_Yam.destroy();
  },
  emit(channel, message) {
    stdlib_Yam.emit(channel, message);
  },
  meta: stdlib_Yam.getMeta(),
  off(channel, listener) {
    return stdlib_Yam.off(channel, listener);
  },
  on: (channel, listener) => {
    if (listener) {
      return stdlib_Yam.on(channel, listener);
    } else {
      return new Promise(resolve => {
        var dummy = response => {
          context.off(channel, dummy);
          resolve(response);
        };
        context.on(channel, dummy);
      });
    }
  },
  swap() {
    push(stdlib_Yam.swap);
  }
};

/** Stores data on a per-path basis. */
function data(path) {
  for (var _len3 = arguments.length, more = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    more[_key3 - 1] = arguments[_key3];
  }
  var name = Paths.get(path, ...more).normalize().toString();
  if (session.data.has(name)) {
    return session.data.get(name);
  } else {
    var value = file(root, 'data', "".concat(name, ".json")).json() || {};
    session.data.set(name, value);
    return value;
  }
}

/** The environment that this module is currently running in. */
var env = (() => {
  try {
    return {
      content: {
        manager: bukkitManager,
        plugin: bukkit_bukkitPlugin,
        Runnable: Java.type('java.lang.Runnable'),
        server: bukkitServer
      },
      name: 'bukkit'
    };
  } catch (error) {
    try {
      var MinecraftServer = Java.type('net.minestom.server.MinecraftServer');

      /* minestom detected */

      var manager = MinecraftServer.getExtensionManager();
      var extension = manager.getExtension('Yam');
      return {
        content: {
          ArgumentType: Java.type('net.minestom.server.command.builder.arguments.ArgumentType'),
          Command: Java.type('net.minestom.server.command.builder.Command'),
          extension,
          manager,
          node: extension.getEventNode(),
          registry: MinecraftServer.getCommandManager(),
          server: MinecraftServer,
          SuggestionEntry: Java.type('net.minestom.server.command.builder.suggestion.SuggestionEntry')
        },
        name: 'minestom'
      };
    } catch (error) {
      return {
        name: 'unknown',
        content: {}
      };
    }
  }
})();

/** Sends a GET request to the given URL. */
function fetch(link) {
  var response = {
    json(async) {
      if (async) {
        return response.read(true).then(content => JSON.parse(content));
      } else {
        try {
          return JSON.parse(response.read());
        } catch (error) {
          throw error;
        }
      }
    },
    // @ts-expect-error
    read(async) {
      if (async) {
        return desync.request(aux, {
          link,
          operation: 'fetch.read'
        });
      } else {
        return new Scanner(response.stream()).useDelimiter('\\A').next();
      }
    },
    stream() {
      return new URL(link).openStream();
    }
  };
  return response;
}

/** A utility wrapper for paths and files. */
function file(path) {
  path = typeof path === 'string' ? path : 'io' in path ? path.path : path.getPath();
  for (var _len4 = arguments.length, more = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    more[_key4 - 1] = arguments[_key4];
  }
  var io = Paths.get(path, ...more).normalize().toFile();
  var record = {
    get children() {
      return record.type === 'folder' ? [...io.listFiles()].map(sub => file(sub.getPath())) : null;
    },
    directory() {
      if (record.type === 'none') {
        chain(io, (io, loop) => {
          var parent = io.getParentFile();
          parent && (parent.exists() || loop(parent));
          io.mkdir();
        });
      }
      return record;
    },
    entry() {
      record.type === 'none' && record.parent.directory() && io.createNewFile();
      return record;
    },
    get exists() {
      return io.exists();
    },
    file() {
      for (var _len5 = arguments.length, path = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        path[_key5] = arguments[_key5];
      }
      return file(io, ...path);
    },
    flush() {
      chain(io, (io, loop) => {
        var parent = io.getParentFile();
        parent && parent.isDirectory() && (parent.listFiles()[0] || parent.delete() && loop(parent));
      });
      return record;
    },
    io,
    json(async) {
      if (async) {
        return record.read(true).then(content => JSON.parse(content));
      } else {
        try {
          return JSON.parse(record.read());
        } catch (error) {
          return null;
        }
      }
    },
    get name() {
      return io.getName();
    },
    get parent() {
      return record.file('..');
    },
    get path() {
      return regex.replace(io.getPath(), '(\\\\)', '/');
    },
    read(async) {
      if (async) {
        return desync.request(aux, {
          operation: 'file.read',
          path: record.path
        });
      } else {
        return record.type === 'file' ? new JavaString(Files.readAllBytes(io.toPath())).toString() : null;
      }
    },
    remove() {
      chain(io, (io, loop) => {
        io.isDirectory() && [...io.listFiles()].forEach(loop);
        io.exists() && io.delete();
      });
      return record.flush();
    },
    get type() {
      return io.isDirectory() ? 'folder' : io.exists() ? 'file' : 'none';
    },
    //@ts-expect-error
    write(content, async) {
      if (async) {
        return desync.request(aux, {
          content,
          operation: 'file.write',
          path: record.path
        }).then(() => record);
      } else {
        record.type === 'file' && Files.write(io.toPath(), new JavaString(content).getBytes());
        return record;
      }
    }
  };
  return record;
}

/** Imports classes from external files.123 */
function load(path, name) {
  if (session.load.has(name)) {
    return session.load.get(name);
  } else {
    var source = file(path);
    if (source.exists) {
      var value = stdlib_Yam.load(source.io, name);
      session.load.set(name, value);
      return value;
    } else {
      throw new ReferenceError("The file \"".concat(source.path, "\" does not exist!"));
    }
  }
}

/** Runs a script on the next tick. */
function push(script) {
  stdlib_Yam.push(script);
}

/** Tools for using regex patterns. */
var regex = {
  test(input, expression) {
    //@ts-expect-error
    return input.matches(expression);
  },
  replace(input, expression, replacement) {
    // @ts-expect-error
    return Pattern.compile(expression).matcher(input).replaceAll(replacement);
  }
};

/** Reloads the JS environment. */
function reload() {
  push(stdlib_Yam.reload || stdlib_Yam.swap);
}

/** The root folder of the environment. */
var root = file(stdlib_Yam.getRoot());

/** Recursively removes or replaces the circular references in an object. */
function simplify(object, placeholder, objects) {
  if (object && typeof object === 'object') {
    objects || (objects = new Set());
    if (objects.has(object)) {
      return placeholder;
    } else {
      objects.add(object);
      var output = typeof object[Symbol.iterator] === 'function' ? [] : {};
      for (var key in object) output[key] = simplify(object[key], placeholder, new Set(objects));
      return output;
    }
  } else {
    return object;
  }
}
function sync(script) {
  return new Promise((resolve, reject) => {
    stdlib_Yam.sync(() => script().then(resolve).catch(reject));
  });
}
stdlib_Yam.hook(() => {
  for (var [name] of session.data) {
    file(root, 'data', "".concat(name, ".json")).entry().write(JSON.stringify(simplify(session.data.get(name))));
  }
});
var aux = "".concat(stdlib_dirname, "/async.js");
var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var promise = Promise.resolve();
Object.assign(globalThis, {
  atob(data) {
    var str = regex.replace(String(data), '[=]+$', '');
    if (str.length % 4 === 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (var bc = 0, bs, buffer, idx = 0, output = ''; buffer = str.charAt(idx++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
      buffer = charset.indexOf(buffer);
    }
    return output;
  },
  btoa(data) {
    var str = String(data);
    for (var block, charCode, idx = 0, map = charset, output = ''; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
      charCode = str.charCodeAt(idx += 3 / 4);
      if (charCode > 0xff) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
  },
  queueMicrotask(callback) {
    promise.then(callback).catch(error => {
      task.timeout(() => {
        throw error;
      });
    });
  }
});
;// CONCATENATED MODULE: ../yamjs-legacy/src/js/index.ts

var Class = Java.type('java.lang.Class');
var Iterable = Java.type('java.lang.Iterable');
var Iterator = Java.type('java.util.Iterator');
var Spliterator = Java.type('java.util.Spliterator');

/** Converts array-like objects or iterators into arrays. */
function array(object) {
  if (object instanceof Array) {
    return [...object];
  } else if (object instanceof Iterable) {
    var output = [];
    // @ts-expect-error
    object.forEach(value => {
      output.push(value);
    });
    return output;
  } else if (object instanceof Iterator || object instanceof Spliterator) {
    var _output = [];
    // @ts-expect-error
    object.forEachRemaining(value => {
      _output.push(value);
    });
    return _output;
  } else {
    return null;
  }
}

/** Internal value used to represent circular object references in formatted output. */
var circular = Symbol();

/** Formatting tools for script feedback. */
var format = {
  /** Reformats complex error messages into layman-friendly ones. */
  error(error) {
    var type = 'Error';
    var message = "".concat(error);
    if (error.stack) {
      type = error.stack.split('\n')[0].split(' ')[0].slice(0, -1);
      message = error.message;
      switch (type) {
        case 'TypeError':
          try {
            if (message.startsWith('invokeMember') || message.startsWith('execute on foreign object')) {
              var reason = message.split('failed due to: ')[1];
              if (reason.startsWith('no applicable overload found')) {
                var sets = reason.split('overloads:')[1].split(']],')[0].split(')]').map(set => {
                  return "(".concat(set.split('(').slice(1).join('('), ")");
                });
                message = ['Invalid arguments! Expected:', ...sets].join('\n -> ').slice(0, -1);
              } else if (reason.startsWith('Arity error')) {
                message = "Invalid argument amount! Expected: ".concat(reason.split('-')[1].split(' ')[2]);
              } else if (reason.startsWith('UnsupportedTypeException')) {
                message = 'Invalid arguments!';
              } else if (reason.startsWith('Unknown identifier')) {
                message = "That method (".concat(reason.split(': ')[1], ") does not exist!");
              } else if (reason.startsWith('Message not supported')) {
                message = "That method (".concat(message.slice(14).split(')')[0], ") does not exist!");
              } else {
                message = message.split('\n')[0];
              }
            }
          } catch (error) {
            message = message.split('\n')[0];
          }
          break;
        case 'SyntaxError':
          message = message.split(' ').slice(1).join(' ').split('\n')[0];
      }
    } else {
      error = "".concat(error);
      type = error.split(' ')[0].slice(0, -1);
      message = error.split(' ').slice(1).join(' ');
    }
    return "".concat(type, ": ").concat(message);
  },
  /** A pretty-printer for JavaScript objects. */
  output(object, condense) {
    if (condense === true) {
      if (object === circular) {
        return '...';
      } else {
        // @ts-expect-error
        var type = toString.call(object);
        switch (type) {
          case '[object Array]':
          case '[object Object]':
          case '[object Function]':
            return type.split(' ')[1].slice(0, -1);
          case '[foreign HostObject]':
            if (object instanceof Class && typeof object.getCanonicalName === 'function') {
              return object.getCanonicalName();
            } else if (typeof object.toString === 'function') {
              var string = object.toString();
              if (string) {
                return string;
              }
            }
            var clazz = typeof object.getClass === 'function' ? object.getClass() : object.class;
            if (clazz instanceof Class && typeof clazz.getCanonicalName === 'function') {
              return clazz.getCanonicalName();
            } else {
              return "".concat(object) || "".concat(clazz) || 'Object';
            }
          case '[foreign HostFunction]':
            return 'Function';
          default:
            switch (typeof object) {
              case 'bigint':
                return object.toString() + 'n';
              case 'function':
                return 'Function';
              case 'object':
                return object ? 'Object' : 'null';
              case 'symbol':
                return "<".concat(object.toString().slice(7, -1), ">");
              case 'undefined':
                return 'undefined';
              default:
                return JSON.stringify(object);
            }
        }
      }
    } else {
      // @ts-expect-error
      switch (toString.call(object)) {
        case '[object Array]':
          return "[ ".concat([...object].map(value => format.output(object === value ? circular : value, true)).join(', '), " ]");
        case '[object Object]':
          return "{ ".concat([...Object.getOwnPropertyNames(object).map(key => {
            return "".concat(key, ": ").concat(format.output(object === object[key] ? circular : object[key], true));
          }), ...Object.getOwnPropertySymbols(object).map(key => {
            return "".concat(format.output(key, true), ": ").concat(format.output(object === object[key] ? circular : object[key], true));
          })].join(', '), " }");
        case '[object Function]':
          if (object instanceof Class && typeof object.getCanonicalName === 'function') {
            return object.getCanonicalName();
          } else if (typeof object.toString === 'function') {
            return regex.replace(object.toString(), '\\r', '');
          } else {
            return "".concat(object) || 'function () { [native code] }';
          }
        case '[foreign HostFunction]':
          return 'hostFunction () { [native code] }';
        default:
          var list = array(object);
          if (list) {
            return format.output(list);
          } else {
            return format.output(object, true);
          }
      }
    }
  }
};
command({
  name: 'js',
  permission: 'grakkit.command.js',
  message: "\xA7cYou do not have the required permission to run this command!",
  execute(context) {
    var self = globalThis.hasOwnProperty('self');
    // @ts-ignore - Investigate. Why is this a thing?
    self || (globalThis.self = context);
    var output;
    try {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      var result = Polyglot.eval('js', args.join(' '));
      // @ts-ignore - Investigate. Why is this a thing?
      self || delete globalThis.self;
      output = format.output(result);
    } catch (whoops) {
      // @ts-ignore - Investigate. Why is this a thing?
      self || delete globalThis.self;
      output = format.error(whoops);
    }
    switch (env.name) {
      case 'bukkit':
        context.sendMessage(output);
        break;
      case 'minestom':
        context.sendMessage(output);
        break;
    }
  },
  tabComplete(context) {
    var body = '';
    var index = -1;
    var scope = globalThis;
    var valid = true;
    var string = false;
    var bracket = false;
    var comment = false;
    var property = '';
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    var input = args.join(' ');
    while (valid && ++index < input.length) {
      var char = input[index];
      if (comment) {
        if (char === '*' && input[index + 1] === '/') {
          if (property) {
            input[index + 2] === ';' && (comment = false);
          } else {
            body = input.slice(0, index + 2);
            comment = false;
          }
        }
      } else if (string) {
        if (char === '\\') {
          ++index;
        } else if (char === string) {
          scope = {};
          string = false;
        }
      } else if (bracket === true) {
        ;
        ["'", '"', '`'].includes(char) ? bracket = char : valid = false;
      } else if (typeof bracket === 'string') {
        switch (char) {
          case '\\':
            ++index;
            break;
          case bracket:
            bracket = -1;
            break;
          default:
            property += char;
        }
      } else {
        switch (char) {
          case '/':
            switch (input[index + 1]) {
              case '/':
                valid = false;
                break;
              case '*':
                comment = true;
                break;
            }
            break;
          case "'":
          case '"':
          case '`':
            bracket === -1 ? valid = false : string = char;
            break;
          case ')':
          case '{':
          case '}':
            bracket || (scope = {});
            break;
          case '.':
          case '[':
            if (!bracket) {
              if (char === '.' || property) {
                body = input.slice(0, index + 1);
                if (scope === globalThis && property === 'self' && !scope.hasOwnProperty('self')) {
                  scope = context;
                } else {
                  scope = scope[property] || {};
                }
                char === '.' || (bracket = true);
                property = '';
              } else {
                body = input.slice(0, index + 1);
                scope = globalThis;
              }
            }
            break;
          case ']':
            bracket === -1 && (bracket = false);
            break;
          case '\\':
            typeof bracket === 'string' ? ++index : valid = false;
            break;
          case ' ':
            property ? valid = false : body = '';
            break;
          default:
            if (regex.test(char, '[\\+\\-\\*\\/\\^=!&\\|\\?:\\(,;]')) {
              if (!bracket) {
                body = input.slice(0, index + 1);
                scope = globalThis;
                property = '';
              }
            } else {
              property += char;
            }
        }
      }
    }
    if (valid && scope && !(comment || string)) {
      var properties = [...Object.getOwnPropertyNames(scope.constructor ? scope.constructor.prototype || {} : {}), ...Object.getOwnPropertyNames(scope)];
      scope === globalThis && !properties.includes('self') && properties.push('self');
      return properties.sort().filter(element => element.toLowerCase().includes(property.toLowerCase())).filter(name => bracket || regex.test(name, '[_A-Za-z$][_0-9A-Za-z$]*')).map(name => {
        if (bracket) {
          return "".concat(body, "`").concat(regex.replace(name, '`', '\\`').split('\\').join('\\\\'), "`]");
        } else {
          return "".concat(body).concat(name);
        }
      });
    } else {
      return [];
    }
  }
});
;// CONCATENATED MODULE: ../yamjs-legacy/src/stdlib-paper/index.ts



var addons = {
  manager: env.content.manager,
  plugin: env.content.plugin,
  server: env.content.server
};
var stdlib_paper_stdlib = Object.assign({}, stdlib_namespaceObject, addons);
Object.assign(globalThis, addons, {
  core: stdlib_paper_stdlib
});
/* harmony default export */ const stdlib_paper = ((/* unused pure expression or super */ null && (stdlib_paper_stdlib)));
;// CONCATENATED MODULE: ../yamjs-legacy/src/index.ts


/* harmony default export */ const src = ((/* unused pure expression or super */ null && (stdlib)));
;// CONCATENATED MODULE: ./src/index.ts


var PlayerJoinEvent = Java.type("org.bukkit.event.player.PlayerJoinEvent");
var PlayerQuitEvent = Java.type("org.bukkit.event.player.PlayerQuitEvent");
var test = fn => {
  setTimeout(fn, 1000);
};
test(() => {
  console.log('Test1 Hello world! AA');
});
registerEvent(PlayerJoinEvent, event => {
  console.log("Test2 Player ".concat(event.getPlayer().getName(), " joined the game!"));
});
registerEvent(PlayerQuitEvent, event => {
  console.log("Test3 Player ".concat(event.getPlayer().getName(), " quit the game!"));
});
command({
  name: 'jsreload',
  execute(sender) {
    console.log('Test4 Reloading...');
    lifecycle.reload();
  }
});
exports.test = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map