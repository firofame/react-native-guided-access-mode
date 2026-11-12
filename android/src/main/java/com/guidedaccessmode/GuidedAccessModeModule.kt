package com.guidedaccessmode

import android.app.ActivityManager
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class GuidedAccessModeModule(reactContext: ReactApplicationContext) :
  NativeGuidedAccessModeSpec(reactContext) {

  override fun getName(): String = NAME

  /**
   * Guided Access is an iOS-only feature. The closest equivalent on Android
   * is App Pinning / lock task mode, so this reports whether the device is
   * currently in one of those states.
   */
  override fun isGuidedAccessEnabled(promise: Promise) {
    try {
      val activityManager =
        reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
      val enabled = activityManager.lockTaskModeState != ActivityManager.LOCK_TASK_MODE_NONE
      promise.resolve(enabled)
    } catch (e: Exception) {
      promise.reject("E_GUIDED_ACCESS_STATE", "Failed to read lock task mode state", e)
    }
  }

  companion object {
    const val NAME = NativeGuidedAccessModeSpec.NAME
  }
}
