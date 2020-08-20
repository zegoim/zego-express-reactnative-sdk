import React, {Component} from 'react';
import {
    requireNativeComponent, 
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


export class ZegoSurfaceView extends React.Component {

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