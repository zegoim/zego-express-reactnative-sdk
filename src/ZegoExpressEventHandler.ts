import {
    ZegoRoomState,
    ZegoPublisherState,
    ZegoPlayerState,
    ZegoMediaPlayer,
    ZegoMediaPlayerState,
    ZegoMediaPlayerNetworkEvent,
    ZegoUser,
    ZegoPublishChannel,
    ZegoUpdateType,
    ZegoStream,
    ZegoPublishStreamQuality,
    ZegoPlayStreamQuality,
    ZegoPlayerMediaEvent,
    ZegoRemoteDeviceState
} from './ZegoExpressDefines'

export type ZegoAnyCallback = (...args: any[]) => any

export interface ZegoEventListener {
    DebugError: (errorCode: number, funcName: string, info: string) => void;
    RoomStateUpdate: (roomID: string, state: ZegoRoomState, errorCode: number, extendedData: string) => void;
    RoomUserUpdate: (roomID: string, updateType: ZegoUpdateType, userList: [ZegoUser]) => void;
    RoomOnlineUserCountUpdate: (roomID: string, count: number) => void;
    RoomStreamUpdate: (roomID: string, updateType: ZegoUpdateType, streamList: [ZegoStream]) => void;
    PublisherStateUpdate: (streamID: string, state: ZegoPublisherState, errorCode: number, extendedData: string) => void;
    PublisherQualityUpdate: (streamID: string, quality: ZegoPublishStreamQuality) => void;
    PublisherCapturedAudioFirstFrame: () => void;
    PublisherCapturedVideoFirstFrame: (channel: ZegoPublishChannel) => void;
    PublisherVideoSizeChanged: (width: number, height: number, channel: ZegoPublishChannel) => void;
    PlayerStateUpdate: (streamID: string, state: ZegoPlayerState, errorCode: number, extendedData: string) => void;
    PlayerQualityUpdate: (streamID: string, quality: ZegoPlayStreamQuality) => void;
    PlayerMediaEvent: (streamID: string, event: ZegoPlayerMediaEvent) => void;
    PlayerRecvAudioFirstFrame: (streamID: string) => void;
    PlayerRecvVideoFirstFrame: (streamID: string) => void;
    PlayerRenderVideoFirstFrame: (streamID: string) => void;
    PlayerVideoSizeChanged: (streamID: string, width: number, height: number) => void;
    CapturedSoundLevelUpdate: (soundLevel: number) => void;
    RemoteSoundLevelUpdate: (soundLevels: {[key: string]: number}) => void;
    DeviceError: (errorCode: number, deviceName: string) => void;
    RemoteCameraStateUpdate: (streamID: string, state: ZegoRemoteDeviceState) => void;
    RemoteMicStateUpdate: (streamID: string, state: ZegoRemoteDeviceState) => void;
}

export interface ZegoMediaPlayerListener {
    MediaPlayerStateUpdate: (mediaPlayer: ZegoMediaPlayer, state: ZegoMediaPlayerState, errorCode: number) => void;
    MediaPlayerNetworkEvent: (mediaPlayer: ZegoMediaPlayer, networkEvent: ZegoMediaPlayerNetworkEvent) => void;
    MediaPlayerPlayingProgress: (mediaPlayer: ZegoMediaPlayer, millisecond: number) => void;
}