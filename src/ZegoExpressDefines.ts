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

export class ZegoUser {
    userID: string
    userName: string

    constructor(userID: string, userName: string) {
        this.userID = userID;
        this.userName = userName;
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

export class ZegoPlayerConfig {
    cdnConfig: ZegoCDNConfig
    videoLayer: ZegoPlayerVideoLayer

    constructor(cdnConfig: ZegoCDNConfig, videoLayer: ZegoPlayerVideoLayer) {
        this.cdnConfig = cdnConfig;
        this.videoLayer = videoLayer;
    }
}
