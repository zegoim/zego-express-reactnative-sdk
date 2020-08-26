import { ZegoMediaPlayerListener } from "./ZegoExpressEventHandler"

export enum ZegoScenario {
    General = 0,
    Communication = 1,
    Live = 2,
}

export enum ZegoRoomState {
    Disconnected = 0,
    Connecting = 1,
    Connected = 2,
}

export enum ZegoUpdateType {
    Add,
    Delete
}

export enum ZegoPublishChannel {
    Main = 0,
    Aux = 1,
}

export enum ZegoPublisherState {
    NoPublish = 0,
    PublishRequesting = 1,
    Publishing = 2,
}

export enum ZegoVideoConfigPreset {
    Preset180P = 0,
    Preset270P = 1,
    Preset360P = 2,
    Preset540P = 3,
    Preset720P = 4,
    Preset1080P = 5,
}

export enum ZegoAudioConfigPreset {
    BasicQuality = 0,
    StandardQuality = 1,
    StandardQualityStereo = 2,
    HighQuality = 3,
    HighQualityStereo = 4,
}

export enum ZegoVideoCodecID {
    Default = 0,
    Svc = 1,
    Vp8 = 2,
}

export enum ZegoViewMode {
    AspectFit = 0,
    AspectFill = 1,
    ScaleToFill = 2,
}

export enum ZegoVideoMirrorMode {
    OnlyPreviewMirror = 0,
    BothMirror = 1,
    NoMirror = 2,
    OnlyPublishMirror = 3,
}

export enum ZegoAudioChannel {
    Unknown,
    Mono,
    Stereo
}

export enum ZegoAudioCodecID {
    Default,
    Normal,
    Normal2,
    Normal3,
    Low,
    Low2,
    Low3
}

export enum ZegoStreamQualityLevel {
    Excellent,
    Good,
    Medium,
    Bad,
    Die
}

export enum ZegoOrientation {
    portraitUp,
    landscapeLeft,
    portraitDown,
    landscapeRight,
}

export enum ZegoAECMode {
    Aggressive,
    Medium,
    Soft
}

export enum ZegoANSMode {
    Soft,
    Medium,
    Aggressive
}

export enum ZegoPlayerState {
    NoPlay = 0,
    PlayRequesting = 1,
    Playing = 2,
}

export enum ZegoPlayerVideoLayer {
    Auto = 0,
    Base = 1,
    Extend = 2,
}

export enum ZegoPlayerMediaEvent {
    AudioBreakOccur,
    AudioBreakResume,
    VideoBreakOccur,
    VideoBreakResume
}

export enum ZegoRemoteDeviceState {
    /// Device on
    Open,
    /// General device error
    GenericError,
    /// Invalid device ID
    InvalidID,
    /// No permission
    NoAuthorization,
    /// Captured frame rate is 0
    ZeroFPS,
    /// The device is occupied
    InUseByOther,
    /// The device is not plugged in or unplugged
    Unplugged,
    /// The system needs to be restarted
    RebootRequired,
    /// System media services stop, such as under the iOS platform, when the system detects that the current pressure is huge (such as playing a lot of animation), it is possible to disable all media related services.
    SystemMediaServicesLost,
    /// Capturing disabled
    Disable,
    /// The remote device is muted
    Mute,
    /// The device is interrupted, such as a phone call interruption, etc.
    Interruption,
    /// There are multiple apps at the same time in the foreground, such as the iPad app split screen, the system will prohibit all apps from using the camera.
    InBackground,
    /// CDN server actively disconnected
    MultiForegroundApp,
    /// The system is under high load pressure and may cause abnormal equipment.
    BySystemPressure
}

export enum ZegoMediaPlayerState {
    NoPlay,
    Playing,
    Pausing,
    PlayEnded
}

export enum ZegoMediaPlayerNetworkEvent {
    BufferBegin,
    BufferEnded
}

export class ZegoLogConfig {
    logPath?: string
    logSize?: number
}

