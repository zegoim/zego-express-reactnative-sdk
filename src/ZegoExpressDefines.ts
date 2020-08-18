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

export class ZegoPlayerConfig {
    cdnConfig: ZegoCDNConfig
    videoLayer: ZegoPlayerVideoLayer

    constructor(cdnConfig: ZegoCDNConfig, videoLayer: ZegoPlayerVideoLayer) {
        this.cdnConfig = cdnConfig;
        this.videoLayer = videoLayer;
    }
}
