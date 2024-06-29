import UIKit
import React

@objc(GuidedAccessMode)
class GuidedAccessMode: RCTEventEmitter {
    
    private var hasListeners = false
    
    override init() {
        super.init()
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(guidedAccessStatusDidChange),
            name: UIAccessibility.guidedAccessStatusDidChangeNotification,
            object: nil
        )
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(isGuidedAccessEnabled:withRejecter:)
    func isGuidedAccessEnabled(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let enabled = UIAccessibility.isGuidedAccessEnabled
        resolve(enabled)
    }
    
    override func startObserving() {
        hasListeners = true
    }
    
    override func stopObserving() {
        hasListeners = false
    }
    
    @objc
    func guidedAccessStatusDidChange() {
        if hasListeners {
            let enabled = UIAccessibility.isGuidedAccessEnabled
            sendEvent(withName: "guidedAccessStatusDidChange", body: ["enabled": enabled])
        }
    }
    
    override func supportedEvents() -> [String]! {
        return ["guidedAccessStatusDidChange"]
    }
}
