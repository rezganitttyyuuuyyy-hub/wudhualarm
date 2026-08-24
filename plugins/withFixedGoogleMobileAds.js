const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FIXED_BUILD_GRADLE = `
apply plugin: 'com.android.library'
apply plugin: 'kotlin-android'

def safeExtGet(prop, fallback) {
    return rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback
}

def googleMobileAdsVersion = "23.6.0"
def googleUmpVersion = "3.1.0"

def isNewArchitectureEnabled() {
    return project.hasProperty("newArchEnabled") && project.newArchEnabled == "true"
}

android {
    namespace "io.invertase.googlemobileads"
    compileSdkVersion safeExtGet("compileSdkVersion", 35)

    defaultConfig {
        minSdkVersion safeExtGet("minSdkVersion", 24)
        targetSdkVersion safeExtGet("targetSdkVersion", 35)
        multiDexEnabled true
        
        buildConfigField "boolean", "IS_NEW_ARCHITECTURE_ENABLED", "false"
        buildConfigField "String", "GOOGLE_MOBILE_ADS_JSON_RAW", "{}"
    }

    buildFeatures {
        buildConfig true
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

repositories {
    google()
    mavenCentral()
}

dependencies {
    implementation "com.google.android.gms:play-services-ads:\${googleMobileAdsVersion}"
    implementation "com.google.android.ump:user-messaging-platform:\${googleUmpVersion}"
    implementation 'com.facebook.react:react-native:+'
}
`;

function withFixedGoogleMobileAds(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const buildGradlePath = path.join(
        projectRoot,
        'node_modules',
        'react-native-google-mobile-ads',
        'android',
        'build.gradle'
      );

      if (fs.existsSync(buildGradlePath)) {
        fs.writeFileSync(buildGradlePath, FIXED_BUILD_GRADLE, 'utf-8');
        console.log('[withFixedGoogleMobileAds] Successfully patched build.gradle');
      }

      return cfg;
    },
  ]);
}

module.exports = withFixedGoogleMobileAds;
