const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FIXED_BUILD_GRADLE = [
  "apply plugin: 'com.android.library'",
  "apply plugin: 'kotlin-android'",
  "",
  "def safeExtGet(prop, fallback) {",
  "  return rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback",
  "}",
  "",
  'def googleMobileAdsVersion = "23.6.0"',
  'def googleUmpVersion = "3.1.0"',
  "",
  "def isNewArchitectureEnabled() {",
  '  return project.hasProperty("newArchEnabled") && project.newArchEnabled == "true"',
  "}",
  "",
  "android {",
  '  namespace "io.invertase.googlemobileads"',
  '  compileSdkVersion safeExtGet("compileSdkVersion", 35)',
  "",
  "  defaultConfig {",
  '    minSdkVersion safeExtGet("minSdkVersion", 24)',
  '    targetSdkVersion safeExtGet("targetSdkVersion", 35)',
  "    multiDexEnabled true",
  "    manifestPlaceholders = [",
  '      appJSONGoogleMobileAdsAppID                  : "",',
  '      appJSONGoogleMobileAdsDelayAppMeasurementInit: "false",',
  '      appJSONGoogleMobileAdsOptimizeInitialization : "true",',
  '      appJSONGoogleMobileAdsOptimizeAdLoading      : "true"',
  "    ]",
  '    buildConfigField "boolean", "IS_NEW_ARCHITECTURE_ENABLED", isNewArchitectureEnabled().toString()',
  "  }",
  "",
  "  buildFeatures {",
  "    buildConfig true",
  "  }",
  "",
  "  lint {",
  "    disable 'GradleCompatible'",
  "    abortOnError false",
  "  }",
  "",
  "  compileOptions {",
  "    sourceCompatibility JavaVersion.VERSION_17",
  "    targetCompatibility JavaVersion.VERSION_17",
  "  }",
  "",
  "  kotlinOptions {",
  '    jvmTarget = "17"',
  "  }",
  "",
  "  sourceSets {",
  "    main {",
  "      if (isNewArchitectureEnabled()) {",
  "        java.srcDirs += ['src/newarch']",
  "      } else {",
  "        java.srcDirs += ['src/oldarch']",
  "      }",
  "    }",
  "  }",
  "}",
  "",
  "repositories {",
  "  google()",
  "  mavenCentral()",
  "}",
  "",
  "dependencies {",
  '  implementation("com.google.android.gms:play-services-ads:${googleMobileAdsVersion}")',
  '  api "com.google.android.ump:user-messaging-platform:${googleUmpVersion}"',
  "  //noinspection GradleDynamicVersion",
  "  implementation 'com.facebook.react:react-native:+'",
  "}",
].join('\n') + '\n';

function withFixedGoogleMobileAds(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const buildGradlePath = path.join(
        projectRoot, 'node_modules', 'react-native-google-mobile-ads', 'android', 'build.gradle'
      );
      if (fs.existsSync(buildGradlePath)) {
        fs.writeFileSync(buildGradlePath, FIXED_BUILD_GRADLE, 'utf-8');
        console.log('[withFixedGoogleMobileAds] Replaced build.gradle');
      }
      return cfg;
    },
  ]);
}

module.exports = withFixedGoogleMobileAds;

  
