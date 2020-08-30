# zego-express-engine-reactnative

[English](https://github.com/zegoim/zego-express-reactnative-sdk/blob/master/README.md) | [中文](https://github.com/zegoim/zego-express-reactnative-sdk/blob/master/README_zh.md)

即构科技 (ZEGO) 极速音视频 ReactNative SDK 是一个基于 [ZegoExpressEngine](https://doc-zh.zego.im/zh/693.html) 原生 Android / iOS SDK 的 ReactNative Wrapper，提供视频直播以及实时音视频服务。仅需4行代码，30分钟即可轻松接入。

了解更多解决方案：[https://www.zego.im](https://www.zego.im)

## 1️⃣ 申请 ZEGO AppID

登录 [ZEGO 官网](https://www.zego.im) 注册账号，根据自身实际业务需求选择场景，获取 AppID 与 AppSign，用于初始化 SDK。

## 2️⃣ 导入 `zego-express-engine-reactnative` (仅支持 react-native >= 0.60)

进入工程根目录并输入：

`npm install zego-express-engine-reactnative --save`

或者

`yarn add zego-express-engine-reactnative`

下一步，在运行 **iOS** 之前，你还需要 `cd` 到 `ios` 目录下，执行以下命令：

`pod install`

现在，你就可以在项目中使用 javascript 或者 typescript(我们推荐使用 typescript) 来集成  `zego-express-engine-reactnative` 了

## 3️⃣ 添加设备权限

### Android

打开 `app/src/main/AndroidManifest.xml` 文件，添加如下内容：

```xml
    <!-- Permissions required by the SDK -->
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <!-- Permissions required by the App -->
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <uses-feature
        android:glEsVersion="0x00020000"
        android:required="true" />

    <uses-feature android:name="android.hardware.camera" />
    <uses-feature android:name="android.hardware.camera.autofocus" />
```

> 请注意：因为 Android 6.0 在一些比较重要的权限上要求必须申请动态权限，不能只通过 `AndroidMainfest.xml` 文件申请静态权限。因此还需要参考执行如下代码

```javascript
import {PermissionsAndroid} from 'react-native';

const granted = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA,
                                        PermissionsAndroid.RECORD_AUDIO);
granted.then((data)=>{

        if(!data) {
            const permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, PermissionsAndroid.PERMISSIONS.CAMERA];
            PermissionsAndroid.requestMultiple(permissions);
        }
    }).catch((err)=>{
    console.log(err.toString());
    })
}
```

### iOS

选择项目 TARGETS -> Info -> Custom iOS Target Properties

![Add iOS Privacy](https://storage.zego.im/sdk-doc/Pics/iOS/ZegoExpressEngine/Common/privacy-description.png)

点击 + 添加按钮，添加摄像头和麦克风权限。

1. `Privacy - Camera Usage Description`

2. `Privacy - Microphone Usage Description`

添加权限完成后如图所示：

![Add iOS Privacy Done](https://storage.zego.im/sdk-doc/Pics/iOS/ZegoExpressEngine/Common/privacy-description-done.png)

## 4️⃣ 初始化 SDK

```javascript
import React, { Component } from 'react';
import ZegoExpressEngine from 'zego-express-engine-reactnative';

export default class App extends Component<{}> {

    componentDidMount() {
        ZegoExpressEngine.createEngine(1234567890, 'abcdefghijklmnopqrstuvwzyv123456789abcdefghijklmnopqrstuvwzyz123').then((engine) => {
            if(engine != undefined)
                console.log("init sdk success");
            else
                console.log("init sdk failed");
        });
    }
}
```

## 5️⃣ FAQ

### 1. 我能使用 0.60 以下的 react-native 版本集成 SDK 吗?

不行。`zego-express-engine-reactnative` 仅支持 0.60 或以上的 react-native 版本。若需使用，请升级你的项目版本。

### 导入 SDK 到工程后，我还需要手动链接 Native Module 吗?

不需要。react-native 从 0.60 版本开始，已支持自动链接 Native Module，因此你**无需**执行以下代码：

`react-native link zego-express-engine-reactnative`
