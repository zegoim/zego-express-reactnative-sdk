package im.zego.reactnative;

import android.app.Application;
import android.view.View;
import android.view.TextureView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import androidx.annotation.Nullable;
import im.zego.zegoexpress.*;
import im.zego.zegoexpress.callback.IZegoDestroyCompletionCallback;
import im.zego.zegoexpress.callback.IZegoEventHandler;
import im.zego.zegoexpress.callback.IZegoMediaPlayerEventHandler;
import im.zego.zegoexpress.callback.IZegoMediaPlayerLoadResourceCallback;
import im.zego.zegoexpress.callback.IZegoMediaPlayerSeekToCallback;
import im.zego.zegoexpress.constants.ZegoAECMode;
import im.zego.zegoexpress.constants.ZegoANSMode;
import im.zego.zegoexpress.constants.ZegoAudioChannel;
import im.zego.zegoexpress.constants.ZegoAudioCodecID;
import im.zego.zegoexpress.constants.ZegoEngineState;
import im.zego.zegoexpress.constants.ZegoMediaPlayerNetworkEvent;
import im.zego.zegoexpress.constants.ZegoMediaPlayerState;
import im.zego.zegoexpress.constants.ZegoOrientation;
import im.zego.zegoexpress.constants.ZegoPlayerMediaEvent;
import im.zego.zegoexpress.constants.ZegoPlayerState;
import im.zego.zegoexpress.constants.ZegoPlayerVideoLayer;
import im.zego.zegoexpress.constants.ZegoPublishChannel;
import im.zego.zegoexpress.constants.ZegoPublisherState;
import im.zego.zegoexpress.constants.ZegoRemoteDeviceState;
import im.zego.zegoexpress.constants.ZegoRoomState;
import im.zego.zegoexpress.constants.ZegoScenario;
import im.zego.zegoexpress.constants.ZegoUpdateType;
import im.zego.zegoexpress.constants.ZegoVideoCodecID;
import im.zego.zegoexpress.constants.ZegoVideoMirrorMode;
import im.zego.zegoexpress.constants.ZegoViewMode;
import im.zego.zegoexpress.entity.ZegoAudioConfig;
import im.zego.zegoexpress.entity.ZegoBeautifyOption;
import im.zego.zegoexpress.entity.ZegoCDNConfig;
import im.zego.zegoexpress.entity.ZegoCanvas;
import im.zego.zegoexpress.entity.ZegoEngineConfig;
import im.zego.zegoexpress.entity.ZegoLogConfig;
import im.zego.zegoexpress.entity.ZegoPlayStreamQuality;
import im.zego.zegoexpress.entity.ZegoPlayerConfig;
import im.zego.zegoexpress.entity.ZegoPublishStreamQuality;
import im.zego.zegoexpress.entity.ZegoRoomConfig;
import im.zego.zegoexpress.entity.ZegoStream;
import im.zego.zegoexpress.entity.ZegoUser;
import im.zego.zegoexpress.entity.ZegoVideoConfig;

public class RCTZegoExpressNativeModule extends ReactContextBaseJavaModule {

    private static final String Prefix = "im.zego.reactnative.";

    private final ReactApplicationContext reactContext;
    private boolean mIsInited = false;

    private HashMap<Integer, ZegoMediaPlayer> mediaPlayerMap;

