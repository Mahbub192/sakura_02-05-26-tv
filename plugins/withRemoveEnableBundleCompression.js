const { withAppBuildGradle } = require('expo/config-plugins');

/**
 * Removes the enableBundleCompression line from the react {} block in app/build.gradle.
 * React Native 0.74+ removed this property from ReactExtension, so the line causes build failure.
 */
function withRemoveEnableBundleCompression(config) {
  return withAppBuildGradle(config, (cfg) => {
    let contents = cfg.modResults.contents;
    // Remove enableBundleCompression line (RN 0.74+ removed this from ReactExtension)
    contents = contents.replace(
      /^\s*enableBundleCompression\s*=\s*.+$/gm,
      ''
    );
    cfg.modResults.contents = contents;
    return cfg;
  });
}

module.exports = withRemoveEnableBundleCompression;
