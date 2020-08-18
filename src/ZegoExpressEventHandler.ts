import {
    ZegoRoomState,
    ZegoPublisherState,
    ZegoPlayerState
} from './ZegoExpressDefines'

export type ZegoAnyCallback = (...args: any[]) => any

export interface ZegoEventListener {
    roomStateUpdate: (roomID: string, state: ZegoRoomState, errorCode: number, extendedData: object) => void;
    publisherStateUpdate: (streamID: string, state: ZegoPublisherState, errorCode: number, extendedData: object) => void;
    playerStateUpdate: (streamID: string, state: ZegoPlayerState, errorCode: number, extendedData: object) => void;
}