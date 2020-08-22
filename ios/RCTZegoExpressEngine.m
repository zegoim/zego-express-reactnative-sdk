#import "RCTZegoExpressEngine.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import <React/RCTConvert.h>
#import "ZegoLog.h"

@interface RCTZegoExpressNativeModule()<ZegoEventHandler>

@property (nonatomic, assign) BOOL isInited;
@property (nonatomic, assign) BOOL hasListeners;

@end

@implementation RCTZegoExpressNativeModule

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;  // only do this if your module initialization relies on calling UIKit!
}

-(void)startObserving {
    // Set up any upstream listeners or background tasks as necessary
    self.hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    // Remove upstream listeners, stop unnecessary background tasks
    self.hasListeners = NO;
}

RCT_EXPORT_METHOD(getVersion:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([ZegoExpressEngine getVersion]);
}

RCT_EXPORT_METHOD(createEngine:(NSUInteger)appID
                  appSign:(NSString *)appSign
                  isTestEnv:(BOOL)isTestEnv
                  scenario:(int)scenario
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"createEngine: app id: %lu, app sign: %@, test: %d, scenario: %d", (unsigned long)appID, appSign, isTestEnv, scenario);
    [ZegoExpressEngine createEngineWithAppID:(unsigned int)appID appSign:appSign isTestEnv:isTestEnv scenario:(ZegoScenario)scenario eventHandler:self];
    self.isInited = YES;
    resolve(nil);
}

RCT_EXPORT_METHOD(destroyEngine:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"destroyEngine");
    
    if(self.isInited) {
        [ZegoExpressEngine destroyEngine:^{
            resolve(nil);
        }];
    } else {
        resolve(nil);
    }
}

RCT_EXPORT_METHOD(setEngineConfig:(NSDictionary *)config
                  resover:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"setEngineConfig: %@", config);
    
    ZegoEngineConfig *engineConfig = [[ZegoEngineConfig alloc] init];
    
    NSDictionary *logConfig = [RCTConvert NSDictionary:config[@"logConfig"]];
    if(logConfig) {
        ZegoLogConfig *logConfigObj = [[ZegoLogConfig alloc] init];
        NSString *logPath = [RCTConvert NSString:logConfig[@"logPath"]];
        if(logPath) {
            logConfigObj.logPath = logPath;
        }
        NSNumber *logSize = [RCTConvert NSNumber:logConfig[@"logSize"]];
        if(logSize) {
            logConfigObj.logSize = [logSize unsignedLongLongValue];
        }
        
        engineConfig.logConfig = logConfigObj;
    }
    
    // 可能需要校验 kv 的类型
    NSDictionary *advancedConfig = [RCTConvert NSDictionary:config[@"advancedConfig"]];
    if(advancedConfig) {
        engineConfig.advancedConfig = advancedConfig;
    }
    
    [ZegoExpressEngine setEngineConfig:engineConfig];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(uploadLog:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [[ZegoExpressEngine sharedEngine] uploadLog];
    resolve(nil);
}

RCT_EXPORT_METHOD(loginRoom:(NSString *)roomID
                  user:(NSDictionary *)user
                  config:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"loginRoom: room id: %@, user: %@, config: %@", roomID, user, config);
    
    ZegoUser *userObj = [[ZegoUser alloc] initWithUserID:[RCTConvert NSString:user[@"userID"]] userName:[RCTConvert NSString:user[@"userName"]]];
    
    if(config) {
        ZegoRoomConfig *configObj = [[ZegoRoomConfig alloc] init];
        configObj.isUserStatusNotify = [RCTConvert BOOL:config[@"isUserStatusNotify"]];
        configObj.maxMemberCount = (unsigned int)[RCTConvert NSUInteger:config[@"maxMemberCount"]];
        configObj.token = [RCTConvert NSString:config[@"token"]];
        
        [[ZegoExpressEngine sharedEngine] loginRoom:roomID user:userObj config:configObj];
    } else {
        [[ZegoExpressEngine sharedEngine] loginRoom:roomID user:userObj];
    }
    
    resolve(nil);
}

