import { NativeModules, NativeEventEmitter } from 'react-native';
import {
    ZegoScenario,
    ZegoRoomState,
    ZegoPublishChannel,
    ZegoPublisherState,
    ZegoViewMode,
    ZegoPlayerVideoLayer,
    ZegoUser,
    ZegoRoomConfig,
    ZegoView,
    ZegoCDNConfig,
    ZegoPlayerConfig
} from "./ZegoExpressDefines"
import { ZegoEventListener, ZegoAnyCallback } from './ZegoExpressEventHandler';

const { ZegoExpressNativeModule } = NativeModules;

const ZegoEvent = new NativeEventEmitter(ZegoExpressNativeModule);

let engine: ZegoExpressEngine | undefined;

export default class ZegoExpressEngine {
    
    private static _listeners = new Map<string, Map<ZegoAnyCallback, ZegoAnyCallback>>();

    static instance(): ZegoExpressEngine {
        if(engine) {
            return engine as ZegoExpressEngine;
        } else {
            throw new Error('Get instance failed. Please create engine first')
        }
    }

    static async createEngine(appID: number, appSign: string, isTestEnv: boolean, scenario: ZegoScenario): Promise<ZegoExpressEngine> {
        if(engine) {
            return engine;
        }

        await ZegoExpressNativeModule.createEngine(appID, appSign, isTestEnv, scenario);
        engine = new ZegoExpressEngine();

        return engine;
    }

    static destroyEngine(): Promise<void> {
        engine = undefined;
        ZegoExpressEngine._listeners.forEach((value , key) =>{
            ZegoEvent.removeAllListeners(key);
        });
        ZegoExpressEngine._listeners.clear();
        // this.removeAllListeners();
        return ZegoExpressNativeModule.destroyEngine();
    }

    getVersion(): Promise<string> {
        return ZegoExpressNativeModule.getVersion()
    }

    uploadLog(): Promise<void> {
        return ZegoExpressNativeModule.uploadLog();
    }

    on<EventType extends keyof ZegoEventListener>(event: EventType, callback: ZegoEventListener[EventType]) {
        const native_listener = (res: any) => {
            const {data} = res;
            // @ts-ignore
            callback(...data)
        };
        let map = ZegoExpressEngine._listeners.get(event);
        if (map === undefined) {
            map = new Map<ZegoAnyCallback, ZegoAnyCallback>();
            ZegoExpressEngine._listeners.set(event, map)
        }
        map.set(callback, native_listener);
        ZegoEvent.addListener(event, native_listener);
        ZegoExpressEngine._listeners.set(event, map);
    }

    off<EventType extends keyof ZegoEventListener>(event: EventType, callback?: ZegoEventListener[EventType]) {

        if(callback === undefined) {
            ZegoEvent.removeAllListeners(event);
            ZegoExpressEngine._listeners.delete(event);
        } else {
            const map = ZegoExpressEngine._listeners.get(event);
            if (map === undefined)
                return;
            ZegoEvent.removeListener(event, map.get(callback) as ZegoAnyCallback);
            map.delete(callback)
        }
    }

    loginRoom(roomID: string, user: ZegoUser, config?: ZegoRoomConfig): Promise<void> {
        return ZegoExpressNativeModule.loginRoom(roomID, user, config);
    }

    logoutRoom(roomID: string): Promise<void> {
        return ZegoExpressNativeModule.logoutRoom(roomID);
    }

    startPublishingStream(streamID: string, channel = ZegoPublishChannel.Main) {
        return ZegoExpressNativeModule.startPublishingStream(streamID, channel);
    }

    stopPublishingStream(channel = ZegoPublishChannel.Main) {
        return ZegoExpressNativeModule.stopPublishingStream(channel);
    }

    startPreview(view: ZegoView, channel = ZegoPublishChannel.Main) {
        return ZegoExpressNativeModule.startPreview(view, channel);
    }

    stopPreview(channel = ZegoPublishChannel.Main) {
        return ZegoExpressNativeModule.stopPreview(channel);
    }

    startPlayingStream(streamID: string, view: ZegoView, config?: ZegoPlayerConfig) {
        return ZegoExpressNativeModule.startPlayingStream(streamID, view)
    }

    stopPlayingStream(streamID: string) {
        return ZegoExpressNativeModule.stopPlayingStream(streamID);
    }

}