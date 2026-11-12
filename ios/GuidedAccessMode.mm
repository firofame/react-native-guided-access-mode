#import "GuidedAccessMode.h"

#import <UIKit/UIKit.h>

@implementation GuidedAccessMode

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (instancetype)init
{
  if (self = [super init]) {
    // Forward Guided Access status changes to JS listeners.
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(guidedAccessStatusDidChange:)
                                                 name:UIAccessibilityGuidedAccessStatusDidChangeNotification
                                               object:nil];
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)isGuidedAccessEnabled:(RCTPromiseResolveBlock)resolve
                      reject:(__unused RCTPromiseRejectBlock)reject
{
  resolve(@(UIAccessibilityIsGuidedAccessEnabled()));
}

- (void)guidedAccessStatusDidChange:(__unused NSNotification *)notification
{
  [self emitOnGuidedAccessStatusChange:@{
    @"enabled" : @(UIAccessibilityIsGuidedAccessEnabled()),
  }];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeGuidedAccessModeSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"GuidedAccessMode";
}

@end