RCT_EXPORT_METHOD(logoutRoom:(NSString *)roomID
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"logoutRoom: room id: %@", roomID);
    
    [[ZegoExpressEngine sharedEngine] logoutRoom:roomID];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(startPublishingStream:(NSString *)streamID
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"startPublishingStream: stream id: %@ channel: %ld", streamID, channel);
    
    [[ZegoExpressEngine sharedEngine] startPublishingStream:streamID channel:(ZegoPublishChannel)channel];

    resolve(nil);
}

RCT_EXPORT_METHOD(stopPublishingStream:(int)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"stopPublishingStream: channel: %d", channel);
    
    [[ZegoExpressEngine sharedEngine] stopPublishingStream:(ZegoPublishChannel)channel];

    resolve(nil);
}

RCT_EXPORT_METHOD(startPreview:(NSDictionary *)view
                  channel:(int)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"startPreview: view: %@, channel: %d", view, channel);
    
    NSNumber *viewTag = [RCTConvert NSNumber:view[@"reactTag"]];
    UIView *uiView = [self.bridge.uiManager viewForReactTag:viewTag];
    
    ZegoCanvas *canvas = [[ZegoCanvas alloc] initWithView:uiView];
    canvas.viewMode = (ZegoViewMode)[RCTConvert int:view[@"viewMode"]];
    canvas.backgroundColor = [RCTConvert int:view[@"backgroundColor"]];
    
    [[ZegoExpressEngine sharedEngine] startPreview:canvas channel: (ZegoPublishChannel)channel];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(stopPreview:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"stopPreview: channel: %ld", channel);
    
    [[ZegoExpressEngine sharedEngine] stopPreview:(ZegoPublishChannel)channel];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(setVideoConfig:(NSDictionary *)config
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"setVideoConfig: config: %@, channel: %ld", config, channel);
    
    ZegoVideoConfig * configObj = [[ZegoVideoConfig alloc] init];
    configObj.captureResolution = CGSizeMake([RCTConvert int:config[@"captureWidth"]], [RCTConvert int:config[@"captureHeight"]]);
    configObj.encodeResolution = CGSizeMake([RCTConvert int:config[@"encodeWidth"]], [RCTConvert int:config[@"encodeHeight"]]);
    configObj.bitrate = [RCTConvert int:config[@"bitrate"]];
    configObj.fps = [RCTConvert int:config[@"fps"]];
    configObj.codecID = (ZegoVideoCodecID)[RCTConvert int:config[@"codecID"]];
    
    [[ZegoExpressEngine sharedEngine] setVideoConfig:configObj channel:(ZegoPublishChannel)channel];
        
    resolve(nil);
}

RCT_EXPORT_METHOD(getVideoConfig:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZegoVideoConfig *config = [[ZegoExpressEngine sharedEngine] getVideoConfig:(ZegoPublishChannel)channel];
    
    resolve(@{@"captureWidth": @(config.captureResolution.width),
              @"captureHeight": @(config.captureResolution.height),
              @"encodeWidth": @(config.encodeResolution.width),
              @"encodeHeight": @(config.encodeResolution.height),
              @"bitrate": @(config.bitrate),
              @"fps": @(config.fps),
              @"codecID": @(config.codecID)
            });
}

RCT_EXPORT_METHOD(setVideoMirrorMode:(NSInteger)mode
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"setVideoMirrorMode: mode: %ld, channel: %ld", mode, channel);
    
    [[ZegoExpressEngine sharedEngine] setVideoMirrorMode:(ZegoVideoMirrorMode)mode channel:(ZegoPublishChannel)channel];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(setAppOrientation:(NSInteger)orientation
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"setAppOrientation: ori: %ld, channel: %ld", orientation, channel);
    
    UIInterfaceOrientation  uiOrientation = UIInterfaceOrientationUnknown;
    switch (orientation) {
        case 0:
            uiOrientation = UIInterfaceOrientationPortrait;
            break;
        case 1:
            uiOrientation = UIInterfaceOrientationLandscapeRight;
            break;
        case 2:
            uiOrientation = UIInterfaceOrientationPortraitUpsideDown;
            break;
        case 3:
            uiOrientation = UIInterfaceOrientationLandscapeLeft;
        default:
            break;
    }
    [[ZegoExpressEngine sharedEngine] setAppOrientation:uiOrientation channel:(ZegoPublishChannel)channel];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(setAudioConfig:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"setAudioConfig: config: %@", config);
    
    ZegoAudioConfig *configObj = [[ZegoAudioConfig alloc] init];
    configObj.bitrate = [RCTConvert int:config[@"bitrate"]];
    configObj.channel = (ZegoAudioChannel)[RCTConvert NSInteger:config[@"channel"]];
    configObj.codecID = (ZegoAudioCodecID)[RCTConvert NSInteger:config[@"codecID"]];
    
    [[ZegoExpressEngine sharedEngine] setAudioConfig:configObj];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(getAudioConfig:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZegoAudioConfig *config = [[ZegoExpressEngine sharedEngine] getAudioConfig];
    
    resolve(@{@"bitrate": @(config.bitrate),
              @"channel": @(config.channel),
              @"codecID": @(config.codecID)
            });
}

