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
    ZegoVideoConfig,
    ZegoPlayerConfig,
    ZegoMediaPlayer
} from "./ZegoExpressDefines"
import { ZegoEventListener} from './ZegoExpressEventHandler';
import {ZegoExpressEngineImpl} from './impl/ZegoExpressEngineImpl';


export default class ZegoExpressEngine {
    
    static instance(): ZegoExpressEngine {
        return ZegoExpressEngineImpl.getInstance();
    }

    static async createEngine(appID: number, appSign: string, isTestEnv: boolean, scenario: ZegoScenario): Promise<ZegoExpressEngine> {
        return ZegoExpressEngineImpl.createEngine(appID, appSign, isTestEnv, scenario);
    }

    static destroyEngine(): Promise<void> {
        return ZegoExpressEngineImpl.destroyEngine();
    }

    getVersion(): Promise<string> {
        return ZegoExpressEngineImpl.getInstance().getVersion();
    }

    uploadLog(): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().uploadLog();
    }

    on<EventType extends keyof ZegoEventListener>(event: EventType, callback: ZegoEventListener[EventType]): void {
        return ZegoExpressEngineImpl.getInstance().on(event, callback);
    }

    off<EventType extends keyof ZegoEventListener>(event: EventType, callback?: ZegoEventListener[EventType]): void {
        return ZegoExpressEngineImpl.getInstance().on(event, callback);
    }

    loginRoom(roomID: string, user: ZegoUser, config?: ZegoRoomConfig): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().loginRoom(roomID, user, config);
    }

    logoutRoom(roomID: string): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().logoutRoom(roomID);
    }

    startPublishingStream(streamID: string, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startPublishingStream(streamID, channel);
    }

    stopPublishingStream(channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopPublishingStream(channel);
    }

    startPreview(view: ZegoView, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startPreview(view, channel);
    }

    stopPreview(channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopPreview(channel);
    }

    setVideoConfig(config: ZegoVideoConfig, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setVideoConfig(config, channel);
    }

    getVideoConfig(channel?:ZegoPublishChannel): Promise<ZegoVideoConfig> {
        return ZegoExpressEngineImpl.getInstance().getVideoConfig(channel);
    }

    startPlayingStream(streamID: string, view: ZegoView, config?: ZegoPlayerConfig): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startPlayingStream(streamID, view, config);
    }

    stopPlayingStream(streamID: string): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopPlayingStream(streamID);
    }

    createMediaPlayer(): Promise<ZegoMediaPlayer> {
        return ZegoExpressEngineImpl.getInstance().createMediaPlayer();
    }

    destroyMediaPlayer(mediaPlayer: ZegoMediaPlayer): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().destroyMediaPlayer(mediaPlayer);
    }

}