export class ZegoEngineConfig {
    logConfig?: ZegoLogConfig
    advancedConfig: {[key: string]: string}
}

export class ZegoUser {
    userID: string
    userName: string

    constructor(userID: string, userName: string) {
        this.userID = userID;
        this.userName = userName;
    }
}

export class ZegoStream {
    streamID: string
    user: ZegoUser
    extraInfo: string

    constructor(streamID: string, user: ZegoUser, extraInfo: string) {
        this.streamID = streamID;
        this.user = user;
        this.extraInfo = extraInfo;
    }
}

export class ZegoRoomConfig {
    maxMemberCount: number
    isUserStatusNotify: boolean
    token: string

    constructor(maxMemberCount: number, isUserStatusNotify: boolean, token: string) {
        this.maxMemberCount = maxMemberCount;
        this.isUserStatusNotify = isUserStatusNotify;
        this.token = token;
    }
}

export class ZegoView {
    reactTag: number
    viewMode: ZegoViewMode
    backgroundColor: number

    constructor(reactTag: number, viewMode: ZegoViewMode, backgroundColor: number) {
        this.reactTag = reactTag;
        this.viewMode = viewMode;
        this.backgroundColor = backgroundColor;
    }
}

export class ZegoCDNConfig {
    url: string
    authParam: string

    constructor(url: string, authParam: string) {
        this.url = url;
        this.authParam = authParam;
    }
}

export class ZegoVideoConfig {
    captureWidth: number
    captureHeight: number
    encodeWidth: number
    encodeHeight: number
    bitrate: number
    fps: number
    codecID: ZegoVideoCodecID

    constructor(preset: ZegoVideoConfigPreset) {
        
        this.codecID = ZegoVideoCodecID.Default;

        switch (preset) {
            case ZegoVideoConfigPreset.Preset180P:
                this.captureWidth = 180;
                this.captureHeight = 320;
                this.encodeWidth = 180;
                this.encodeHeight = 320;
                this.bitrate = 300;
                this.fps = 15;
                break;
            
            case ZegoVideoConfigPreset.Preset270P:
                this.captureWidth = 270;
                this.captureHeight = 480;
                this.encodeWidth = 270;
                this.encodeHeight = 480;
                this.bitrate = 400;
                this.fps = 15;
                break;

            case ZegoVideoConfigPreset.Preset360P:
                this.captureWidth = 360;
                this.captureHeight = 640;
                this.encodeWidth = 360;
                this.encodeHeight = 640;
                this.bitrate = 600;
                this.fps = 15;
                break;

            case ZegoVideoConfigPreset.Preset540P:
                this.captureWidth = 540;
                this.captureHeight = 960;
                this.encodeWidth = 540;
                this.encodeHeight = 960;
                this.bitrate = 1200;
                this.fps = 15;
                break;
            
            case ZegoVideoConfigPreset.Preset720P:
                this.captureWidth = 720;
                this.captureHeight = 1280;
                this.encodeWidth = 720;
                this.encodeHeight = 1280;
                this.bitrate = 1500;
                this.fps = 15;
                break;
            
            case ZegoVideoConfigPreset.Preset1080P:
                this.captureWidth = 1080;
                this.captureHeight = 1920;
                this.encodeWidth = 1080;
                this.encodeHeight = 1920;
                this.bitrate = 3000;
                this.fps = 15;
                break;

            default:
                this.captureWidth = 360;
                this.captureHeight = 640;
                this.encodeWidth = 360;
                this.encodeHeight = 640;
                this.bitrate = 600;
                this.fps = 15;
                break;
        }
    }
}

export class ZegoAudioConfig {
    bitrate: number
    channel: ZegoAudioChannel
    codecID: ZegoAudioCodecID

