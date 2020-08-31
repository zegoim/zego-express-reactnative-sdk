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
    /**
     * @event ZegoExpressEngine#onDebugError
     * @desc The callback for obtaining debugging error information.
     *
     * When the APIs are not used correctly, the callback prompts for detailed error information, which is controlled by the [setDebugVerbose] interface
     * @property {number} errorCode - Error code, please refer to the Error Codes https://doc-en.zego.im/en/308.html for details
     * @property {string} funcName - Function name
     * @property {string} info - Detailed error information
     */
    debugError: (errorCode: number, funcName: string, info: string) => void;

    /**
     * @event ZegoExpressEngine#onRoomStateUpdate
     * @desc The callback triggered when the room connection state changes.
     *
     * This callback is triggered when the connection status of the room changes, and the reason for the change is notified. Developers can use this callback to determine the status of the current user in the room. If the connection is being requested for a long time, the general probability is that the user's network is unstable.
     * @property {string} roomID - Room ID, a string of up to 128 bytes in length.
     * @property {ZegoRoomState} state - Changed room state
     * @property {number} errorCode - Error code, please refer to the Error Codes https://doc-en.zego.im/en/308.html for details
     * @property {string} extendedData - Extended Information with state updates. As the standby, only an empty json table is currently returned
     */
    roomStateUpdate: (roomID: string, state: ZegoRoomState, errorCode: number, extendedData: string) => void;

    /**
     * @event ZegoExpressEngine#onRoomUserUpdate
     * @desc The callback triggered when the number of other users in the room increases or decreases.
     *
     * Note that the callback is only triggered when the isUserStatusNotify parameter in the ZegoRoomConfig passed loginRoom function is true. Developers can use this callback to determine the situation of users in the room.
     * If developers need to use ZEGO room users notifications, please make sure that each login user sets isUserStatusNotify to true
     * When a user logs in to a room for the first time, other users already exist in this room, and a user list of the type of addition is received.
     * When the user is already in the room, other users in this room will trigger this callback to notify the changed users when they enter or exit the room.
     * @property {string} roomID - Room ID where the user is logged in, a string of up to 128 bytes in length.
     * @property {ZegoUpdateType} updateType - Update type (add/delete)
     * @property {ZegoUser[]} userList - List of users changed in the current room
     */
    roomUserUpdate: (roomID: string, updateType: ZegoUpdateType, userList: [ZegoUser]) => void;

    /**
     * @event ZegoExpressEngine#onRoomOnlineUserCountUpdate
     * @desc The callback triggered every 30 seconds to report the current number of online users.
     *
     * This interface is called back every 30 seconds.
     * Developers can use this callback to show the number of user online in the current room.
     * @property {string} roomID - Room ID where the user is logged in, a string of up to 128 bytes in length.
     * @property {number} count - Count of online users
     */
    roomOnlineUserCountUpdate: (roomID: string, count: number) => void;

    /**
     * @event ZegoExpressEngine#onRoomStreamUpdate
     * @desc The callback triggered when the number of streams published by the other users in the same room increases or decreases.
     *
     * When a user logs in to a room for the first time, there are other users in the room who are publishing streams, and will receive a stream list of the added type.
     * When the user is already in the room, other users in this room will trigger this callback to notify the changed stream list when adding or deleting streams.
     * Developers can use this callback to determine if there are other users in the same room who have added or stopped streaming, in order to implement active play stream [startPlayingStream] or active stop playing stream [stopPlayingStream], and use simultaneous Changes to Streaming render UI widget;
     * @property {string} result.roomID - Room ID where the user is logged in, a string of up to 128 bytes in length.
     * @property {ZegoUpdateType} result.updateType - Update type (add/delete)
     * @property {ZegoStream[]} result.streamList - Updated stream list
     */
    roomStreamUpdate: (roomID: string, updateType: ZegoUpdateType, streamList: [ZegoStream]) => void;

    /**
     * @event ZegoExpressEngine#onPublisherStateUpdate
     * @desc The callback triggered when the state of stream publishing changes.
     *
     * After publishing the stream successfully, the notification of the publish stream state change can be obtained through the callback interface.
     * You can roughly judge the user's uplink network status based on whether the state parameter is in [PUBLISH_REQUESTING].
     * ExtendedData is extended information with state updates. If you use ZEGO's CDN content distribution network, after the stream is successfully published, the keys of the content of this parameter are flv_url_list, rtmp_url_list, hls_url_list. These correspond to the publishing stream URLs of the flv, rtmp, and hls protocols.
     * @property {string} streamID - Stream ID
     * @property {ZegoPublisherState} state - Status of publishing stream
     * @property {number} errorCode - The error code corresponding to the status change of the publish stream. Please refer to the Error Codes https://doc-en.zego.im/en/308.html for details.
     * @property {string} extendedData - Extended information with state updates.
     */
    publisherStateUpdate: (streamID: string, state: ZegoPublisherState, errorCode: number, extendedData: string) => void;

    /**
     * @event ZegoExpressEngine#onPublisherQualityUpdate
     * @desc The callback triggered every 3 seconds to report the current stream publishing quality.
     *
     * After the successful publish, the callback will be received every 3 seconds. Through the callback, the collection frame rate, bit rate, RTT, packet loss rate and other quality data of the published audio and video stream can be obtained, and the health of the publish stream can be monitored in real time.
     * You can monitor the health of the published audio and video streams in real time according to the quality parameters of the callback api, in order to show the uplink network status in real time on the device UI interface.
     * If you does not know how to use the parameters of this callback api, you can only pay attention to the level field of the quality parameter, which is a comprehensive value describing the uplink network calculated by SDK based on the quality parameters.
     * @property {string} streamID - Stream ID
     * @property {ZegoPublishStreamQuality} quality - Published stream quality, including audio and video frame rate, bit rate, resolution, RTT, etc.
     */
    publisherQualityUpdate: (streamID: string, quality: ZegoPublishStreamQuality) => void;

    /**
     * @event ZegoExpressEngine#onPublisherCapturedAudioFirstFrame
     * @desc The callback triggered when the first audio frame is captured.
     *
     * After the startPublishingStream interface is called successfully, the SDK will receive this callback notification when it collects the first frame of audio data.
     * In the case of no startPublishingStream audio and video stream or preview, the first startPublishingStream audio and video stream or first preview, that is, when the engine of the audio and video module inside SDK starts, it will collect audio data of the local device and receive this callback.
     * Developers can use this callback to determine whether SDK has actually collected audio data. If the callback is not received, the audio capture device is occupied or abnormal.
     */
    publisherCapturedAudioFirstFrame: () => void;

    /**
     * @event ZegoExpressEngine#onPublisherCapturedVideoFirstFrame
     * @desc The callback triggered when the first video frame is captured.
     *
     * After the startPublishingStream interface is called successfully, the SDK will receive this callback notification when it collects the first frame of video data.
     * In the case of no startPublishingStream video stream or preview, the first startPublishingStream video stream or first preview, that is, when the engine of the audio and video module inside SDK starts, it will collect video data of the local device and receive this callback.
     * Developers can use this callback to determine whether SDK has actually collected video data. If the callback is not received, the video capture device is occupied or abnormal.
     * @property {ZegoPublishChannel} channel - Publishing stream channel.If you only publish one audio and video stream, you can ignore this parameter.
     */
    publisherCapturedVideoFirstFrame: (channel: ZegoPublishChannel) => void;

    /**
     * @event ZegoExpressEngine#onPublisherVideoSizeChanged
     * @desc The callback triggered when the video capture resolution changes.
     *
     * After the successful publish, the callback will be received if there is a change in the video capture resolution in the process of publishing the stream.
     * When the audio and video stream is not published or previewed for the first time, the publishing stream or preview first time, that is, the engine of the audio and video module inside the SDK is started, the video data of the local device will be collected, and the collection resolution will change at this time.
     * You can use this callback to remove the cover of the local preview UI and similar operations.You can also dynamically adjust the scale of the preview view based on the resolution of the callback.
     * @property {number} width - Video capture resolution width
     * @property {number} rheight - Video capture resolution width
     * @property {ZegoPublishChannel} channel - Publishing stream channel.If you only publish one audio and video stream, you can ignore this parameter.
     */
    publisherVideoSizeChanged: (width: number, height: number, channel: ZegoPublishChannel) => void;

    /**
     * @event ZegoExpressEngine#onPlayerStateUpdate
     * @desc The callback triggered when the state of stream playing changes.
     *
     * After publishing the stream successfully, the notification of the publish stream state change can be obtained through the callback interface.
     * You can roughly judge the user's downlink network status based on whether the state parameter is in [PLAY_REQUESTING].
     * @property {string} streamID - stream ID
     * @property {ZegoPlayerState} state - Current play state
     * @property {number} result.errorCode - The error code corresponding to the status change of the playing stream. Please refer to the Error Codes https://doc-en.zego.im/en/308.html for details.
     * @property {string} result.extendedData - Extended Information with state updates. As the standby, only an empty json table is currently returned
     */
    playerStateUpdate: (streamID: string, state: ZegoPlayerState, errorCode: number, extendedData: string) => void;

    /**
     * @event ZegoExpressEngine#onPlayerQualityUpdate
     * @desc The callback triggered every 3 seconds to report the current stream playing quality.
     *
     * After calling the startPlayingStream successfully, this callback will be triggered every 3 seconds. The collection frame rate, bit rate, RTT, packet loss rate and other quality data  can be obtained, such the health of the publish stream can be monitored in real time.
     * You can monitor the health of the played audio and video streams in real time according to the quality parameters of the callback api, in order to show the downlink network status on the device UI interface in real time.
     * If you does not know how to use the various parameters of the callback api, you can only focus on the level field of the quality parameter, which is a comprehensive value describing the downlink network calculated by SDK based on the quality parameters.
     * @property {string} treamID - Stream ID
     * @property {ZegoPlayStreamQuality} quality - Playing stream quality, including audio and video frame rate, bit rate, resolution, RTT, etc.
     */
    playerQualityUpdate: (streamID: string, quality: ZegoPlayStreamQuality) => void;

    /**
     * @event ZegoExpressEngine#onPlayerMediaEvent
     * @desc The callback triggered when a media event occurs during streaming playing.
     *
     * This callback is triggered when an event such as audio and video jamming and recovery occurs in the playing stream.
     * You can use this callback to make statistics on stutters or to make friendly displays in the UI interface of the app.
     * @property {string} streamID - Stream ID
     * @property {ZegoPlayerMediaEvent} event - Play media event callback
     */
    playerMediaEvent: (streamID: string, event: ZegoPlayerMediaEvent) => void;

    /**
     * @event ZegoExpressEngine#onPlayerRecvAudioFirstFrame
     * @desc The callback triggered when the first audio frame is received.
     *
     * After the startPlayingStream interface is called successfully, the SDK will receive this callback notification when it collects the first frame of audio data.
     * @property {string} rstreamID - Stream ID
     */
    playerRecvAudioFirstFrame: (streamID: string) => void;

    /**
     * @event ZegoExpressEngine#onPlayerRecvVideoFirstFrame
     * @desc The callback triggered when the first video frame is received.
     *
     * After the startPlayingStream interface is called successfully, the SDK will receive this callback notification when it collects the first frame of video  data.
     * @property {string} streamID - Stream ID
     */
    playerRecvVideoFirstFrame: (streamID: string) => void;

    /**
     * @event ZegoExpressEngine#onPlayerRenderVideoFirstFrame
     * @desc The callback triggered when the first video frame is rendered.
     *
     * After the startPlayingStream interface is called successfully, the SDK will receive this callback notification when it rendered the first frame of video  data.
     * You can use this callback to count time consuming that take the first frame time or update the playback stream.
     * @property {string} streamID - Stream ID
     */
    playerRenderVideoFirstFrame: (streamID: string) => void;

    /**
     * @event ZegoExpressEngine#onPlayerVideoSizeChanged
     * @desc The callback triggered when the stream playback resolution changes.
     *
     * If there is a change in the video resolution of the playing stream, the callback will be triggered, and the user can adjust the display for that stream dynamically.
     * If the publishing stream end triggers the internal stream flow control of SDK due to a network problem, the encoding resolution of the streaming end may be dynamically reduced, and this callback will also be received at this time.
     * If the stream is only audio data, the callback will not be received.
     * This callback will be triggered when the played audio and video stream is actually rendered to the set UI play canvas. You can use this callback notification to update or switch UI components that actually play the stream.
     * @property {string} streamID - Stream ID
     * @property {number} width - The width of the video
     * @property {number} height - The height of the video
     */
    playerVideoSizeChanged: (streamID: string, width: number, height: number) => void;

    /**
     * @event ZegoExpressEngine#onCapturedSoundLevelUpdate
     * @desc The callback triggered every 100ms to report the sound level of the locally captured audio.
     *
     * Callback notification period is 100 ms'. To trigger this callback API, the [startSoundLevelMonitor] interface must be called to start the sound level monitor and you must be in a state where it is publishing the audio and video stream or be in [startPreview] state.
     * @property {number} soundLevel - Locally captured sound level value, ranging from 0.0 to 100.0
     */
    capturedSoundLevelUpdate: (soundLevel: number) => void;

    /**
     * @event ZegoExpressEngine#onRemoteSoundLevelUpdate
     * @desc The callback triggered every 100ms to report the sound level of the remote stream.
     *
     * Callback notification period is 100 ms'. To trigger this callback API, the [startSoundLevelMonitor] interface must be called to start the sound level monitor and you must be in a state where it is playing the audio and video stream.
     * @property {Object} soundLevels - Remote sound level hash map, key is the streamID, value is the sound level value of the corresponding streamID, value ranging from 0.0 to 100.0
     */
    remoteSoundLevelUpdate: (soundLevels: {[key: string]: number}) => void;

    /**
     * @event ZegoExpressEngine#onDeviceError
     * @desc The callback triggered when a device exception occurs.
     *
     * This callback is triggered when an exception occurs when reading or writing the audio and video device.
     * @property {number} errorCode - The error code corresponding to the status change of the playing stream. Please refer to the Error Codes https://doc-en.zego.im/en/308.html for details
     * @property {string} deviceName - device name
     */
    deviceError: (errorCode: number, deviceName: string) => void;

    /**
     * @event ZegoExpressEngine#onRemoteCameraStateUpdate
     * @desc The callback triggered when the state of the remote camera changes.
     *
     * When the state of the remote camera device changes, such as switching the camera, by monitoring this callback, it is possible to obtain an event related to the far-end camera, which can be used to prompt the user that the video may be abnormal.
     * Developers of 1v1 education scenarios or education small class scenarios and similar scenarios can use this callback notification to determine whether the camera device of the remote publishing stream device is working normally, and preliminary understand the cause of the device problem according to the corresponding state.
     * @property {string} streamID - Stream ID
     * @property {ZegoRemoteDeviceState} state - Remote camera status
     */
    remoteCameraStateUpdate: (streamID: string, state: ZegoRemoteDeviceState) => void;

    /**
     * @event ZegoExpressEngine#onRemoteMicStateUpdate
     * @desc The callback triggered when the state of the remote microphone changes.
     *
     * When the state of the remote microphone device is changed, such as switching a microphone, etc., by listening to the callback, it is possible to obtain an event related to the remote microphone, which can be used to prompt the user that the audio may be abnormal.
     * Developers of 1v1 education scenarios or education small class scenarios and similar scenarios can use this callback notification to determine whether the microphone device of the remote publishing stream device is working normally, and preliminary understand the cause of the device problem according to the corresponding state.
     * @property {string} streamID - Stream ID
     * @property {ZegoRemoteDeviceState} state - Remote microphone status
     */
    remoteMicStateUpdate: (streamID: string, state: ZegoRemoteDeviceState) => void;
}