    public RCTZegoExpressNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RCTZegoExpressNativeModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("prefix", Prefix);
        return constants;
    }

    private void sendEvent(String eventName,
                           @Nullable WritableMap params) {
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(Prefix + eventName, params);
    }

    private WritableMap getCallbackArgs(Object ...objects) {
        WritableMap map = Arguments.createMap();
        WritableArray data = Arguments.createArray();
        for(Object obj : objects) {
            if(obj instanceof Integer) {
                data.pushInt((Integer) obj);
            } else if(obj instanceof Long) {
                data.pushInt(((Long) obj).intValue());
            } else if(obj instanceof String) {
                data.pushString((String) obj);
            } else if(obj instanceof Double) {
                data.pushDouble((Double)obj);
            } else if(obj instanceof Float) {
                data.pushDouble((Float)obj);
            } else if(obj instanceof Boolean) {
                data.pushBoolean((Boolean)obj);
            } else if(obj instanceof ReadableArray) {
                data.pushArray((ReadableArray) obj);
            } else if(obj instanceof ReadableMap) {
                data.pushMap((ReadableMap)obj);
            }
        }
        /*if(data.size() == 0) {
            data.pushNull();
        }*/
        map.putArray("data", data);

        return map;
    }

    private WritableMap getMediaPlayerCallbackArgs(int index, Object ...objects) {
        WritableMap map = Arguments.createMap();
        WritableArray data = Arguments.createArray();
        for(Object obj : objects) {
            if(obj instanceof Integer) {
                data.pushInt((Integer) obj);
            } else if(obj instanceof Long) {
                data.pushInt(((Long) obj).intValue());
            } else if(obj instanceof String) {
                data.pushString((String) obj);
            } else if(obj instanceof Double) {
                data.pushDouble((Double)obj);
            } else if(obj instanceof Float) {
                data.pushDouble((Float)obj);
            } else if(obj instanceof Boolean) {
                data.pushBoolean((Boolean)obj);
            } else if(obj instanceof ReadableArray) {
                data.pushArray((ReadableArray) obj);
            } else if(obj instanceof ReadableMap) {
                data.pushMap((ReadableMap)obj);
            }
        }
        /*if(data.size() == 0) {
            data.pushNull();
        }*/
        map.putArray("data", data);
        map.putInt("idx", index);
        return map;
    }

    @ReactMethod
    public void getVersion(Promise promise) {
        promise.resolve(ZegoExpressEngine.getVersion());
    }

    @ReactMethod
    public void createEngine(Integer appID, String appSign, boolean isTestEnv, int scenario, Promise promise) {
        ZegoExpressEngine.createEngine(appID.longValue(), appSign, isTestEnv, ZegoScenario.getZegoScenario(scenario), (Application) this.reactContext.getApplicationContext(), new IZegoEventHandler() {
            @Override
            public void onDebugError(int errorCode, String funcName, String info) {
                super.onDebugError(errorCode, funcName, info);

                WritableMap args = getCallbackArgs(errorCode, funcName, info);
                sendEvent("debugError", args);
            }

            @Override
            public void onRoomStateUpdate(String roomID, ZegoRoomState state, int errorCode, JSONObject extendedData) {
                super.onRoomStateUpdate(roomID, state, errorCode, extendedData);

                WritableMap args = getCallbackArgs(roomID, state.value(), errorCode, extendedData.toString());
                sendEvent("roomStateUpdate", args);
            }

            @Override
            public void onRoomUserUpdate(String roomID, ZegoUpdateType updateType, ArrayList<ZegoUser> userList) {
                super.onRoomUserUpdate(roomID, updateType, userList);

                WritableArray userListArray = Arguments.createArray();
                for (ZegoUser user : userList) {
                    WritableMap userMap = Arguments.createMap();
                    userMap.putString("userID", user.userID);
                    userMap.putString("userName", user.userName);
                    userListArray.pushMap(userMap);
                }
                WritableMap args = getCallbackArgs(roomID, updateType.value(), userListArray);
                sendEvent("roomUserUpdate", args);
            }

            @Override
            public void onRoomOnlineUserCountUpdate(String roomID, int count) {
                super.onRoomOnlineUserCountUpdate(roomID, count);

                WritableMap args = getCallbackArgs(roomID, count);
                sendEvent("roomOnlineUserCountUpdate", args);
            }

            @Override
            public void onRoomStreamUpdate(String roomID, ZegoUpdateType updateType, ArrayList<ZegoStream> streamList) {
                super.onRoomStreamUpdate(roomID, updateType, streamList);

                WritableArray streamListArray = Arguments.createArray();
                for(ZegoStream stream : streamList) {
                    WritableMap streamMap = Arguments.createMap();
                    streamMap.putString("streamID", stream.streamID);
                    streamMap.putString("extraInfo", stream.extraInfo);

                    WritableMap userMap = Arguments.createMap();
                    userMap.putString("userID", stream.user.userID);
                    userMap.putString("userName", stream.user.userName);

                    streamMap.putMap("user", userMap);

                    streamListArray.pushMap(streamMap);
                }
                WritableMap args = getCallbackArgs(roomID, updateType.value(), streamListArray);
                sendEvent("roomStreamUpdate", args);
            }

            @Override
            public void onPublisherStateUpdate(String streamID, ZegoPublisherState state, int errorCode, JSONObject extendedData) {
                super.onPublisherStateUpdate(streamID, state, errorCode, extendedData);

                WritableMap args = getCallbackArgs(streamID, state.value(), errorCode, extendedData.toString());
                sendEvent("publisherStateUpdate", args);
            }

            @Override
            public void onPublisherQualityUpdate(String streamID, ZegoPublishStreamQuality quality) {
                super.onPublisherQualityUpdate(streamID, quality);

                WritableMap qualityMap = Arguments.createMap();
                qualityMap.putDouble("videoCaptureFPS", quality.videoCaptureFPS);
                qualityMap.putDouble("videoEncodeFPS", quality.videoEncodeFPS);
                qualityMap.putDouble("videoSendFPS", quality.videoSendFPS);
                qualityMap.putDouble("videoKBPS", quality.videoKBPS);
                qualityMap.putDouble("audioCaptureFPS", quality.audioCaptureFPS);
                qualityMap.putDouble("audioSendFPS", quality.audioSendFPS);
                qualityMap.putDouble("audioKBPS", quality.audioKBPS);
                qualityMap.putInt("rtt", quality.rtt);
                qualityMap.putDouble("packetLostRate", quality.packetLostRate);
                qualityMap.putInt("level", quality.level.value());
                qualityMap.putBoolean("isHardwareEncode", quality.isHardwareEncode);
                qualityMap.putDouble("totalSendBytes", quality.totalSendBytes);
                qualityMap.putDouble("audioSendBytes", quality.audioSendBytes);
                qualityMap.putDouble("videoSendBytes", quality.videoSendBytes);

                WritableMap args = getCallbackArgs(streamID, qualityMap);
                sendEvent("publisherQualityUpdate", args);
            }

            @Override
            public void onPublisherCapturedAudioFirstFrame() {
                super.onPublisherCapturedAudioFirstFrame();

                WritableMap args = getCallbackArgs();
                sendEvent("publisherCapturedAudioFirstFrame", args);
            }

            @Override
            public void onPublisherCapturedVideoFirstFrame(ZegoPublishChannel channel) {
                super.onPublisherCapturedVideoFirstFrame(channel);

                WritableMap args = getCallbackArgs(channel.value());
                sendEvent("publisherCapturedVideoFirstFrame", args);
            }

            @Override
            public void onPublisherVideoSizeChanged(int width, int height, ZegoPublishChannel channel) {
                super.onPublisherVideoSizeChanged(width, height, channel);

                WritableMap args = getCallbackArgs(width, height, channel.value());
                sendEvent("publisherVideoSizeChanged", args);
            }

            @Override
            public void onPlayerStateUpdate(String streamID, ZegoPlayerState state, int errorCode, JSONObject extendedData) {
                super.onPlayerStateUpdate(streamID, state, errorCode, extendedData);

                WritableMap args = getCallbackArgs(streamID, state.value(), errorCode, extendedData.toString());
                sendEvent("playerStateUpdate", args);
            }

            @Override
            public void onPlayerQualityUpdate(String streamID, ZegoPlayStreamQuality quality) {
                super.onPlayerQualityUpdate(streamID, quality);

                WritableMap qualityMap = Arguments.createMap();
                qualityMap.putDouble("videoRecvFPS", quality.videoRecvFPS);
                qualityMap.putDouble("videoDecodeFPS", quality.videoDecodeFPS);
                qualityMap.putDouble("videoRenderFPS", quality.videoRenderFPS);
                qualityMap.putDouble("videoKBPS", quality.videoKBPS);
                qualityMap.putDouble("audioRecvFPS", quality.audioRecvFPS);
                qualityMap.putDouble("audioDecodeFPS", quality.audioDecodeFPS);
                qualityMap.putDouble("audioRenderFPS", quality.audioRenderFPS);
                qualityMap.putDouble("audioKBPS", quality.audioKBPS);
                qualityMap.putInt("rtt", quality.rtt);
                qualityMap.putDouble("packetLostRate", quality.packetLostRate);
                qualityMap.putDouble("peerToPeerPacketLostRate", quality.peerToPeerPacketLostRate);
                qualityMap.putDouble("peerToPeerDelay", quality.peerToPeerDelay);
                qualityMap.putInt("level", quality.level.value());
                qualityMap.putInt("delay", quality.delay);
                qualityMap.putBoolean("isHardwareDecode", quality.isHardwareDecode);
                qualityMap.putDouble("totalRecvBytes", quality.totalRecvBytes);
                qualityMap.putDouble("audioRecvBytes", quality.audioRecvBytes);
                qualityMap.putDouble("videoRecvBytes", quality.videoRecvBytes);

                WritableMap args = getCallbackArgs(streamID, qualityMap);
                sendEvent("playerQualityUpdate", args);
            }

            @Override
            public void onPlayerMediaEvent(String streamID, ZegoPlayerMediaEvent event) {
                super.onPlayerMediaEvent(streamID, event);

                WritableMap args = getCallbackArgs(streamID, event);
                sendEvent("playerMediaEvent", args);
            }

            @Override
            public void onPlayerRecvAudioFirstFrame(String streamID) {
                super.onPlayerRecvAudioFirstFrame(streamID);

                WritableMap args = getCallbackArgs(streamID);
                sendEvent("playerRecvAudioFirstFrame", args);
            }

            @Override
            public void onPlayerRecvVideoFirstFrame(String streamID) {
                super.onPlayerRecvVideoFirstFrame(streamID);

                WritableMap args = getCallbackArgs(streamID);
                sendEvent("playerRecvVideoFirstFrame", args);
            }

            @Override
            public void onPlayerRenderVideoFirstFrame(String streamID) {
                super.onPlayerRenderVideoFirstFrame(streamID);

                WritableMap args = getCallbackArgs(streamID);
                sendEvent("playerRenderVideoFirstFrame", args);
            }

            @Override
            public void onPlayerVideoSizeChanged(String streamID, int width, int height) {
                super.onPlayerVideoSizeChanged(streamID, width, height);

                WritableMap args = getCallbackArgs(streamID, width, height);
                sendEvent("playerVideoSizeChanged", args);
            }

            @Override
            public void onCapturedSoundLevelUpdate(float soundLevel) {
                super.onCapturedSoundLevelUpdate(soundLevel);

                WritableMap args = getCallbackArgs(soundLevel);
                sendEvent("capturedSoundLevelUpdate", args);
            }

            @Override
            public void onRemoteSoundLevelUpdate(HashMap<String, Float> soundLevels) {
                super.onRemoteSoundLevelUpdate(soundLevels);

                WritableMap soundLevelsMap = Arguments.createMap();
                for(Map.Entry<String, Float> entry: soundLevels.entrySet()) {
                    soundLevelsMap.putDouble(entry.getKey(), entry.getValue());
                }
                WritableMap args = getCallbackArgs(soundLevelsMap);
                sendEvent("remoteSoundLevelUpdate", args);
            }

            @Override
            public void onDeviceError(int errorCode, String deviceName) {
                super.onDeviceError(errorCode, deviceName);

                WritableMap args = getCallbackArgs(errorCode, deviceName);
                sendEvent("deviceError", args);
            }

            @Override
            public void onRemoteCameraStateUpdate(String streamID, ZegoRemoteDeviceState state) {
                super.onRemoteCameraStateUpdate(streamID, state);

                WritableMap args = getCallbackArgs(streamID, state.value());
                sendEvent("remoteCameraStateUpdate", args);
            }

            @Override
            public void onRemoteMicStateUpdate(String streamID, ZegoRemoteDeviceState state) {
                super.onRemoteMicStateUpdate(streamID, state);

                WritableMap args = getCallbackArgs(streamID, state.value());
                sendEvent("remoteMicStateUpdate", args);
            }
        });
        mIsInited = true;

        promise.resolve(null);
    }

    @ReactMethod
    public void destroyEngine(final Promise promise) {
        if(mIsInited) {
            ZegoExpressEngine.destroyEngine(new IZegoDestroyCompletionCallback() {
                @Override
                public void onDestroyCompletion() {
                    mIsInited = false;
                    promise.resolve(null);
                }
            });
        } else {
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void setEngineConfig(ReadableMap config, Promise promise) {
        ZegoEngineConfig configObj = new ZegoEngineConfig();
        ReadableMap logConfig = config.getMap("logConfig");
        if(logConfig != null) {
            ZegoLogConfig logConfigObj = new ZegoLogConfig();
            String logPath = logConfig.getString("logPath");
            if(logPath != null) {
                logConfigObj.logPath = logPath;
            }

            logConfigObj.logSize = logConfig.getInt("logSize");
            configObj.logConfig = logConfigObj;
        }

        ReadableMap advancedConfig = config.getMap("advancedConfig");
        if(advancedConfig != null) {
            HashMap<String, Object> adMap = advancedConfig.toHashMap();
            for(Map.Entry<String, Object> entry: adMap.entrySet()) {
                configObj.advancedConfig.put(entry.getKey(), entry.getValue().toString());
            }
        }

        ZegoExpressEngine.setEngineConfig(configObj);

        promise.resolve(null);
    }

    @ReactMethod
    public void uploadLog(Promise promise) {
        ZegoExpressEngine.getEngine().uploadLog();

        promise.resolve(null);
    }

    @ReactMethod
    public void loginRoom(String roomID, ReadableMap user, ReadableMap config, Promise promise) {
        ZegoUser userObj = new ZegoUser(user.getString("userID"), user.getString("userName"));

        if(config != null) {
            ZegoRoomConfig roomConfigObj = new ZegoRoomConfig();
            roomConfigObj.isUserStatusNotify = config.getBoolean("isUserStatusNotify");
            roomConfigObj.maxMemberCount = config.getInt("maxMemberCount");
            roomConfigObj.token = config.getString("token");

            ZegoExpressEngine.getEngine().loginRoom(roomID, userObj, roomConfigObj);
        } else {
            ZegoExpressEngine.getEngine().loginRoom(roomID, userObj);
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void logoutRoom(String roomID, Promise promise) {
        ZegoExpressEngine.getEngine().logoutRoom(roomID);

        promise.resolve(null);
    }

    @ReactMethod
    public void startPublishingStream(String streamID, int channel, Promise promise) {
        ZegoExpressEngine.getEngine().startPublishingStream(streamID, ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void stopPublishingStream(int channel, Promise promise) {
        ZegoExpressEngine.getEngine().stopPublishingStream(ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void startPreview(final ReadableMap view, final int channel, final Promise promise) {
        final int viewTag = view.getInt("reactTag");
        UIManagerModule uiMgr = this.reactContext.getNativeModule(UIManagerModule.class);
        uiMgr.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                View nativeView = nativeViewHierarchyManager.resolveView(viewTag);
                ZegoCanvas canvas = null;
                if(nativeView instanceof ZegoSurfaceView) {
                    ZegoSurfaceView sv = (ZegoSurfaceView)nativeView;
                    canvas = new ZegoCanvas(sv.getView());
                } else if(nativeView instanceof TextureView) {
                    canvas = new ZegoCanvas(nativeView);
                }
                
                canvas.viewMode = ZegoViewMode.getZegoViewMode(view.getInt("viewMode"));
                canvas.backgroundColor = view.getInt("backgroundColor");

                ZegoExpressEngine.getEngine().startPreview(canvas, ZegoPublishChannel.getZegoPublishChannel(channel));

                promise.resolve(null);
            }
        });
    }

    @ReactMethod
    public void stopPreview(int channel, Promise promise) {
        ZegoExpressEngine.getEngine().stopPreview(ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void setVideoConfig(ReadableMap config, int channel, Promise promise) {
        ZegoVideoConfig configObj = new ZegoVideoConfig();
        configObj.captureWidth = config.getInt("captureWidth");
        configObj.captureHeight = config.getInt("captureHeight");
        configObj.encodeWidth = config.getInt("encodeWidth");
        configObj.encodeHeight = config.getInt("encodeHeight");
        configObj.bitrate = config.getInt("bitrate");
        configObj.fps = config.getInt("fps");
        configObj.codecID = ZegoVideoCodecID.getZegoVideoCodecID(config.getInt("codecID"));

        ZegoExpressEngine.getEngine().setVideoConfig(configObj, ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void getVideoConfig(int channel, Promise promise) {
        ZegoVideoConfig config = ZegoExpressEngine.getEngine().getVideoConfig(ZegoPublishChannel.getZegoPublishChannel(channel));

        WritableMap map = Arguments.createMap();
        map.putInt("captureWidth", config.captureWidth);
        map.putInt("captureHeight", config.captureHeight);
        map.putInt("encodeWidth", config.encodeWidth);
        map.putInt("encodeHeight", config.encodeHeight);
        map.putInt("bitrate", config.bitrate);
        map.putInt("fps", config.fps);
        map.putInt("codecID", config.codecID.value());

        promise.resolve(map);
    }

    @ReactMethod
    public void setVideoMirrorMode(int mode, int channel, Promise promise) {
        ZegoExpressEngine.getEngine().setVideoMirrorMode(ZegoVideoMirrorMode.getZegoVideoMirrorMode(mode), ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void setAppOrientation(int orientation, int channel, Promise promise) {
        ZegoExpressEngine.getEngine().setAppOrientation(ZegoOrientation.getZegoOrientation(orientation), ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void setAudioConfig(ReadableMap config, Promise promise) {
        ZegoAudioConfig configObj = new ZegoAudioConfig();
        configObj.bitrate = config.getInt("bitrate");
        configObj.channel = ZegoAudioChannel.getZegoAudioChannel(config.getInt("channel"));
        configObj.codecID = ZegoAudioCodecID.getZegoAudioCodecID(config.getInt("codecID"));

        ZegoExpressEngine.getEngine().setAudioConfig(configObj);

        promise.resolve(null);
    }

    @ReactMethod
    public void getAudioConfig(Promise promise) {
        ZegoAudioConfig config = ZegoExpressEngine.getEngine().getAudioConfig();

        WritableMap map = Arguments.createMap();
        map.putInt("bitrate", config.bitrate);
        map.putInt("channel", config.channel.value());
        map.putInt("codecID", config.codecID.value());

        promise.resolve(map);
    }

    @ReactMethod
    public void mutePublishStreamAudio(boolean mute, int channel, Promise promise) {
        ZegoExpressEngine.getEngine().mutePublishStreamAudio(mute, ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void mutePublishStreamVideo(boolean mute, int channel, Promise promise) {
        ZegoExpressEngine.getEngine().mutePublishStreamVideo(mute, ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void setCaptureVolume(int volume, Promise promise) {
        ZegoExpressEngine.getEngine().setCaptureVolume(volume);

        promise.resolve(null);
    }

    @ReactMethod
    public void enableHardwareEncoder(boolean enable, Promise promise) {
        ZegoExpressEngine.getEngine().enableHardwareEncoder(enable);

        promise.resolve(null);
    }

    @ReactMethod
    public void startPlayingStream(final String streamID, final ReadableMap view, final ReadableMap config, final Promise promise) {
        final int viewTag = view.getInt("reactTag");
        UIManagerModule uiMgr = this.reactContext.getNativeModule(UIManagerModule.class);
        uiMgr.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                View nativeView = nativeViewHierarchyManager.resolveView(viewTag);
                ZegoCanvas canvas = null;
                if(nativeView instanceof ZegoSurfaceView) {
                    ZegoSurfaceView sv = (ZegoSurfaceView)nativeView;
                    canvas = new ZegoCanvas(sv.getView());
                } else if(nativeView instanceof TextureView) {
                    canvas = new ZegoCanvas(nativeView);
                }
                canvas.viewMode = ZegoViewMode.getZegoViewMode(view.getInt("viewMode"));
                canvas.backgroundColor = view.getInt("backgroundColor");

                if(config != null) {
                    ZegoPlayerConfig configObj = new ZegoPlayerConfig();
                    ReadableMap cdnConfig = config.getMap("cdnConfig");
                    ZegoCDNConfig cdnConfigObj = null;
                    if(cdnConfig != null) {
                        cdnConfigObj = new ZegoCDNConfig();
                        cdnConfigObj.url = cdnConfig.getString("url");
                        cdnConfigObj.authParam = cdnConfig.getString("authParam");
                    }
                    configObj.cdnConfig = cdnConfigObj;
                    configObj.videoLayer = ZegoPlayerVideoLayer.getZegoPlayerVideoLayer(config.getInt("videoLayer"));

                    ZegoExpressEngine.getEngine().startPlayingStream(streamID, canvas, configObj);
                } else {
                    ZegoExpressEngine.getEngine().startPlayingStream(streamID, canvas);
                }

                promise.resolve(null);
            }
        });
    }

    @ReactMethod
    public void stopPlayingStream(String streamID, Promise promise) {
        ZegoExpressEngine.getEngine().stopPlayingStream(streamID);

        promise.resolve(null);
    }

    @ReactMethod
    public void setPlayVolume(String streamID, int volume, Promise promise) {
        ZegoExpressEngine.getEngine().setPlayVolume(streamID, volume);

        promise.resolve(null);
    }

    @ReactMethod
    public void mutePlayStreamAudio(String streamID, boolean mute, Promise promise) {
        ZegoExpressEngine.getEngine().mutePlayStreamAudio(streamID, mute);

        promise.resolve(null);
    }

    @ReactMethod
    public void mutePlayStreamVideo(String streamID, boolean mute, Promise promise) {
        ZegoExpressEngine.getEngine().mutePlayStreamVideo(streamID, mute);

        promise.resolve(null);
    }

    @ReactMethod
    public void enableHardwareDecoder(boolean enable, Promise promise) {
        ZegoExpressEngine.getEngine().enableHardwareDecoder(enable);

        promise.resolve(null);
    }

    @ReactMethod
    public void muteMicrophone(boolean mute, Promise promise) {
        ZegoExpressEngine.getEngine().muteMicrophone(mute);

        promise.resolve(null);
    }

    @ReactMethod
    public void isMicrophoneMuted(Promise promise) {
        promise.resolve(ZegoExpressEngine.getEngine().isMicrophoneMuted());
    }

    @ReactMethod
    public void muteSpeaker(boolean mute, Promise promise) {
        ZegoExpressEngine.getEngine().muteSpeaker(mute);

        promise.resolve(null);
    }

    @ReactMethod
    public void isSpeakerMuted(Promise promise) {
        promise.resolve(ZegoExpressEngine.getEngine().isSpeakerMuted());
    }

    @ReactMethod
    public void enableAudioCaptureDevice(boolean enable, Promise promise) {
        ZegoExpressEngine.getEngine().enableAudioCaptureDevice(enable);

        promise.resolve(null);
    }

    @ReactMethod
    public void enableCamera(boolean enable, int channel, Promise promise) {
        ZegoExpressEngine.getEngine().enableCamera(enable, ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void useFrontCamera(boolean enable, int channel, Promise promise) {
        ZegoExpressEngine.getEngine().useFrontCamera(enable, ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void startSoundLevelMonitor(Promise promise) {
        ZegoExpressEngine.getEngine().startSoundLevelMonitor();

        promise.resolve(null);
    }

    @ReactMethod
    public void stopSoundLevelMonitor(Promise promise) {
        ZegoExpressEngine.getEngine().stopSoundLevelMonitor();

        promise.resolve(null);
    }

    @ReactMethod
    public void enableAEC(boolean enable, Promise promise) {
        ZegoExpressEngine.getEngine().enableAEC(enable);

        promise.resolve(null);
    }

    @ReactMethod
    public void enableHeadphoneAEC(boolean enable, Promise promise) {
        ZegoExpressEngine.getEngine().enableHeadphoneAEC(enable);

        promise.resolve(null);
    }

    @ReactMethod
    public void setAECMode(int mode, Promise promise) {
        ZegoExpressEngine.getEngine().setAECMode(ZegoAECMode.getZegoAECMode(mode));

        promise.resolve(null);
    }

    @ReactMethod
    public void enableAGC(boolean enable, Promise promise) {
        ZegoExpressEngine.getEngine().enableAGC(enable);

        promise.resolve(null);
    }

    @ReactMethod
    public void enableANS(boolean enable, Promise promise) {
        ZegoExpressEngine.getEngine().enableANS(enable);

        promise.resolve(null);
    }

    @ReactMethod
    public void setANSMode(int mode, Promise promise) {
        ZegoExpressEngine.getEngine().setANSMode(ZegoANSMode.getZegoANSMode(mode));

        promise.resolve(null);
    }

    @ReactMethod
    public void enableBeautify(int feature, int channel, Promise promise) {
        ZegoExpressEngine.getEngine().enableBeautify(feature, ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void setBeautifyOption(ReadableMap option, int channel, Promise promise) {
        ZegoBeautifyOption optionObj = new ZegoBeautifyOption();
        optionObj.polishStep = option.getDouble("polishStep");
        optionObj.whitenFactor = option.getDouble("whitenFactor");
        optionObj.sharpenFactor = option.getDouble("sharpenFactor");

        ZegoExpressEngine.getEngine().setBeautifyOption(optionObj, ZegoPublishChannel.getZegoPublishChannel(channel));

        promise.resolve(null);
    }

    @ReactMethod
    public void createMediaPlayer(Promise promise) {
        if(this.mediaPlayerMap == null) {
            this.mediaPlayerMap = new HashMap<>();
        }

        ZegoMediaPlayer mediaPlayer = ZegoExpressEngine.getEngine().createMediaPlayer();

        if(mediaPlayer != null) {
            int index = mediaPlayer.getIndex();

            mediaPlayer.setEventHandler(new IZegoMediaPlayerEventHandler() {
                @Override
                public void onMediaPlayerStateUpdate(ZegoMediaPlayer mediaPlayer, ZegoMediaPlayerState state, int errorCode) {
                    super.onMediaPlayerStateUpdate(mediaPlayer, state, errorCode);

                    WritableMap args = getMediaPlayerCallbackArgs(mediaPlayer.getIndex(), state.value(), errorCode);
                    sendEvent("mediaPlayerStateUpdate", args);
                }

                @Override
                public void onMediaPlayerNetworkEvent(ZegoMediaPlayer mediaPlayer, ZegoMediaPlayerNetworkEvent networkEvent) {
                    super.onMediaPlayerNetworkEvent(mediaPlayer, networkEvent);

                    WritableMap args = getMediaPlayerCallbackArgs(mediaPlayer.getIndex(), networkEvent.value());
                    sendEvent("mediaPlayerNetworkEvent", args);
                }

                @Override
                public void onMediaPlayerPlayingProgress(ZegoMediaPlayer mediaPlayer, long millisecond) {
                    super.onMediaPlayerPlayingProgress(mediaPlayer, millisecond);

                    WritableMap args = getMediaPlayerCallbackArgs(mediaPlayer.getIndex(), millisecond);
                    sendEvent("mediaPlayerPlayingProgress", args);
                }
            });
            this.mediaPlayerMap.put(index, mediaPlayer);

            promise.resolve(index);
        } else {
            promise.resolve(-1);
        }
    }

    @ReactMethod
    public void destroyMediaPlayer(int index, Promise promise) {
        if(this.mediaPlayerMap != null) {
            ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);

            if(mediaPlayer != null) {
                ZegoExpressEngine.getEngine().destroyMediaPlayer(mediaPlayer);
            }
            this.mediaPlayerMap.remove(index);
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerSetPlayerCanvas(final int index, final ReadableMap view, final Promise promise) {
        final int viewTag = view.getInt("reactTag");
        UIManagerModule uiMgr = this.reactContext.getNativeModule(UIManagerModule.class);
        uiMgr.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                View nativeView = nativeViewHierarchyManager.resolveView(viewTag);
                ZegoCanvas canvas = null;
                if(nativeView instanceof ZegoSurfaceView) {
                    ZegoSurfaceView sv = (ZegoSurfaceView)nativeView;
                    canvas = new ZegoCanvas(sv.getView());
                } else if(nativeView instanceof TextureView) {
                    canvas = new ZegoCanvas(nativeView);
                }
                canvas.viewMode = ZegoViewMode.getZegoViewMode(view.getInt("viewMode"));
                canvas.backgroundColor = view.getInt("backgroundColor");

                ZegoMediaPlayer mediaPlayer = mediaPlayerMap.get(index);
                if(mediaPlayer != null) {
                    mediaPlayer.setPlayerCanvas(canvas);
                }

                promise.resolve(null);
            }
        });
    }

    @ReactMethod
    public void mediaPlayerLoadResource(int index, String path, final Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.loadResource(path, new IZegoMediaPlayerLoadResourceCallback() {
                @Override
                public void onLoadResourceCallback(int errorCode) {
                    WritableMap map = Arguments.createMap();
                    map.putInt("errorCode", errorCode);
                    promise.resolve(map);
                }
            });
        }
    }

    @ReactMethod
    public void mediaPlayerStart(int index, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.start();
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerStop(int index, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.stop();
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerPause(int index, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.pause();
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerResume(int index, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.resume();
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerSeekTo(int index, long millisecond, final Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.seekTo(millisecond, new IZegoMediaPlayerSeekToCallback() {
                @Override
                public void onSeekToTimeCallback(int errorCode) {
                    WritableMap map = Arguments.createMap();
                    map.putInt("errorCode", errorCode);
                    promise.resolve(map);
                }
            });
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerEnableRepeat(int index, boolean enable, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.enableRepeat(enable);
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerEnableAux(int index, boolean enable, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.enableAux(enable);
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerMuteLocal(int index, boolean mute, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.muteLocal(mute);
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerSetVolume(int index, int volume, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.setVolume(volume);
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerSetProgressInterval(int index, long millisecond, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            mediaPlayer.setProgressInterval(millisecond);
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void mediaPlayerGetVolume(int index, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            promise.resolve(mediaPlayer.getVolume());
        } else {
            promise.resolve(0);
        }
    }

    @ReactMethod
    public void mediaPlayerGetTotalDuration(int index, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            promise.resolve(mediaPlayer.getTotalDuration());
        } else {
            promise.resolve(0);
        }
    }

    @ReactMethod
    public void mediaPlayerGetCurrentProgress(int index, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            promise.resolve(mediaPlayer.getCurrentProgress());
        } else {
            promise.resolve(0);
        }
    }

    @ReactMethod
    public void mediaPlayerGetCurrentState(int index, Promise promise) {
        ZegoMediaPlayer mediaPlayer = this.mediaPlayerMap.get(index);
        if(mediaPlayer != null) {
            promise.resolve(mediaPlayer.getCurrentState());
        } else {
            promise.resolve(0);
        }
    }
}