RCT_EXPORT_METHOD(mutePublishStreamAudio:(BOOL)mute
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"mutePublishStreamAudio: mute: %d, channel: %ld", mute, channel);
    
    [[ZegoExpressEngine sharedEngine] mutePublishStreamAudio:mute channel:(ZegoPublishChannel)channel];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(mutePublishStreamVideo:(BOOL)mute
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"mutePublishStreamVideo: mute: %d, channel: %ld", mute, channel);
    
    [[ZegoExpressEngine sharedEngine] mutePublishStreamVideo:mute channel:(ZegoPublishChannel)channel];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(setCaptureVolume:(NSInteger)volume
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"setCaptureVolume: volume: %ld", volume);
    
    [[ZegoExpressEngine sharedEngine] setCaptureVolume:(int)volume];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(enableHardwareEncoder:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"enableHardwareEncoder: enable: %d", enable);
    
    [[ZegoExpressEngine sharedEngine] enableHardwareEncoder:enable];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(startPlayingStream:(NSString *)streamID
                  view:(NSDictionary *)view
                  config:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"startPlayingStream: stream id: %@, view: %@, config: %@", streamID, view, config);
    
    NSNumber *viewTag = [RCTConvert NSNumber:view[@"reactTag"]];
    UIView *uiView = [self.bridge.uiManager viewForReactTag:viewTag];
    
    ZegoCanvas *canvas = [[ZegoCanvas alloc] initWithView:uiView];
    canvas.viewMode = (ZegoViewMode)[RCTConvert int:view[@"viewMode"]];
    canvas.backgroundColor = [RCTConvert int:view[@"backgroundColor"]];
    
    if(config) {
        ZegoPlayerConfig *configObj = [[ZegoPlayerConfig alloc] init];
        NSDictionary *cdnConfig = [RCTConvert NSDictionary:config[@"cdnConfig"]];
        ZegoCDNConfig *cdnConfigObj = nil;
        if(cdnConfig) {
            cdnConfigObj.url = [RCTConvert NSString:cdnConfig[@"url"]];
            cdnConfigObj.authParam = [RCTConvert NSString:cdnConfig[@"authParam"]];
        }
        configObj.cdnConfig = cdnConfigObj;
        configObj.videoLayer = (ZegoPlayerVideoLayer)[RCTConvert int:config[@"videoLayer"]];
        
        [[ZegoExpressEngine sharedEngine] startPlayingStream:streamID canvas:canvas config:configObj];
    } else {
        [[ZegoExpressEngine sharedEngine] startPlayingStream:streamID canvas:canvas];
    }
    
    resolve(nil);
}

RCT_EXPORT_METHOD(stopPlayingStream:(NSString *)streamID
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"stopPlayingStream: stream id: %@", streamID);
    
    [[ZegoExpressEngine sharedEngine] stopPlayingStream:streamID];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(setPlayVolume:(NSString *)streamID
                  volume:(NSInteger)volume
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"setPlayVolume: volume: %ld, streamID: %@", volume, streamID);
    
    [[ZegoExpressEngine sharedEngine] setPlayVolume:(int)volume streamID:streamID];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(mutePlayStreamAudio:(NSString *)streamID
                  mute:(BOOL)mute
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"mutePlayStreamAudio: mute: %d, stream id: %@", mute, streamID);
    
    [[ZegoExpressEngine sharedEngine] mutePlayStreamAudio:mute streamID:streamID];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(mutePlayStreamVideo:(NSString *)streamID
                  mute:(BOOL)mute
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"mutePlayStreamVideo: mute: %d, stream id: %@", mute, streamID);
    
    [[ZegoExpressEngine sharedEngine] mutePlayStreamVideo:mute streamID:streamID];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(enableHardwareDecoder:(BOOL)mute
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"enableHardwareDecoder: enable: %d", mute);
    
    [[ZegoExpressEngine sharedEngine] enableHardwareDecoder:mute];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(muteMicrophone:(BOOL)mute
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"muteMicrophone: mute: %d", mute);
    
    [[ZegoExpressEngine sharedEngine] muteMicrophone:mute];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(isMicrophoneMuted:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@([[ZegoExpressEngine sharedEngine] isMicrophoneMuted]));
}

