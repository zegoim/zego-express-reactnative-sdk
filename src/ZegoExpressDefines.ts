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

