package im.zego.reactnative;

import android.view.SurfaceView;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import androidx.annotation.NonNull;

public class RCTZegoSurfaceViewManager extends SimpleViewManager<SurfaceView> {
    @NonNull
    @Override
    public String getName() {
        return "RCTZegoSurfaceView";
    }

    @NonNull
    @Override
    protected SurfaceView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new SurfaceView(reactContext);
    }
}