package im.zego.reactnative;

import android.view.TextureView;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import androidx.annotation.NonNull;

public class RCTZegoTextureViewManager extends SimpleViewManager<TextureView> {
    @NonNull
    @Override
    public String getName() {
        return "RCTZegoTextureView";
    }

    @NonNull
    @Override
    protected TextureView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new TextureView(reactContext);
    }
}