export interface ZegoMediaPlayerListener {
    /**
     * @event ZegoMediaPlayer#onMediaPlayerStateUpdate
     * @desc The callback triggered when the state of the media player changes.
     *
     * @property {ZegoMediaPlayer} mediaPlayer - MediaPlayer instance
     * @property {ZegoMediaPlayerState} state - Media player status
     * @property {number} errorCode - Error code, please refer to the Error Codes https://doc-en.zego.im/en/308.html for details
     */
    mediaPlayerStateUpdate: (mediaPlayer: ZegoMediaPlayer, state: ZegoMediaPlayerState, errorCode: number) => void;

    /**
     * @event ZegoMediaPlayer#onMediaPlayerNetworkEvent
     * @desc The callback triggered when the network status of the media player changes.
     *
     * @property {ZegoMediaPlayer} mediaPlayer - MediaPlayer instance
     * @property {ZegoMediaPlayerNetworkEvent} networkEvent - Network status event
     */
    mediaPlayerNetworkEvent: (mediaPlayer: ZegoMediaPlayer, networkEvent: ZegoMediaPlayerNetworkEvent) => void;

    /**
     * @event ZegoMediaPlayer#onMediaPlayerPlayingProgress
     * @desc The callback to report the current playback progress of the media player.
     *
     * @property {ZegoMediaPlayer} mediaPlayer - MediaPlayer instance
     * @property {number} millisecond - Progress in milliseconds
     */
    mediaPlayerPlayingProgress: (mediaPlayer: ZegoMediaPlayer, millisecond: number) => void;
}