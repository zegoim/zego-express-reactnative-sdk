import { NativeModules } from 'react-native';

const { ZegoExpressNativeModule } = NativeModules;

export default class ZegoExpressEngine {
    getVersion() {
        return ZegoExpressNativeModule.getVersion()
    }
}