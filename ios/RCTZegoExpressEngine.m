#import "RCTZegoExpressEngine.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import <React/RCTConvert.h>

@interface RCTZegoExpressNativeModule()<ZegoEventHandler>

@property (nonatomic, assign) BOOL isInited;
@property (nonatomic, assign) BOOL hasListeners;

@end

@implementation RCTZegoExpressNativeModule

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents
{
  return @[
      @"RoomStateUpdate", 
      @"PublisherStateUpdate", 
      @"PlayerStateUpdate"
      ];
}

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

# pragma mark ZegoEventHandler

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



@end
