import {
    ZegoScenario,
    ZegoPublishChannel,
    ZegoUser,
    ZegoRoomConfig,
    ZegoView,
    ZegoVideoConfig,
    ZegoPlayerConfig,
    ZegoMediaPlayer,
    ZegoEngineConfig,
    ZegoVideoMirrorMode,
    ZegoOrientation,
    ZegoAudioConfig,
    ZegoAECMode,
    ZegoANSMode,
    ZegoBeautifyOption
} from "./ZegoExpressDefines"
import { ZegoEventListener} from './ZegoExpressEventHandler';
import {ZegoExpressEngineImpl} from './impl/ZegoExpressEngineImpl';


export default class ZegoExpressEngine {
    
    /// Creates a singleton instance of ZegoExpressEngine.
    static instance(): ZegoExpressEngine {
        return ZegoExpressEngineImpl.getInstance();
    }

    static createEngine(appID: number, appSign: string, isTestEnv: boolean, scenario: ZegoScenario): Promise<ZegoExpressEngine> {
        return ZegoExpressEngineImpl.createEngine(appID, appSign, isTestEnv, scenario);
    }

    static destroyEngine(): Promise<void> {
        return ZegoExpressEngineImpl.destroyEngine();
    }

    static setEngineConfig(config: ZegoEngineConfig): Promise<void> {
        return ZegoExpressEngineImpl.setEngineConfig(config);
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
        return ZegoExpressEngineImpl.getInstance().off(event, callback);
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

    setVideoMirrorMode(mode: ZegoVideoMirrorMode, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setVideoMirrorMode(mode, channel);
    }

    setAppOrientation(orientation: ZegoOrientation, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setAppOrientation(orientation, channel);
    }

    setAudioConfig(config: ZegoAudioConfig): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setAudioConfig(config);
    }

    getAudioConfig(): Promise<ZegoAudioConfig> {
        return ZegoExpressEngineImpl.getInstance().getAudioConfig();
    }
    
    mutePublishStreamAudio(mute: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePublishStreamAudio(mute, channel);
    }

    mutePublishStreamVideo(mute: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePublishStreamVideo(mute, channel);
    }

    setCaptureVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setCaptureVolume(volume);
    }

    enableHardwareEncoder(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableHardwareEncoder(enable);
    }

    startPlayingStream(streamID: string, view: ZegoView, config?: ZegoPlayerConfig): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startPlayingStream(streamID, view, config);
    }

    stopPlayingStream(streamID: string): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopPlayingStream(streamID);
    }

    setPlayVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setPlayVolume(volume);
    }

    mutePlayStreamAudio(streamID: string, mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePlayStreamAudio(streamID, mute);
    }

    mutePlayStreamVideo(streamID: string, mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePlayStreamVideo(streamID, mute);
    }

    enableHardwareDecoder(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableHardwareDecoder(enable);
    }

    muteMicrophone(mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().muteMicrophone(mute);
    }

    isMicrophoneMuted(): Promise<boolean> {
        return ZegoExpressEngineImpl.getInstance().isMicrophoneMuted();
    }

    muteSpeaker(mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().muteSpeaker(mute);
    }

    isSpeakerMuted(): Promise<boolean> {
        return ZegoExpressEngineImpl.getInstance().isSpeakerMuted();
    }

    enableAudioCaptureDevice(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableAudioCaptureDevice(enable);
    }

    enableCamera(enable: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableCamera(enable, channel);
    }

    useFrontCamera(enable: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().useFrontCamera(enable, channel);
    }    

    startSoundLevelMonitor(): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startSoundLevelMonitor();
    }

    stopSoundLevelMonitor(): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopSoundLevelMonitor();
    }

    enableAEC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableAEC(enable);
    }

    enableHeadphoneAEC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableHeadphoneAEC(enable);
    }

    setAECMode(mode: ZegoAECMode): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setAECMode(mode);
    }

    enableAGC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableAGC(enable);
    }

    enableANS(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableANS(enable);
    }

    setANSMode(mode: ZegoANSMode): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setANSMode(mode);
    }

    enableBeautify(feature: number, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableBeautify(feature, channel);
    }

    setBeautifyOption(option: ZegoBeautifyOption, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setBeautifyOption(option, channel);
    }

    createMediaPlayer(): Promise<ZegoMediaPlayer|null> {
        return ZegoExpressEngineImpl.getInstance().createMediaPlayer();
    }

    destroyMediaPlayer(mediaPlayer: ZegoMediaPlayer): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().destroyMediaPlayer(mediaPlayer);
    }

}