RCT_EXPORT_METHOD(muteSpeaker:(BOOL)mute
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"muteSpeaker: mute: %d", mute);
    
    [[ZegoExpressEngine sharedEngine] muteSpeaker:mute];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(isSpeakerMuted:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@([[ZegoExpressEngine sharedEngine] isSpeakerMuted]));
}

RCT_EXPORT_METHOD(enableAudioCaptureDevice:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"enableAudioCaptureDevice: enable: %d", enable);
    
    [[ZegoExpressEngine sharedEngine] enableAudioCaptureDevice:enable];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(enableCamera:(BOOL)enable
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"enableCamera: enable: %d", enable);
    
    [[ZegoExpressEngine sharedEngine] enableCamera:enable];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(useFrontCamera:(BOOL)enable
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"useFrontCamera: enable: %d, channel: %ld", enable, channel);
    
    [[ZegoExpressEngine sharedEngine] useFrontCamera:enable];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(startSoundLevelMonitor:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [[ZegoExpressEngine sharedEngine] startSoundLevelMonitor];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(stopSoundLevelMonitor:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [[ZegoExpressEngine sharedEngine] stopSoundLevelMonitor];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(enableAEC:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"enableAEC: enable: %d", enable);
    
    [[ZegoExpressEngine sharedEngine] enableAEC:enable];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(enableHeadphoneAEC:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"enableHeadphoneAEC: enable: %d", enable);
    
    [[ZegoExpressEngine sharedEngine] enableHeadphoneAEC:enable];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(setAECMode:(NSInteger)mode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"setAECMode: mode: %ld", mode);
    
    [[ZegoExpressEngine sharedEngine] setAECMode:(ZegoAECMode)mode];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(enableAGC:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"enableAGC: enable: %d", enable);
    
    [[ZegoExpressEngine sharedEngine] enableAGC:enable];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(enableANS:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"enableANS: enable: %d", enable);
    
    [[ZegoExpressEngine sharedEngine] enableANS:enable];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(setANSMode:(NSInteger)mode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"setANSMode: mode: %ld", mode);
    
    [[ZegoExpressEngine sharedEngine] setANSMode:(ZegoANSMode)mode];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(enableBeautify:(NSInteger)feature
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"enableBeautify: feature: %ld, channel: %ld", feature, channel);
    
    [[ZegoExpressEngine sharedEngine] enableBeautify:(ZegoBeautifyFeature)feature channel:(ZegoPublishChannel)channel];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(setBeautifyOption:(NSDictionary *)option
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    ZGLog(@"setBeautifyOption: option: %@, channel: %ld", option, channel);
    
    ZegoBeautifyOption *optionObj = [[ZegoBeautifyOption alloc] init];
    optionObj.polishStep = [RCTConvert double:option[@"polishStep"]];
    optionObj.sharpenFactor = [RCTConvert double:option[@"sharpenFactor"]];
    optionObj.whitenFactor = [RCTConvert double:option[@"whitenFactor"]];
    
    [[ZegoExpressEngine sharedEngine] setBeautifyOption:optionObj];
    
    resolve(nil);
}



# pragma mark ZegoEventHandler

# pragma mark engine
- (void)onDebugError:(int)errorCode funcName:(NSString *)funcName info:(NSString *)info
{
    ZGLog(@"[onDebugError] error: %d, func name: %@, info: %@", errorCode, funcName, info);
    if(self.hasListeners) {
        [self sendEventWithName:@"DebugError"
                           body:@{@"data":@[@(errorCode),
                                            funcName,
                                            info]
        }];
    }
}

# pragma mark room
- (void)onRoomStateUpdate:(ZegoRoomState)state errorCode:(int)errorCode extendedData:(nullable NSDictionary *)extendedData roomID:(NSString *)roomID
{
    ZGLog(@"[onRoomStateUpdate] state: %lu, error: %d", (unsigned long)state, errorCode);
    if(self.hasListeners) {
        NSString *extendDataStr = @"";
        if(extendedData) {
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:extendedData options:0 error:0];
            extendDataStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }
        
        [self sendEventWithName:@"RoomStateUpdate"
                           body:@{@"data":@[roomID,
                                            @(state),
                                            @(errorCode),
                                            extendDataStr]
        }];
    }
}

- (void)onRoomUserUpdate:(ZegoUpdateType)updateType userList:(NSArray<ZegoUser *> *)userList roomID:(NSString *)roomID
{
    ZGLog(@"[onRoomUserUpdate] update type: %lu, user list: %@, room id: %@", (unsigned long)updateType, userList, roomID);
    if(self.hasListeners) {
        NSMutableArray *userListArray = [[NSMutableArray alloc] init];
        for (ZegoUser *user in userList) {
            [userListArray addObject:@{
                @"userID": user.userID,
                @"userName": user.userName
            }];
        }
        
        [self sendEventWithName:@"RoomUserUpdate"
                           body:@{@"data":@[roomID,
                                            @(updateType),
                                            userListArray]
                                                         
        }];
    }
    
}

- (void)onRoomOnlineUserCountUpdate:(int)count roomID:(NSString *)roomID
{
    ZGLog(@"[onRoomOnlineUserCountUpdate] room id: %@, count: %d", roomID, count);
    if(self.hasListeners) {
        [self sendEventWithName:@"RoomOnlineUserCountUpdate"
                           body:@{@"data":@[roomID,
                                            @(count)]
                                                                    
        }];
    }
}

- (void)onRoomStreamUpdate:(ZegoUpdateType)updateType streamList:(NSArray<ZegoStream *> *)streamList roomID:(NSString *)roomID
{
    ZGLog(@"[RoomStreamUpdate] room id: %@, update type: %lu, stream list: %@", roomID, (unsigned long)updateType, streamList);
    if(self.hasListeners) {
        NSMutableArray *streamListArray = [[NSMutableArray alloc] init];
        for (ZegoStream *stream in streamList) {
            [streamListArray addObject:@{
                @"user": @{
                    @"userID": stream.user.userID,
                    @"userName": stream.user.userName
                },
                @"streamID": stream.streamID,
                @"extraInfo": stream.extraInfo
            }];
        }
        [self sendEventWithName:@"RoomStreamUpdate"
                           body:@{@"data":@[roomID,
                                            @(updateType),
                                            streamListArray]
                                                           
        }];
    }
}

# pragma mark publisher
- (void)onPublisherStateUpdate:(ZegoPublisherState)state errorCode:(int)errorCode extendedData:(nullable NSDictionary *)extendedData streamID:(NSString *)streamID
{
    ZGLog(@"[onPublisherStateUpdate] state: %lu, error: %d", (unsigned long)state, errorCode);
    if(self.hasListeners) {
        NSString *extendDataStr = @"";
        if(extendedData) {
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:extendedData options:0 error:0];
            extendDataStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }
        
        [self sendEventWithName:@"PublisherStateUpdate"
                           body:@{@"data":@[streamID,
                                            @(state),
                                            @(errorCode),
                                            extendDataStr]
        }];
    }
}

