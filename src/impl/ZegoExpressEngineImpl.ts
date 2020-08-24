import { NativeModules, NativeEventEmitter } from 'react-native';
import {
    ZegoScenario,
    ZegoEngineConfig,
    ZegoRoomState,
    ZegoPublishChannel,
    ZegoVideoMirrorMode,
    ZegoPublisherState,
    ZegoViewMode,
    ZegoPlayerVideoLayer,
    ZegoUser,
    ZegoRoomConfig,
    ZegoView,
    ZegoCDNConfig,
    ZegoPlayerConfig,
    ZegoVideoConfig,
    ZegoAudioConfig,
    ZegoOrientation,
    ZegoAECMode,
    ZegoANSMode,
    ZegoBeautifyOption,
    ZegoMediaPlayer,
    ZegoMediaPlayerState
} from "../ZegoExpressDefines"
import { ZegoEventListener, ZegoAnyCallback, ZegoMediaPlayerListener } from '../ZegoExpressEventHandler';

const { ZegoExpressNativeModule } = NativeModules;

const ZegoEvent = new NativeEventEmitter(ZegoExpressNativeModule);

let engine: ZegoExpressEngineImpl | undefined;

export class ZegoExpressEngineImpl {
    
    static _listeners = new Map<string, Map<ZegoAnyCallback, ZegoAnyCallback>>();
    static _mediaPlayerMap = new Map<number, ZegoMediaPlayer>();

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

