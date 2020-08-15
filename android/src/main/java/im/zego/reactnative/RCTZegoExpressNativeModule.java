package im.zego.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;

import im.zego.zegoexpress.*;

public class RCTZegoExpressNativeModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RCTZegoExpressNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RCTZegoExpressNativeModule";
    }

    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        // TODO: Implement some actually useful functionality
        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
    }

    @ReactMethod
    public void getVersion(Promise promise) {
        promise.resolve(ZegoExpressEngine.getVersion());
    }
}
