import { Listener } from 'org.bukkit.event';
/** A valid event priority. */
type StringEventPriority = 'HIGH' | 'HIGHEST' | 'LOW' | 'LOWEST' | 'MONITOR' | 'NORMAL';
export declare const createEventListener: () => Listener;
export declare const MainInstanceListener: Listener;
type EventListener<X> = (event: InstanceType<X>) => void;
type ScriptEventListener<X> = {
    script: (event: InstanceType<X>) => void;
    priority: StringEventPriority;
};
export type RegisterEventType<Event = any> = <X = Event>(eventClass: X, eventListenerArg: EventListener<X> | ScriptEventListener<X>, priority?: StringEventPriority, listener?: Listener) => void;
export declare const registerEvent: RegisterEventType;
export {};