        ZegoExpressEngineImpl._mediaPlayerMap.forEach((vaule, key) => {
            ZegoExpressNativeModule.destroyMediaPlayer(key);
        });
        ZegoExpressEngineImpl._listeners.clear();
        ZegoExpressEngineImpl._mediaPlayerMap.clear();
        // this.removeAllListeners();
        return ZegoExpressNativeModule.destroyEngine();
    }

    static setEngineConfig(config: ZegoEngineConfig): Promise<void> {
        return ZegoExpressNativeModule.setEngineConfig(config);
    }
    
    getVersion(): Promise<string> {
        return ZegoExpressNativeModule.getVersion()
    }

    uploadLog(): Promise<void> {
        return ZegoExpressNativeModule.uploadLog();
    }

    on<EventType extends keyof ZegoEventListener>(event: EventType, callback: ZegoEventListener[EventType]): void {
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

    off<EventType extends keyof ZegoEventListener>(event: EventType, callback?: ZegoEventListener[EventType]): void {

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

    setVideoMirrorMode(mode: ZegoVideoMirrorMode, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.setVideoMirrorMode(mode, channel??ZegoPublishChannel.Main);
    }

    setAppOrientation(mode: ZegoOrientation, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.setAppOrientation(mode, channel??ZegoPublishChannel.Main);
    }

    setAudioConfig(config: ZegoAudioConfig): Promise<void> {
        return ZegoExpressNativeModule.setAudioConfig(config);
    }

    getAudioConfig(): Promise<ZegoAudioConfig> {
        return ZegoExpressNativeModule.getAudioConfig();
    }

    mutePublishStreamAudio(mute: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.mutePublishStreamAudio(mute, channel??ZegoPublishChannel.Main);
    }

    mutePublishStreamVideo(mute: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.mutePublishStreamVideo(mute, channel??ZegoPublishChannel.Main);
    }

    setCaptureVolume(volume: number): Promise<void> {
        return ZegoExpressNativeModule.setCaptureVolume(volume);
    }

    enableHardwareEncoder(enable: boolean): Promise<void> {
        return ZegoExpressNativeModule.enableHardwareEncoder(enable);
    }

    startPlayingStream(streamID: string, view: ZegoView, config?: ZegoPlayerConfig): Promise<void> {
        return ZegoExpressNativeModule.startPlayingStream(streamID, view, config)
    }

    stopPlayingStream(streamID: string): Promise<void> {
        return ZegoExpressNativeModule.stopPlayingStream(streamID);
    }

    setPlayVolume(volume: number): Promise<void> {
        return ZegoExpressNativeModule.setPlayVolume(volume);
    }

    mutePlayStreamAudio(streamID: string, mute: boolean): Promise<void> {
        return ZegoExpressNativeModule.mutePlayStreamAudio(streamID, mute);
    }

    mutePlayStreamVideo(streamID: string, mute: boolean): Promise<void> {
        return ZegoExpressNativeModule.mutePlayStreamVideo(streamID, mute);
    }

    enableHardwareDecoder(enable: boolean): Promise<void> {
        return ZegoExpressNativeModule.enableHardwareDecoder(enable);
    }

    muteMicrophone(mute: boolean): Promise<void> {
        return ZegoExpressNativeModule.muteMicrophone(mute);
    }

    isMicrophoneMuted(): Promise<boolean> {
        return ZegoExpressNativeModule.isMicrophoneMuted();
    }

    muteSpeaker(mute: boolean): Promise<void> {
        return ZegoExpressNativeModule.muteSpeaker(mute);
    }

    isSpeakerMuted(): Promise<boolean> {
        return ZegoExpressNativeModule.isSpeakerMuted();
    }

    enableAudioCaptureDevice(enable: boolean): Promise<void> {
        return ZegoExpressNativeModule.enableAudioCaptureDevice(enable);
    }

    enableCamera(enable: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.enableCamera(enable, channel??ZegoPublishChannel.Main);
    }

    useFrontCamera(enable: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.useFrontCamera(enable, channel??ZegoPublishChannel.Main);
    }

    startSoundLevelMonitor(): Promise<void> {
        return ZegoExpressNativeModule.startSoundLevelMonitor();
    }

    stopSoundLevelMonitor(): Promise<void> {
        return ZegoExpressNativeModule.stopSoundLevelMonitor();
    }

    enableAEC(enable: boolean): Promise<void> {
        return ZegoExpressNativeModule.enableAEC(enable);
    }

    enableHeadphoneAEC(enable: boolean): Promise<void> {
        return ZegoExpressNativeModule.enableHeadphoneAEC(enable);
    }

    setAECMode(mode: ZegoAECMode): Promise<void> {
        return ZegoExpressNativeModule.setAECMode(mode);
    }

    enableAGC(enable: boolean): Promise<void> {
        return ZegoExpressNativeModule.enableAGC(enable);
    }

    enableANS(enable: boolean): Promise<void> {
        return ZegoExpressNativeModule.enableANS(enable);
    }

    setANSMode(mode: ZegoANSMode): Promise<void> {
        return ZegoExpressNativeModule.setANSMode(mode);
    }

    enableBeautify(feature: number, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.enableBeautify(feature, channel??ZegoPublishChannel.Main);
    }

    setBeautifyOption(option: ZegoBeautifyOption, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressNativeModule.setBeautifyOption(option, channel??ZegoPublishChannel.Main);
    }

    async createMediaPlayer(): Promise<ZegoMediaPlayer> {
        var index = await ZegoExpressNativeModule.createMediaPlayer();
        if(index >= 0) {
            var mediaPlayer = new ZegoMediaPlayerImpl(index);
            ZegoExpressEngineImpl._mediaPlayerMap.set(index, mediaPlayer);

            return mediaPlayer;
        }

        return null;
    }

    async destroyMediaPlayer(mediaPlayer: ZegoMediaPlayer): Promise<void> {
        var index = mediaPlayer.getIndex(); 
        if( index >= 0) {
            await ZegoExpressNativeModule.destroyMediaPlayer(index);
            ZegoExpressEngineImpl._mediaPlayerMap.delete(index);
            mediaPlayer.off("MediaPlayerStateUpdate");
            mediaPlayer.off("MediaPlayerNetworkEvent");
            mediaPlayer.off("MediaPlayerPlayingProgress");
        }
        return;
    }
}

export class ZegoMediaPlayerImpl extends ZegoMediaPlayer {

    private _index: number

    constructor(index: number) {
        super();
        this._index = index;
    }

    on<MediaPlayerEventType extends keyof ZegoMediaPlayerListener>(event: MediaPlayerEventType, callback: ZegoMediaPlayerListener[MediaPlayerEventType]): void {
        const native_listener = (res: any) => {
            const {data, idx} = res;

            if(idx >= 0) {
                let mediaPlayer = ZegoExpressEngineImpl._mediaPlayerMap[idx];
                // @ts-ignore
                callback(mediaPlayer, ...data);
            }
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

    off<MediaPlayerEventType extends keyof ZegoMediaPlayerListener>(event: MediaPlayerEventType, callback?: ZegoMediaPlayerListener[MediaPlayerEventType]): void {
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

    loadResource(path: string): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerLoadResource(this._index, path);
    }

    start(): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerStart(this._index);
    }

    stop(): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerStop(this._index);
    }

    pause(): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerPause(this._index);
    }

    resume(): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerResume(this._index);
    }

    setPlayerView(view: ZegoView): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerSetPlayerCanvas(this._index, view);
    }

    seekTo(millisecond: number): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerSeekTo(this._index, millisecond);
    }

    enableRepeat(enable: boolean): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerEnableRepeat(this._index, enable);
    }

    enableAux(enable: boolean): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerEnableAux(this._index, enable);
    }

    muteLocal(mute: boolean): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerMuteLocal(this._index, mute);
    }

    setVolume(volume: number): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerSetVolume(this._index, volume);
    }

    setProgressInterval(millisecond: number): Promise<void> {
        return ZegoExpressNativeModule.mediaPlayerSetProgressInterval(this._index, millisecond);
    }

    getVolume(): Promise<number> {
        return ZegoExpressNativeModule.mediaPlayerGetVolume(this._index);
    }

    getTotalDuration(): Promise<number> {
        return ZegoExpressNativeModule.mediaPlayerGetTotalDuration(this._index);
    }

    getCurrentProgress(): Promise<number> {
        return ZegoExpressNativeModule.mediaPlayerGetCurrentProgress(this._index);
    }

    getCurrentState(): Promise<ZegoMediaPlayerState> {
        return ZegoExpressNativeModule.mediaPlayerGetCurrentState(this._index);
    }

    getIndex(): number {
        return this._index;
    }
}