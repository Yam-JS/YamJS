import { EventPriority, Listener } from 'org.bukkit.event'
import { bukkitManager, bukkitPlugin } from './bukkit'
import { catchAndLogUnhandledError } from './errors'

/** A valid event priority. */
type StringEventPriority = 'HIGH' | 'HIGHEST' | 'LOW' | 'LOWEST' | 'MONITOR' | 'NORMAL'

export const createEventListener = () => new (Java.extend(Listener, {}))() as Listener
export const MainInstanceListener = createEventListener()

// @ts-expect-error
type EventListener<X> = (event: InstanceType<X>) => void
type ScriptEventListener<X> = {
  // @ts-expect-error
  script: (event: InstanceType<X>) => void
  priority: StringEventPriority
}

export type RegisterEventType<Event = any> = <X = Event>(
  eventClass: X,
  eventListenerArg: EventListener<X> | ScriptEventListener<X>,
  priority?: StringEventPriority,
  listener?: Listener
) => void

export const registerEvent: RegisterEventType = (
  eventClass,
  eventListenerArg,
  priority = 'HIGHEST',
  listener: Listener = MainInstanceListener
) => {
  const eventListener = {
    priority: 'priority' in eventListenerArg ? eventListenerArg.priority : priority,
    script: 'script' in eventListenerArg ? eventListenerArg.script : eventListenerArg,
  }

  // @ts-expect-error [java-ts-bind classes missing class prototype methods]
  const name: string = eventClass.class.toString()

  bukkitManager.registerEvent(
    // @ts-expect-error [java-ts-bind missing class prototype]
    eventClass.class,
    listener,
    EventPriority.valueOf(eventListener.priority),
    // @ts-expect-error [EventExecutor]
    (x: any, signal: any) => {
      // @ts-expect-error [instancetype error]
      if (signal instanceof eventClass) {
        catchAndLogUnhandledError(() => {
          eventListener.script(signal)
        }, `An error occured while attempting to handle the "${name}" event!`)
      }
    },
    bukkitPlugin
  )
}
