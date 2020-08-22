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
    ZegoPlayerConfig,
    ZegoVideoConfig
} from "../ZegoExpressDefines"
import { ZegoEventListener, ZegoAnyCallback } from '../ZegoExpressEventHandler';

const { ZegoExpressNativeModule } = NativeModules;

const ZegoEvent = new NativeEventEmitter(ZegoExpressNativeModule);

let engine: ZegoExpressEngineImpl | undefined;

export class ZegoExpressEngineImpl {
    
    private static _listeners = new Map<string, Map<ZegoAnyCallback, ZegoAnyCallback>>();

    static getInstance(): ZegoExpressEngineImpl {
        if(engine) {
            return engine as ZegoExpressEngineImpl;
        } else {
            throw new Error('Get instance failed. Please create engine first')
        }
    }

    static async createEngine(appID: number, appSign: string, isTestEnv: boolean, scenario: ZegoScenario): Promise<ZegoExpressEngineImpl> {
        if(engine) {
            return engine;
        }

        await ZegoExpressNativeModule.createEngine(appID, appSign, isTestEnv, scenario);
        engine = new ZegoExpressEngineImpl();

        return engine;
    }

    static destroyEngine(): Promise<void> {
        engine = undefined;
        ZegoExpressEngineImpl._listeners.forEach((value , key) =>{
            ZegoEvent.removeAllListeners(key);
        });
        ZegoExpressEngineImpl._listeners.clear();
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
        let map = ZegoExpressEngineImpl._listeners.get(event);
        if (map === undefined) {
            map = new Map<ZegoAnyCallback, ZegoAnyCallback>();
            ZegoExpressEngineImpl._listeners.set(event, map)
        }
        map.set(callback, native_listener);
        ZegoEvent.addListener(event, native_listener);
        ZegoExpressEngineImpl._listeners.set(event, map);
    }

    off<EventType extends keyof ZegoEventListener>(event: EventType, callback?: ZegoEventListener[EventType]) {

        if(callback === undefined) {
            ZegoEvent.removeAllListeners(event);
            ZegoExpressEngineImpl._listeners.delete(event);
        } else {
            const map = ZegoExpressEngineImpl._listeners.get(event);
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

    startPublishingStream(streamID: string, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.startPublishingStream(streamID, channel??ZegoPublishChannel.Main);
    }

    stopPublishingStream(channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.stopPublishingStream(channel??ZegoPublishChannel.Main);
    }

    startPreview(view: ZegoView, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.startPreview(view, channel??ZegoPublishChannel.Main);
    }

    stopPreview(channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.stopPreview(channel??ZegoPublishChannel.Main);
    }

    setVideoConfig(config: ZegoVideoConfig, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.setVideoConfig(config, channel??ZegoPublishChannel.Main);
    }

    getVideoConfig(channel?:ZegoPublishChannel): Promise<ZegoVideoConfig> {
        return ZegoExpressNativeModule.getVideoConfig(channel??ZegoPublishChannel.Main);
    }

    startPlayingStream(streamID: string, view: ZegoView, config?: ZegoPlayerConfig): Promise<void> {
        return ZegoExpressNativeModule.startPlayingStream(streamID, view, config)
    }

    stopPlayingStream(streamID: string): Promise<void> {
        return ZegoExpressNativeModule.stopPlayingStream(streamID);
    }

}