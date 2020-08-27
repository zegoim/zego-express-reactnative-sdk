import React, {Component} from 'react';
import {
    requireNativeComponent,
    ViewProps,
    Platform, 
    View
} from 'react-native';


const ZegoSurfaceViewManager = Platform.select({
    ios: View,  // UIView
    android: requireNativeComponent('RCTZegoSurfaceView'),  // * android.view.SurfaceView
});


const ZegoTextureViewManager = Platform.select({
    ios: View,
    android: requireNativeComponent('RCTZegoTextureView'), // * android.view.TextureView
});

export interface SurfaceViewProps extends ViewProps {
    zOrderMediaOverlay?: boolean;
    zOrderOnTop?: boolean;
}

export class ZegoSurfaceView extends Component<{SurfaceViewProps}> {

    render() {
        return (
            <ZegoSurfaceViewManager {...this.props}/>
        )
    }
}

/**
 * @ignore
 */
export class ZegoTextureView extends Component<{}> {
    render() {
        return (
            <ZegoTextureViewManager {...this.props}/>
        )
    }
}