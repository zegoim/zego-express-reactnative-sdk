#import "RCTZegoExpressEngine.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import <React/RCTConvert.h>

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

RCT_EXPORT_METHOD(sampleMethod:(NSString *)stringArgument numberParameter:(nonnull NSNumber *)numberArgument callback:(RCTResponseSenderBlock)callback)
{
    // TODO: Implement some actually useful functionality
    callback(@[[NSString stringWithFormat: @"numberArgument: %@ stringArgument: %@", numberArgument, stringArgument]]);
}

RCT_EXPORT_METHOD(getVersion:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([ZegoExpressEngine getVersion]);
}

RCT_EXPORT_METHOD(createEngine:(NSUInteger)appID
                  appSign:(NSString *)appSign
                  isTestEnv:(BOOL)isTestEnv
                  scenario:(NSInteger)scenario
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"app id: %lu, app sign: %@, test: %d, scenario: %ld", (unsigned long)appID, appSign, isTestEnv, (long)scenario);
    [ZegoExpressEngine createEngineWithAppID:(unsigned int)appID appSign:appSign isTestEnv:isTestEnv scenario:(ZegoScenario)scenario eventHandler:self];
    self.isInited = YES;
    resolve(nil);
}

RCT_EXPORT_METHOD(destroyEngine:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
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
    [[ZegoExpressEngine sharedEngine] logoutRoom:roomID];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(startPublishingStream:(NSString *)streamID
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [[ZegoExpressEngine sharedEngine] startPublishingStream:streamID channel:(ZegoPublishChannel)channel];

    resolve(nil);
}

RCT_EXPORT_METHOD(stopPublishingStream:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [[ZegoExpressEngine sharedEngine] stopPublishingStream:(ZegoPublishChannel)channel];

    resolve(nil);
}

RCT_EXPORT_METHOD(startPreview:(NSDictionary *)view
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
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
    [[ZegoExpressEngine sharedEngine] stopPreview:(ZegoPublishChannel)channel];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(setVideoConfig:(id)config
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
    if([config isKindOfClass:[NSDictionary class]]) {
        
        ZegoVideoConfig * configObj = [[ZegoVideoConfig alloc] init];
        configObj.captureResolution = CGSizeMake([RCTConvert int:config[@"captureWidth"]], [RCTConvert int:config[@"captureHeight"]]);
        configObj.encodeResolution = CGSizeMake([RCTConvert int:config[@"encodeWidth"]], [RCTConvert int:config[@"encodeHeight"]]);
        configObj.bitrate = [RCTConvert int:config[@"bitrate"]];
        configObj.fps = [RCTConvert int:config[@"fps"]];
        configObj.codecID = (ZegoVideoCodecID)[RCTConvert int:config[@"codecID"]];
        
        [[ZegoExpressEngine sharedEngine] setVideoConfig:configObj channel:(ZegoPublishChannel)channel];
        
    } else if([config isKindOfClass:[NSNumber class]]) {
        
        int preset = [(NSNumber *)config intValue];
        if(preset < 0 || preset > 5)
        {
            reject(@"-1", @"invalid params", nil);
            return;
        }
        
        ZegoVideoConfig *configObj = [[ZegoVideoConfig alloc] initWithPreset:(ZegoVideoConfigPreset)preset];
        [[ZegoExpressEngine sharedEngine] setVideoConfig:configObj channel:(ZegoPublishChannel)channel];
        
    } else {
        reject(@"-1", @"invalid params", nil);
        return;
    }
    
    resolve(nil);
}

RCT_EXPORT_METHOD(getVideoConfig:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(setVideoMirrorMode:(NSInteger)mode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(setAppOrientation:(NSInteger)oroentation
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(setAudioConfig:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(getAudioConfig:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(mutePublishStreamAudio:(BOOL)mute
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(mutePublishStreamVideo:(BOOL)mute
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(setCaptureVolume:(NSInteger)volume
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(enableHardwareEncoder:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(startPlayingStream:(NSString *)streamID
                  view:(NSDictionary *)view
                  config:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
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
    [[ZegoExpressEngine sharedEngine] stopPlayingStream:streamID];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(setPlayVolume:(NSInteger)volume
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(mutePlayStreamAudio:(BOOL)mute
                  streamID:(NSString *)streamID
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(mutePlayStreamVideo:(BOOL)mute
                  streamID:(NSString *)streamID
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(enableHardwareDecoder:(BOOL)mute
                  streamID:(NSString *)streamID
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(muteMicrophone:(BOOL)mute
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(isMicrophoneMuted:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(muteSpeaker:(BOOL)mute
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(isSpeakerMuted:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(enableAudioCaptureDevice:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(enableCamera:(BOOL)enable
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(useFrontCamera:(BOOL)enable
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(startSoundLevelMonitor:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(stopSoundLevelMonitor:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(enableAEC:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(enableHeadphoneAEC:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(setAECMode:(NSInteger)mode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(enableAGC:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(enableANS:(BOOL)enable
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(setANSMode:(NSInteger)mode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(enableBeautify:(NSInteger)feature
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(setBeautifyOption:(NSDictionary *)option
                  channel:(NSInteger)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
}



# pragma mark ZegoEventHandler

# pragma mark engine
- (void)onDebugError:(int)errorCode funcName:(NSString *)funcName info:(NSString *)info
{
    
}

# pragma mark room
- (void)onRoomStateUpdate:(ZegoRoomState)state errorCode:(int)errorCode extendedData:(nullable NSDictionary *)extendedData roomID:(NSString *)roomID
{
    NSLog(@"RN Callback: [onRoomStateUpdate] state: %lu, error: %d", (unsigned long)state, errorCode);
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
    
}

- (void)onRoomOnlineUserCountUpdate:(int)count roomID:(NSString *)roomID
{
    
}

- (void)onRoomStreamUpdate:(ZegoUpdateType)updateType streamList:(NSArray<ZegoStream *> *)streamList roomID:(NSString *)roomID
{
    
}

# pragma mark publisher
- (void)onPublisherStateUpdate:(ZegoPublisherState)state errorCode:(int)errorCode extendedData:(nullable NSDictionary *)extendedData streamID:(NSString *)streamID
{
    NSLog(@"RN Callback: [onPublisherStateUpdate] state: %lu, error: %d", (unsigned long)state, errorCode);
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
    
}

- (void)onPublisherCapturedAudioFirstFrame
{
    
}

- (void)onPublisherCapturedVideoFirstFrame:(ZegoPublishChannel)channel
{
    
}

- (void)onPublisherVideoSizeChanged:(CGSize)size channel:(ZegoPublishChannel)channel
{
    
}

# pragma mark player
- (void)onPlayerStateUpdate:(ZegoPlayerState)state errorCode:(int)errorCode extendedData:(nullable NSDictionary *)extendedData streamID:(NSString *)streamID
{
    NSLog(@"RN Callback: [onPlayerStateUpdate] state: %lu, error: %d", state, errorCode);
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
    
}

- (void)onPlayerMediaEvent:(ZegoPlayerMediaEvent)event streamID:(NSString *)streamID
{
    
}

- (void)onPlayerRecvAudioFirstFrame:(NSString *)streamID
{
    
}

- (void)onPlayerRecvVideoFirstFrame:(NSString *)streamID
{
    
}

- (void)onPlayerRenderVideoFirstFrame:(NSString *)streamID
{
    
}

- (void)onPlayerVideoSizeChanged:(CGSize)size streamID:(NSString *)streamID
{
    
}

# pragma mark device
- (void)onCapturedSoundLevelUpdate:(NSNumber *)soundLevel
{
    
}

- (void)onRemoteSoundLevelUpdate:(NSDictionary<NSString *, NSNumber *> *)soundLevels
{
    
}

- (void)onDeviceError:(int)errorCode deviceName:(NSString *)deviceName
{
    
}

- (void)onRemoteCameraStateUpdate:(ZegoRemoteDeviceState)state streamID:(NSString *)streamID
{
    
}

- (void)onRemoteMicStateUpdate:(ZegoRemoteDeviceState)state streamID:(NSString *)streamID
{
    
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
