import { NativeModules, NativeEventEmitter } from 'react-native';
import {
    ZegoScenario,
    ZegoRoomState,
    ZegoPublishChannel,
    ZegoPublisherState,
    ZegoUser,
    ZegoRoomConfig
} from "./ZegoExpressDefines"

const { ZegoExpressNativeModule } = NativeModules;

const ZegoEvent = new NativeEventEmitter(ZegoExpressNativeModule);

let engine: ZegoExpressEngine | undefined;

export default class ZegoExpressEngine {
    
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
        // this.removeAllListeners();
        return ZegoExpressNativeModule.destroyEngine();
    }

    getVersion(): Promise<string> {
        return ZegoExpressNativeModule.getVersion()
    }

    uploadLog(): Promise<void> {
        return ZegoExpressNativeModule.uploadLog();
    }

    /*on(methodName: string) {
        ZegoEvent.addListener(methodName, ()=)
    }*/
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

}