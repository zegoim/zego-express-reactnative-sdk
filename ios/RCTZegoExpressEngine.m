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
  return @[@"onRoomStateUpdate", @"onPublisherStateUpdate"];
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

RCT_EXPORT_METHOD(getVersion:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    resolve([ZegoExpressEngine getVersion]);
}

RCT_EXPORT_METHOD(createEngine:(unsigned int)appID appSign:(NSString *)appSign isTestEnv:(BOOL)isTestEnv scenario:(NSInteger)scenario resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"app id: %u, app sign: %@, test: %d, scenario: %d", appID, appSign, isTestEnv, scenario);
    [ZegoExpressEngine createEngineWithAppID:appID appSign:appSign isTestEnv:isTestEnv scenario:(ZegoScenario)scenario eventHandler:self];
    self.isInited = YES;
    resolve(nil);
}

RCT_EXPORT_METHOD(destroyEngine:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    if(self.isInited) {
        [ZegoExpressEngine destroyEngine:^{
            resolve(nil);
        }];
    } else {
        resolve(nil);
    }
}

RCT_EXPORT_METHOD(setEngineConfig:(NSDictionary *)config resove:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    
}

RCT_EXPORT_METHOD(uploadLog:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    [[ZegoExpressEngine sharedEngine] uploadLog];
    resolve(nil);
}

RCT_EXPORT_METHOD(loginRoom:(NSString *)roomID user:(NSDictionary *)user config:(NSDictionary *)config resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    ZegoUser *userObj = [[ZegoUser alloc] initWithUserID:[RCTConvert NSString:user[@"userID"]] userName:[RCTConvert NSString:user[@"userName"]]];
    
    if(config) {
        ZegoRoomConfig *configObj = [[ZegoRoomConfig alloc] init];
        configObj.isUserStatusNotify = [RCTConvert BOOL:config[@"isUserStatusNotify"]];
        configObj.maxMemberCount = [RCTConvert NSUInteger:config[@"maxMemberCount"]];
        configObj.token = [RCTConvert NSString:config[@"token"]];
        
        [[ZegoExpressEngine sharedEngine] loginRoom:roomID user:userObj config:configObj];
    } else {
        [[ZegoExpressEngine sharedEngine] loginRoom:roomID user:userObj];
    }
    
    resolve(nil);
}

RCT_EXPORT_METHOD(logoutRoom:(NSString *)roomID resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    [[ZegoExpressEngine sharedEngine] logoutRoom:roomID];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(startPublishingStream:(NSString *)streamID channel:(NSInteger)channel resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    [[ZegoExpressEngine sharedEngine] startPublishingStream:streamID channel:(ZegoPublishChannel)channel];
    
    resolve(nil);
}

RCT_EXPORT_METHOD(stopPublishingStream:(NSInteger)channel resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    [[ZegoExpressEngine sharedEngine] stopPublishingStream:(ZegoPublishChannel)channel];

    resolve(nil);
}

# pragma mark ZegoEventHandler

- (void)onRoomStateUpdate:(ZegoRoomState)state errorCode:(int)errorCode extendedData:(nullable NSDictionary *)extendedData roomID:(NSString *)roomID
{
    NSLog(@"RN Callback: [onRoomStateUpdate] state: %d, error: %d", state, errorCode);
    if(self.hasListeners) {
        [self sendEventWithName:@"onRoomStateUpdate"
        body:@{@"state": @(state),
               @"errorCode": @(errorCode),
               @"extendedData": extendedData,
               @"roomID": roomID
        }];
    }
}

- (void)onPublisherStateUpdate:(ZegoPublisherState)state errorCode:(int)errorCode extendedData:(nullable NSDictionary *)extendedData streamID:(NSString *)streamID
{
    NSLog(@"RN Callback: [onPublisherStateUpdate] state: %d, error: %d", state, errorCode);
    if(self.hasListeners) {
        [self sendEventWithName:@"onPublisherStateUpdate"
        body:@{@"state": @(state),
               @"errorCode": @(errorCode),
               @"extendedData": extendedData,
               @"streamID": streamID
        }];
    }
}



@end
