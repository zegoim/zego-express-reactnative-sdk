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

    /**
     * Initializes the Engine.
     *
     * The engine needs to be initialized before calling other APIs
     * @param {number} appID - Application ID issued by ZEGO for developers, please apply from the ZEGO Admin Console https://console-express.zego.im/. The value ranges from 0 to 4294967295.
     * @param {string} appSign - Application signature for each AppID, please apply from the ZEGO Admin Console. Application signature is a 64 character string. Each character has a range of '0' ~ '9', 'a' ~ 'z'.
     * @param {boolean} isTestEnv - Choose to use a test environment or a formal commercial environment, the formal environment needs to submit work order configuration in the ZEGO management console. The test environment is for test development, with a limit of 30 rooms and 230 users. Official environment App is officially launched. ZEGO will provide corresponding server resources according to the configuration records submitted by the developer in the management console. The test environment and the official environment are two sets of environments and cannot be interconnected.
     * @param {ZegoScenario} scenario - The application scenario. Developers can choose one of ZegoScenario based on the scenario of the app they are developing, and the engine will preset a more general setting for specific scenarios based on the set scenario. After setting specific scenarios, developers can still call specific api to set specific parameters if they have customized parameter settings.
     * @return {ZegoExpressEngine} singleton instance of ZegoExpressEngine
     */
    static createEngine(appID: number, appSign: string, isTestEnv: boolean, scenario: ZegoScenario): Promise<ZegoExpressEngine> {
        return ZegoExpressEngineImpl.createEngine(appID, appSign, isTestEnv, scenario);
    }

    /**
     * Uninitializes the Engine.
     *
     * uninitialize engine to release the resources
     */
    static destroyEngine(): Promise<void> {
        return ZegoExpressEngineImpl.destroyEngine();
    }

    /** Sets up the advanced engine configurations.
     *
     * Developers need to call this interface to set advanced function configuration when they need advanced functions of the engine.
     *
     * @param {ZegoEngineConfig} config Advanced engine configuration
     */
     static setEngineConfig(config: ZegoEngineConfig): Promise<void> {
        return ZegoExpressEngineImpl.setEngineConfig(config);
    }

    /**
     * Gets the SDK's version number.
     *
     * When the SDK is running, the developer finds that it does not match the expected situation and submits the problem and related logs to the ZEGO technical staff for locating. The ZEGO technical staff may need the information of the engine version to assist in locating the problem.
     * Developers can also collect this information as the version information of the engine used by the app, so that the SDK corresponding to each version of the app on the line.
     * @return {string} - SDK version
     */
    getVersion(): Promise<string> {
        return ZegoExpressEngineImpl.getInstance().getVersion();
    }

    /**
     * Uploads logs to the ZEGO server.
     *
     * By default, SDK creates and prints log files in the app's default directory. Each log file defaults to a maximum of 5MB. Three log files are written over and over in a circular fashion. When calling this interface, SDK will auto package and upload the log files to the ZEGO server.
     * Developers can provide a business “feedback” channel in the app. When users feedback problems, they can call this interface to upload the local log information of SDK to help locate user problems.
     * The API is valid for the entire life cycle of the SDK.
     */
    uploadLog(): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().uploadLog();
    }

    /**
     * Register event handler
     * 
     * @param event event type 
     * @param callback callback
     */
    on<EventType extends keyof ZegoEventListener>(event: EventType, callback: ZegoEventListener[EventType]): void {
        return ZegoExpressEngineImpl.getInstance().on(event, callback);
    }

    /**
     * Unregister event handler
     * 
     * @param event event type
     * @param callback callback
     */
    off<EventType extends keyof ZegoEventListener>(event: EventType, callback?: ZegoEventListener[EventType]): void {
        return ZegoExpressEngineImpl.getInstance().off(event, callback);
    }

    /**
     * Logs in to a room. You must log in to a room before publishing or playing streams.
     *
     * To prevent the app from being impersonated by a malicious user, you can add authentication before logging in to the room, that is, the [token] parameter in the ZegoRoomConfig object passed in by the [config] parameter.
     * Different users who log in to the same room can get room related notifications in the same room (eg [onRoomUserUpdate], [onRoomStreamUpdate], etc.), and users in one room cannot receive room signaling notifications in another room.
     * Messages sent in one room (eg apis [setStreamExtraInfo], [sendBroadcastMessage], [sendBarrageMessage], [sendCustomCommand], etc.) cannot be received callback ((eg [onRoomStreamExtraInfoUpdate], [onIMRecvBroadcastMessage], [onIMRecvBarrageMessage], [onIMRecvCustomCommand], etc) in other rooms. Currently, SDK does not provide the ability to send messages across rooms. Developers can integrate the SDK of third-party IM to achieve.
     * SDK supports startPlayingStream audio and video streams from different rooms under the same appID, that is, startPlayingStream audio and video streams across rooms. Since ZegoExpressEngine's room related callback notifications are based on the same room, when developers want to startPlayingStream streams across rooms, developers need to maintain related messages and signaling notifications by themselves.
     * If the network is temporarily interrupted due to network quality reasons, the SDK will automatically reconnect internally. You can get the current connection status of the local room by listening to the [onRoomStateUpdate] callback method, and other users in the same room will receive [onRoomUserUpdate] callback notification.
     * It is strongly recommended that userID corresponds to the user ID of the business APP, that is, a userID and a real user are fixed and unique, and should not be passed to the SDK in a random userID. Because the unique and fixed userID allows ZEGO technicians to quickly locate online problems.
     * @param {string} roomID - Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     * @param {ZegoUser} user - User object instance, configure userID, userName. Note that the userID needs to be globally unique with the same appID, otherwise the user who logs in later will kick out the user who logged in first.
     * @param {ZegoRoomConfig} config - Advanced room configuration
     */
    loginRoom(roomID: string, user: ZegoUser, config?: ZegoRoomConfig): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().loginRoom(roomID, user, config);
    }

    /**
     * Logs out of a room.
     *
     * Exiting the room will stop all publishing and playing streams for user, and then SDK will auto stop local preview UI. After calling this interface, you will receive [onRoomStateUpdate] callback notification successfully exits the room, while other users in the same room will receive the [onRoomUserUpdate] callback notification(On the premise of enabling isUserStatusNotify configuration).
     * @param {string} roomID - Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     */
    logoutRoom(roomID: string): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().logoutRoom(roomID);
    }

    /**
     * Starts publishing a stream. You can call this API to publish a second stream.
     *
     * This interface allows users to publish their local audio and video streams to the ZEGO real-time audio and video cloud. Other users in the same room can use the streamID to play the audio and video streams for intercommunication.
     * Before you start to publish the stream, you need to join the room first by calling [loginRoom]. Other users in the same room can get the streamID by monitoring the [onRoomStreamUpdate] event callback after the local user publishing stream successfully.
     * In the case of poor network quality, user publish may be interrupted, and the SDK will attempt to reconnect. You can learn about the current state and error information of the stream published by monitoring the [onPublisherStateUpdate] event.
     * @param {string} streamID - Stream ID, a string of up to 256 characters, needs to be globally unique within the entire AppID. If in the same AppID, different users publish each stream and the stream ID is the same, which will cause the user to publish the stream failure. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    startPublishingStream(streamID: string, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startPublishingStream(streamID, channel);
    }

    /**
     * Stops publishing a stream (for the specified channel).
     *
     * This interface allows the user to stop sending local audio and video streams and end the call.
     * If the user has initiated publish flow, this interface must be called to stop the publish of the current stream before publishing the new stream (new streamID), otherwise the new stream publish will return a failure.
     * After stopping streaming, the developer should stop the local preview based on whether the business situation requires it.
     * Use this API to stop publishing stream of aux channel.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    stopPublishingStream(channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopPublishingStream(channel);
    }

    /**
     * Starts/Updates the local video preview.
     *
     * The user can see his own local image by calling this interface. The preview function does not require you to log in to the room or publish the stream first. But after exiting the room, SDK internally actively stops previewing by default.
     * Local view and preview modes can be updated by calling this interface again.
     * You can set the mirror mode of the preview by calling the [setVideoMirrorMode] interface. The default preview setting is image mirrored.
     * When this api is called, the audio and video engine module inside SDK will start really, and it will start to try to collect audio and video. In addition to calling this api normally to preview the local screen, developers can also pass [null] to the canvas parameter, in conjunction with ZegoExpressEngine's sound wave function, in order to achieve the purpose of detecting whether the audio equipment is working properly before logging in to the room.
     * @param {ZegoView} view - The view used to display the preview image.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    startPreview(view: ZegoView, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startPreview(view, channel);
    }

    /**
     * Stops the local video preview.
     *
     * This api can be called to stop previewing when there is no need to see the preview locally.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    stopPreview(channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopPreview(channel);
    }

    /**
     * Sets up the video configurations.
     *
     * This api can be used to set the video frame rate, bit rate, video capture resolution, and video encoding output resolution. If you do not call this api, the default resolution is 360p, the bit rate is 600 kbps, and the frame rate is 15 fps.
     * It is necessary to set the relevant video configuration before publishing the stream, and only support the modification of the encoding resolution and the bit rate after publishing the stream.
     * Developers should note that the wide and high resolution of the mobile end is opposite to the wide and high resolution of the PC. For example, in the case of 360p, the resolution of the mobile end is 360x640, and the resolution of the PC end is 640x360.
     * @param {(ZegoVideoConfigPreset|ZegoVideoConfig)} config - Video configuration, the SDK provides a common setting combination of resolution, frame rate and bit rate, they also can be customized.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    setVideoConfig(config: ZegoVideoConfig, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setVideoConfig(config, channel);
    }

    /**
     * Gets the current video configurations.
     *
     * This api can be used to get the specified publish channel's current video frame rate, bit rate, video capture resolution, and video encoding output resolution.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     * @return {ZegoVideoConfig} - Video configuration object
     */
    getVideoConfig(channel?:ZegoPublishChannel): Promise<ZegoVideoConfig> {
        return ZegoExpressEngineImpl.getInstance().getVideoConfig(channel);
    }

    /**
     * Sets the video mirroring mode.
     *
     * This interface can be called to set whether the local preview video and the published video have mirror mode enabled.
     * @param {ZegoVideoMirrorMode} mirrorMode - Mirror mode for previewing or publishing the stream
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    setVideoMirrorMode(mode: ZegoVideoMirrorMode, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setVideoMirrorMode(mode, channel);
    }

    /** Sets the video orientation.
     *
     * This interface sets the orientation of the video. After rotation, it will be automatically adjusted to adapt the encoded image resolution.
     *
     * @param orientation Video orientation
     * @param channel Publish stream channel
     */
     setAppOrientation(orientation: ZegoOrientation, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setAppOrientation(orientation, channel);
    }

    /**
     * Sets up the audio configurations.
     *
     * You can set the combined value of the audio codec, bit rate, and audio channel through this interface. If this interface is not called, the default is standard quality mode. Should be used before publishing.
     * If the preset value cannot meet the developer's scenario, the developer can set the parameters according to the business requirements.
     * @param {(ZegoAudioConfigPreset|ZegoAudioConfig)} config - Audio config
     */
    setAudioConfig(config: ZegoAudioConfig): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setAudioConfig(config);
    }

    /**
     * Gets the current audio configurations.
     *
     * You can get the current audio codec, bit rate, and audio channel through this interface.
     * @return {ZegoAudioConfig} - Audio config
     */
    getAudioConfig(): Promise<ZegoAudioConfig> {
        return ZegoExpressEngineImpl.getInstance().getAudioConfig();
    }
    
    /**
     * Stops or resumes sending the audio part of a stream.
     *
     * This interface can be called when publishing the stream to publish only the video stream without publishing the audio. The SDK still collects and processes the audio, but does not send the audio data to the network. It can be set before publishing.
     * If you stop sending audio streams, the remote user that play stream of local user publishing stream can receive `Mute` status change notification by monitoring [onRemoteMicStateUpdate] callbacks,
     * @param {boolean} mute - Whether to stop sending audio streams, true means that only the video stream is sent without sending the audio stream, and false means that the audio and video streams are sent simultaneously. The default is false.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    mutePublishStreamAudio(mute: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePublishStreamAudio(mute, channel);
    }

    /**
     * Stops or resumes sending the video part of a stream.
     *
     * When publishing the stream, this interface can be called to publish only the audio stream without publishing the video stream. The local camera can still work normally, and can normally capture, preview and process the video picture, but does not send the video data to the network. It can be set before publishing.
     * If you stop sending video streams locally, the remote user that play stream of local user publishing stream can receive `Mute` status change notification by monitoring [onRemoteCameraStateUpdate] callbacks,
     * @param {boolean} mute - Whether to stop sending video streams, true means that only the audio stream is sent without sending the video stream, and false means that the audio and video streams are sent at the same time. The default is false.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    mutePublishStreamVideo(mute: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePublishStreamVideo(mute, channel);
    }

    /**
     * Sets the audio recording volume for stream publishing.
     *
     * This interface is used to set the audio collection volume. The local user can control the volume of the audio stream sent to the far end. It can be set before publishing.
     * @param {number} volume - Volume percentage. The range is 0 to 100. Default value is 100.
     */
    setCaptureVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setCaptureVolume(volume);
    }

    /**
     * Enables or disables hardware encoding.
     *
     * Whether to use the hardware encoding function when publishing the stream, the GPU is used to encode the stream and to reduce the CPU usage. The setting can take effect before the stream published. If it is set after the stream published, the stream should be stopped first before it takes effect.
     * Because hard-coded support is not particularly good for a few models, SDK uses software encoding by default. If the developer finds that the device is hot when publishing a high-resolution audio and video stream during testing of some models, you can consider calling this interface to enable hard coding.
     * @param {boolean} enable - Whether to enable hardware encoding, true: enable hardware encoding, false: disable hardware encoding
     */
    enableHardwareEncoder(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableHardwareEncoder(enable);
    }

    /**
     * Starts playing a stream from ZEGO's streaming cloud or from third-party CDN.
     *
     * This interface allows users to play audio and video streams both from the ZEGO real-time audio and video cloud and from third-party cdn.
     * Before starting to play the stream, you need to join the room first, you can get the new streamID in the room by listening to the [onRoomStreamUpdate] event callback.
     * In the case of poor network quality, user play may be interrupted, the SDK will try to reconnect, and the current play status and error information can be obtained by listening to the [onPlayerStateUpdate] event.
     * Playing the stream ID that does not exist, the SDK continues to try to play after executing this interface. After the stream ID is successfully published, the audio and video stream can be actually played.
     * The developer can update the player canvas by calling this interface again (the streamID must be the same).
     * @param {string} streamID - Stream ID, a string of up to 256 characters. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
     * @param {ZegoView} view - The view used to display the preview image.
     * @param {ZegoPlayerConfig} config - Advanced player configuration
     */
    startPlayingStream(streamID: string, view: ZegoView, config?: ZegoPlayerConfig): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startPlayingStream(streamID, view, config);
    }

    /**
     * Stops playing a stream.
     *
     * This interface allows the user to stop playing the stream. When stopped, the attributes set for this stream previously, such as [setPlayVolume], [mutePlayStreamAudio], [mutePlayStreamVideo], etc., will be invalid and need to be reset when playing the the stream next time.
     * @param {string} streamID - Stream ID
     */
    stopPlayingStream(streamID: string): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopPlayingStream(streamID);
    }

    /**
     * Sets the stream playback volume.
     *
     * This interface is used to set the playback volume of the stream. Need to be called after calling startPlayingStream.
     * You need to reset after [stopPlayingStream] and [startPlayingStream].
     * @param {string} streamID - Stream ID
     * @param {number} volume - Volume percentage. The value ranges from 0 to 100, and the default value is 100.
     */
    setPlayVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setPlayVolume(volume);
    }

    /**
     * Stops or resumes playing the audio part of a stream.
     *
     * This api can be used to stop playing/retrieving the audio data of the stream. Need to be called after calling startPlayingStream.
     * This api is only effective for playing stream from ZEGO real-time audio and video cloud (not ZEGO CDN or third-party CDN).
     * @param {string} streamID - Stream ID
     * @param {boolean} mute - mute flag, true: mute play stream video, false: resume play stream video
     */
    mutePlayStreamAudio(streamID: string, mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePlayStreamAudio(streamID, mute);
    }

    /**
     * Stops or resumes playing the video part of a stream.
     *
     * This interface can be used to stop playing/retrieving the video data of the stream. Need to be called after calling startPlayingStream.
     * This api is only effective for playing stream from ZEGO real-time audio and video cloud (not ZEGO CDN or third-party CDN).
     * @param {string} streamID - Stream ID
     * @param {boolean} mute - mute flag, true: mute play stream video, false: resume play stream video
     */
    mutePlayStreamVideo(streamID: string, mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePlayStreamVideo(streamID, mute);
    }

    /**
     * Enables or disables hardware decoding.
     *
     * Turn on hardware decoding and use hardware to improve decoding efficiency. Need to be called before calling startPlayingStream.
     * Because hard-decoded support is not particularly good for a few models, SDK uses software decoding by default. If the developer finds that the device is hot when playing a high-resolution audio and video stream during testing of some models, you can consider calling this interface to enable hard decoding.
     * @param {boolean} enable - Whether to turn on hardware decoding switch, true: enable hardware decoding, false: disable hardware decoding. The default is false
     */
    enableHardwareDecoder(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableHardwareDecoder(enable);
    }

    /**
     * Mutes or unmutes the microphone.
     *
     * This api is used to control whether the collected audio data is used. When the microphone is muted (disabled), the data is collected and discarded, and the microphone is still occupied.
     * The microphone is still occupied because closing or opening the microphone on the hardware is a relatively heavy operation, and real users may have frequent operations. For trade-off reasons, this api simply discards the collected data.
     * If you really want SDK to give up occupy the microphone, you can call the [enableAudioCaptureDevice] interface.
     * Developers who want to control whether to use microphone on the UI should use this interface to avoid unnecessary performance overhead by using the [enableAudioCaptureDevice].
     * @param {boolean} mute - Whether to mute (disable) the microphone, true: mute (disable) microphone, false: enable microphone. The default is false.
     */
    muteMicrophone(mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().muteMicrophone(mute);
    }

    /**
     * Checks whether the microphone is muted.
     *
     * Can be used with [muteMicrophone], determine whether the microphone is muted.
     * @return {boolean} - Whether the microphone is muted; true: the microphone is muted; false: the microphone is enable (not muted)
     */
    isMicrophoneMuted(): Promise<boolean> {
        return ZegoExpressEngineImpl.getInstance().isMicrophoneMuted();
    }

    /**
     * Mutes or unmutes the audio output speaker.
     *
     * After mute speaker, all the SDK sounds will not play, including playing stream, mediaplayer, etc. But the SDK will still occupy the output device.
     * @param {boolean} mute - Whether to mute (disable) speaker audio output, true: mute (disable) speaker audio output, false: enable speaker audio output. The default value is false
     */
    muteSpeaker(mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().muteSpeaker(mute);
    }

    /**
     * Checks whether the audio output speaker is muted.
     *
     * Can be used with [muteSpeaker], determine whether the speaker audio output is muted.
     * @return {boolean} - Whether the speaker is muted; true: the speaker is muted; false: the speaker is enable (not muted)
     */
    isSpeakerMuted(): Promise<boolean> {
        return ZegoExpressEngineImpl.getInstance().isSpeakerMuted();
    }

    /**
     * Enables or disables the audio capture device.
     *
     * This api is used to control whether to release the audio collection device. When the audio collection device is turned off, the SDK will no longer occupy the audio device. Of course, if the stream is being published at this time, there is no audio data.
     * Occupying the audio capture device and giving up Occupying the audio device is a relatively heavy operation, and the [muteMicrophone] interface is generally recommended.
     * @param {boolean} enable - Whether to enable the audio capture device, true: disable audio capture device, false: enable audio capture device
     */
    enableAudioCaptureDevice(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableAudioCaptureDevice(enable);
    }

    /**
     * Turns on/off the camera (for the specified channel).
     *
     * This interface is used to control whether to start the camera acquisition. After the camera is turned off, video capture will not be performed. At this time, the publish stream will also have no video data.
     * In the case of using a custom video capture function, because the developer has taken over the video data capturing, the SDK is no longer responsible for the video data capturing, this api is no longer valid.
     * @param {boolean} enable - Whether to turn on the camera, true: turn on camera, false: turn off camera
     * @param {ZegoPublishChannel} channel - Publishing stream channel
     */
    enableCamera(enable: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableCamera(enable, channel);
    }

    /** 
     * Switches to the front or the rear camera.
     *
     * This interface is used to control the front or rear camera
     * In the case of using a custom video capture function, because the developer has taken over the video data capturing, the SDK is no longer responsible for the video data capturing, this api is no longer valid.
     *
     * @param enable Whether to use the front camera, true: use the front camera, false: use the the rear camera. The default value is true
     * @param channel Publishing stream channel
     */
     useFrontCamera(enable: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().useFrontCamera(enable, channel);
    }    

    /**
     * Starts sound level monitoring.
     *
     * After starting monitoring, you can receive local audio sound level via [onCapturedSoundLevelUpdate] callback, and receive remote audio sound level via [onRemoteSoundLevelUpdate] callback.
     * Before entering the room, you can call [startPreview] with this api and combine it with [onCapturedSoundLevelUpdate] callback to determine whether the audio device is working properly.
     * [onCapturedSoundLevelUpdate] and [onRemoteSoundLevelUpdate] callback notification period is 100 ms.
     */
    startSoundLevelMonitor(): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startSoundLevelMonitor();
    }

    /**
     * Stops sound level monitoring.
     *
     * After the monitoring is stopped, the callback of the local/remote audio sound level will be stopped.
     */
    stopSoundLevelMonitor(): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopSoundLevelMonitor();
    }

    /**
     * Enables or disables Acoustic Echo Cancellation (AEC).
     *
     * Turning on echo cancellation, the SDK filters the collected audio data to reduce the echo component in the audio. It needs to be set before starting the publish, and the setting is invalid after the start of the publish.
     * @param {boolean} enable - Whether to enable echo cancellation, true: enable echo cancellation, false: disable echo cancellation
     */
    enableAEC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableAEC(enable);
    }

    /** 
     * Whether to turn on Acoustic Echo Cancellation (AEC) when using the headphone.
     *
     * It needs to be invoked before [startPublishingStream], [startPlayingStream] or [startPreview] to take effect.
     *
     * @param enable Whether to enable, true: enable, false: disable
     */
    enableHeadphoneAEC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableHeadphoneAEC(enable);
    }

    /**
     * Sets the Acoustic Echo Cancellation (AEC) mode.
     *
     * Switch different echo cancellation modes to control the extent to which echo data is eliminated. Need to be set before starting the publish.
     * @param {ZegoAECMode} mode - Echo cancellation mode
     */
    setAECMode(mode: ZegoAECMode): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setAECMode(mode);
    }

    /**
     * Enables or disables Automatic Gain Control (AGC).
     *
     * When the auto gain is turned on, the sound will be amplified, but it will affect the sound quality to some extent. Need to be set before starting the publish.
     * @param {boolean} enable - Whether to enable automatic gain control, true: enable AGC, false: disable AGC
     */
    enableAGC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableAGC(enable);
    }

    /**
     * Enables or disables Automatic Noise Suppression (ANS).
     *
     * Turning on the noise suppression switch can reduce the noise in the audio data and make the human voice clearer. Need to be set before starting the publish.
     * @param {boolean} enable - Whether to enable noise suppression, true: enable AGC, false: disable AGC
     */
    enableANS(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableANS(enable);
    }

    /**
     * Sets the Automatic Noise Suppression (ANS) mode.
     *
     * Default is medium mode
     * @param {ZegoANSMode} mode - Audio Noise Suppression mode
     */
    setANSMode(mode: ZegoANSMode): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setANSMode(mode);
    }

    /** 
     * Enables or disables the beauty features (for the specified channel).
     *
     * The current beauty function is simple and may not meet the developer's expectations, it is recommended to use [enableCustomVideoCapture] function to connect to a third party professional beauty SDK to get the best results.
     * The [setBeautifyOption] API can be called to adjust the beauty parameters after the beauty function is enabled.
     * In the case of using a custom video capture function, because the developer has taken over the video data capturing, the SDK is no longer responsible for the video data capturing, this api is no longer valid.
     *
     * @param featureBitmask Beauty features, bitmask format, you can choose to enable several features in [ZegoBeautifyFeature] at the same time
     * @param channel Publishing stream channel
     */
    enableBeautify(feature: number, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableBeautify(feature, channel);
    }

    /**
     *  Sets up the beauty parameters (for the specified channel).
     *
     * Developer need to call [enableBeautify] API first to enable the beautify function before calling this API
     * In the case of using a custom video capture function, because the developer has taken over the video data capturing, the SDK is no longer responsible for the video data capturing, this api is no longer valid.
     *
     * @param option Beauty configuration options
     * @param channel Publishing stream channel
     */
    setBeautifyOption(option: ZegoBeautifyOption, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setBeautifyOption(option, channel);
    }

    /**
     * Creates a media player instance.
     *
     * Currently, a maximum of 4 instances can be created, after which it will return null. The more instances of a media player, the greater the performance overhead on the device.
     * @return {ZegoMediaPlayer} - Media player instance, null will be returned when the maximum number is exceeded.
     */
    createMediaPlayer(): Promise<ZegoMediaPlayer|null> {
        return ZegoExpressEngineImpl.getInstance().createMediaPlayer();
    }

    /**
     * Destroys a media player instance.
     *
     * @param {ZegoMediaPlayer} mediaPlayer - The media player instance object to be destroyed
     */
    destroyMediaPlayer(mediaPlayer: ZegoMediaPlayer): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().destroyMediaPlayer(mediaPlayer);
    }

}