- (void)onPublisherQualityUpdate:(ZegoPublishStreamQuality *)quality streamID:(NSString *)streamID
{
    ZGLog(@"[onPublisherQualityUpdate] quality: %@, stream id: %@", quality, streamID);
    if(self.hasListeners) {
        [self sendEventWithName:@"PublisherQualityUpdate"
                           body:@{@"data":@[streamID,
                                            @{@"videoCaptureFPS":@(quality.videoCaptureFPS),
                                              @"videoEncodeFPS":@(quality.videoEncodeFPS),
                                              @"videoSendFPS":@(quality.videoSendFPS),
                                              @"videoKBPS":@(quality.videoKBPS),
                                              @"audioCaptureFPS":@(quality.audioCaptureFPS),
                                              @"audioSendFPS":@(quality.audioSendFPS),
                                              @"audioKBPS":@(quality.audioKBPS),
                                              @"rtt":@(quality.rtt),
                                              @"packetLostRate":@(quality.packetLostRate),
                                              @"level":@(quality.level),
                                              @"isHardwareEncode":@(quality.isHardwareEncode),
                                              @"totalSendBytes":@(quality.totalSendBytes),
                                              @"audioSendBytes":@(quality.audioSendBytes),
                                              @"videoSendBytes":@(quality.videoSendBytes)}]
        }];
    }
}

