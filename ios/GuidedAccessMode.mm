#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(GuidedAccessMode, RCTEventEmitter)

RCT_EXTERN_METHOD(isGuidedAccessEnabled:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
