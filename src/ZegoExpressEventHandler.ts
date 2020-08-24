import {
    ZegoRoomState,
    ZegoPublisherState,
    ZegoPlayerState,
    ZegoMediaPlayer,
    ZegoMediaPlayerState,
    ZegoMediaPlayerNetworkEvent
} from './ZegoExpressDefines'

export type ZegoAnyCallback = (...args: any[]) => any

export interface ZegoEventListener {
    RoomStateUpdate: (roomID: string, state: ZegoRoomState, errorCode: number, extendedData: object) => void;
    PublisherStateUpdate: (streamID: string, state: ZegoPublisherState, errorCode: number, extendedData: object) => void;
    PlayerStateUpdate: (streamID: string, state: ZegoPlayerState, errorCode: number, extendedData: object) => void;
    MediaPlayerStateUpdate: (mediaPlayer: ZegoMediaPlayer, state: ZegoMediaPlayerState, errorCode: number) => void;
    MediaPlayerNetworkEvent: (mediaPlayer: ZegoMediaPlayer, networkEvent: ZegoMediaPlayerNetworkEvent) => void;
    MediaPlayerPlayingProgress: (mediaPlayer: ZegoMediaPlayer, millisecond: number) => void;
}

export interface ZegoMediaPlayerListener {
    MediaPlayerStateUpdate: (mediaPlayer: ZegoMediaPlayer, state: ZegoMediaPlayerState, errorCode: number) => void;
    MediaPlayerNetworkEvent: (mediaPlayer: ZegoMediaPlayer, networkEvent: ZegoMediaPlayerNetworkEvent) => void;
    MediaPlayerPlayingProgress: (mediaPlayer: ZegoMediaPlayer, millisecond: number) => void;
}