- (void)onPublisherCapturedAudioFirstFrame
{
    ZGLog(@"[onPublisherCapturedAudioFirstFrame]");
    if(self.hasListeners) {
        [self sendEventWithName:@"PublisherCapturedAudioFirstFrame" body:@{@"data":@[]}];
    }
    
}

- (void)onPublisherCapturedVideoFirstFrame:(ZegoPublishChannel)channel
{
    ZGLog(@"[PublisherCapturedVideoFirstFrame] channel: %lu", (unsigned long)channel);
    if(self.hasListeners) {
        [self sendEventWithName:@"PublisherCapturedVideoFirstFrame" body:@{@"data":@[@(channel)]}];
    }
}

- (void)onPublisherVideoSizeChanged:(CGSize)size channel:(ZegoPublishChannel)channel
{
    ZGLog(@"[onPublisherVideoSizeChanged] size: (%f, %f), channel: %lu",size.width, size.height, (unsigned long)channel);
    if(self.hasListeners) {
        [self sendEventWithName:@"PublisherVideoSizeChanged"
                           body:@{@"data":@[@(size.width),
                                            @(size.height),
                                            @(channel)]
                                  
                           }];
    }
}

# pragma mark player
- (void)onPlayerStateUpdate:(ZegoPlayerState)state errorCode:(int)errorCode extendedData:(nullable NSDictionary *)extendedData streamID:(NSString *)streamID
{
    ZGLog(@"[onPlayerStateUpdate] state: %lu, error: %d", state, errorCode);
    if(self.hasListeners) {
        NSString *extendDataStr = @"";
        if(extendedData) {
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:extendedData options:0 error:0];
            extendDataStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }
        
        [self sendEventWithName:@"PlayerStateUpdate"
                           body:@{@"data":@[streamID,
                                            @(state),
                                            @(errorCode),
                                            extendDataStr]
                           }];
    }
}

- (void)onPlayerQualityUpdate:(ZegoPlayStreamQuality *)quality streamID:(NSString *)streamID
{
    ZGLog(@"[onPlayerQualityUpdate] quality: %@, stream id: %@", quality, streamID);
    if(self.hasListeners) {
        [self sendEventWithName:@"PlayerQualityUpdate"
                           body:@{@"data":@[streamID,
                                            @{@"videoRecvFPS": @(quality.videoRecvFPS),
                                              @"videoDecodeFPS": @(quality.videoDecodeFPS),
                                              @"videoRenderFPS": @(quality.videoRenderFPS),
                                              @"videoKBPS": @(quality.videoKBPS),
                                              @"audioRecvFPS": @(quality.audioRecvFPS),
                                              @"audioDecodeFPS": @(quality.audioDecodeFPS),
                                              @"audioRenderFPS": @(quality.audioRenderFPS),
                                              @"audioKBPS": @(quality.audioKBPS),
                                              @"rtt": @(quality.rtt),
                                              @"packetLostRate": @(quality.packetLostRate),
                                              @"peerToPeerPacketLostRate": @(quality.peerToPeerPacketLostRate),
                                              @"level": @(quality.level),
                                              @"delay": @(quality.delay),
                                              @"isHardwareDecode": @(quality.isHardwareDecode),
                                              @"totalRecvBytes": @(quality.totalRecvBytes),
                                              @"audioRecvBytes": @(quality.audioRecvBytes),
                                              @"videoRecvBytes": @(quality.videoRecvBytes)}]
                           }];
    }
}

- (void)onPlayerMediaEvent:(ZegoPlayerMediaEvent)event streamID:(NSString *)streamID
{
    ZGLog(@"[onPlayerMediaEvent] event: %lu, stream id: %@", (unsigned long)event, streamID);
    if(self.hasListeners) {
        [self sendEventWithName:@"PlayerMediaEvent"
                           body:@{@"data":@[streamID,
                                            @(event)]
                           }];
    }
}