    constructor(preset: ZegoAudioConfigPreset) {
        this.codecID = ZegoAudioCodecID.Default;
        switch (preset) {
            case ZegoAudioConfigPreset.BasicQuality:
                this.bitrate = 16;
                this.channel = ZegoAudioChannel.Mono;
                break;
            case ZegoAudioConfigPreset.StandardQuality:
                this.bitrate = 48;
                this.channel = ZegoAudioChannel.Mono;
                break;
            case ZegoAudioConfigPreset.StandardQualityStereo:
                this.bitrate = 56;
                this.channel = ZegoAudioChannel.Stereo;
                break;
            case ZegoAudioConfigPreset.HighQuality:
                this.bitrate = 128;
                this.channel = ZegoAudioChannel.Mono;
                break;
            case ZegoAudioConfigPreset.HighQualityStereo:
                this.bitrate = 192;
                this.channel = ZegoAudioChannel.Stereo;
                break;
            default:
                this.bitrate = 48;
                this.channel = ZegoAudioChannel.Mono;
                break;
        }
    }
}

export class ZegoBeautifyOption {
    polishStep: number
    whitenFactor: number
    sharpenFactor: number

    constructor() {
        this.polishStep = 0.2;
        this.whitenFactor = 0.5;
        this.sharpenFactor = 0.1;
    }
}

export class ZegoPublishStreamQuality {
    videoCaptureFPS: number
    videoEncodeFPS: number
    videoSendFPS: number
    videoKBPS: number
    audioCaptureFPS: number
    audioSendFPS: number
    audioKBPS: number
    rtt: number
    packetLostRate: number
    level: ZegoStreamQualityLevel
    isHardwareEncode: boolean
    totalSendBytes: number
    audioSendBytes: number
    videoSendBytes: number
}

export class ZegoPlayerConfig {
    cdnConfig: ZegoCDNConfig
    videoLayer: ZegoPlayerVideoLayer

    constructor(cdnConfig: ZegoCDNConfig, videoLayer: ZegoPlayerVideoLayer) {
        this.cdnConfig = cdnConfig;
        this.videoLayer = videoLayer;
    }
}

export class ZegoPlayStreamQuality {
    videoRecvFPS: number
    videoDecodeFPS: number
    videoRenderFPS: number
    videoKBPS: number
    audioRecvFPS: number
    audioDecodeFPS: number
    audioRenderFPS: number
    audioKBPS: number
    rtt: number
    packetLostRate: number
    peerToPeerDelay: number
    peerToPeerPacketLostRate: number
    level: ZegoStreamQualityLevel
    delay: number
    isHardwareDecode: boolean
    totalRecvBytes: number
    audioRecvBytes: number
    videoRecvBytes: number
}

export interface ZegoMediaPlayerLoadResourceResult {
    errorCode: number
}

export interface ZegoMediaPlayerSeekToResult {
    errorCode: number
}

export abstract class ZegoMediaPlayer {
    
    abstract on<MediaPlayerEventType extends keyof ZegoMediaPlayerListener>(event: MediaPlayerEventType, callback: ZegoMediaPlayerListener[MediaPlayerEventType]): void;

    abstract off<MediaPlayerEventType extends keyof ZegoMediaPlayerListener>(event: MediaPlayerEventType, callback?: ZegoMediaPlayerListener[MediaPlayerEventType]): void;

    abstract loadResource(path: string): Promise<ZegoMediaPlayerLoadResourceResult>;

    abstract start(): Promise<void>;

    abstract stop(): Promise<void>;

    abstract pause(): Promise<void>;

    abstract resume(): Promise<void>;

    abstract setPlayerView(view: ZegoView): Promise<void>;

    abstract seekTo(millisecond: number): Promise<ZegoMediaPlayerSeekToResult>;

    abstract enableRepeat(enable: boolean): Promise<void>;

    abstract enableAux(enable: boolean): Promise<void>;

    abstract muteLocal(mute: boolean): Promise<void>;

    abstract setVolume(volume: number): Promise<void>;

    abstract setProgressInterval(millisecond: number): Promise<void>;

    abstract getVolume(): Promise<number>;

    abstract getTotalDuration(): Promise<number>;

    abstract getCurrentProgress(): Promise<number>;

    abstract getCurrentState(): Promise<ZegoMediaPlayerState>;

    abstract getIndex(): number;
}