- (void)onPlayerRecvAudioFirstFrame:(NSString *)streamID
{
    ZGLog(@"[onPlayerRecvAudioFirstFrame] stream id: %@", streamID);
    if(self.hasListeners) {
        [self sendEventWithName:@"PlayerRecvAudioFirstFrame"
                           body:@{@"data":@[streamID]}];
    }
}

- (void)onPlayerRecvVideoFirstFrame:(NSString *)streamID
{
    ZGLog(@"[onPlayerRecvVideoFirstFrame] stream id: %@", streamID);
    if(self.hasListeners) {
        [self sendEventWithName:@"PlayerRecvVideoFirstFrame"
                           body:@{@"data":@[streamID]}];
    }
}

- (void)onPlayerRenderVideoFirstFrame:(NSString *)streamID
{
    ZGLog(@"[onPlayerRenderVideoFirstFrame] stream id: %@", streamID);
    if(self.hasListeners) {
        [self sendEventWithName:@"PlayerRenderVideoFirstFrame"
                           body:@{@"data":@[streamID]}];
    }
}

- (void)onPlayerVideoSizeChanged:(CGSize)size streamID:(NSString *)streamID
{
    ZGLog(@"[onPlayerVideoSizeChanged] size: (%f, %f), stream id: %@", size.width, size.height, streamID);
    if(self.hasListeners) {
        [self sendEventWithName:@"PlayerVideoSizeChanged"
                           body:@{@"data":@[streamID,
                                            @(size.width),
                                            @(size.height)]
                           }];
    }
}

# pragma mark device
- (void)onCapturedSoundLevelUpdate:(NSNumber *)soundLevel
{
    if(self.hasListeners) {
        [self sendEventWithName:@"CapturedSoundLevelUpdate"
                           body:@{@"data":@[soundLevel]}];
    }
}

- (void)onRemoteSoundLevelUpdate:(NSDictionary<NSString *, NSNumber *> *)soundLevels
{
    if(self.hasListeners) {
        [self sendEventWithName:@"RemoteSoundLevelUpdate"
                           body:@{@"data":@[soundLevels]}];
    }
}

- (void)onDeviceError:(int)errorCode deviceName:(NSString *)deviceName
{
    ZGLog(@"[onDeviceError] error: %d, device name: %@", errorCode, deviceName);
    if(self.hasListeners) {
        [self sendEventWithName:@"DeviceError"
                           body:@{@"data":@[@(errorCode),
                                            deviceName]
                           }];
    }
}

- (void)onRemoteCameraStateUpdate:(ZegoRemoteDeviceState)state streamID:(NSString *)streamID
{
    ZGLog(@"[onRemoteCameraStateUpdate] state: %lu, stream id: %@", (unsigned long)state, streamID);
    if(self.hasListeners) {
        [self sendEventWithName:@"RemoteCameraStateUpdate"
                           body:@{@"data":@[streamID,
                                            @(state)]
                           }];
    }
}

- (void)onRemoteMicStateUpdate:(ZegoRemoteDeviceState)state streamID:(NSString *)streamID
{
    ZGLog(@"[onRemoteMicStateUpdate] state: %lu, stream id: %@", (unsigned long)state, streamID);
    if(self.hasListeners) {
        [self sendEventWithName:@"RemoteMicStateUpdate"
                           body:@{@"data":@[streamID,
                                            @(state)]
                           }];
    }
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[
      @"DebugError",
      @"RoomStateUpdate",
      @"RoomUserUpdate",
      @"RoomOnlineUserCountUpdate",
      @"RoomStreamUpdate",
      @"PublisherStateUpdate",
      @"PublisherQualityUpdate",
      @"PublisherCapturedAudioFirstFrame",
      @"PublisherCapturedVideoFirstFrame",
      @"PublisherVideoSizeChanged",
      @"PlayerStateUpdate",
      @"PlayerQualityUpdate",
      @"PlayerMediaEvent",
      @"PlayerRecvAudioFirstFrame",
      @"PlayerRecvVideoFirstFrame",
      @"PlayerRenderVideoFirstFrame",
      @"PlayerVideoSizeChanged",
      @"CapturedSoundLevelUpdate",
      @"RemoteSoundLevelUpdate",
      @"DeviceError",
      @"RemoteCameraStateUpdate",
      @"RemoteMicStateUpdate"
      ];
}


@end
