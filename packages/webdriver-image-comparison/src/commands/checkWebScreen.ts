import saveWebScreen from './saveWebScreen.js'
import { executeImageCompare } from '../methods/images.js'
import { checkIsMobile } from '../helpers/utils.js'
import type { ImageCompareOptions, ImageCompareResult } from '../methods/images.interfaces.js'
import type { SaveScreenOptions } from './screen.interfaces.js'
import { screenMethodCompareOptions } from '../helpers/options.js'
import type { InternalCheckScreenMethodOptions } from './check.interfaces.js'

/**
 * Compare an image of the viewport of the screen
 */
export default async function checkWebScreen(
    {
        methods,
        instanceData,
        folders,
        tag,
        checkScreenOptions,
        isNativeContext = false,
        testContext,
    }: InternalCheckScreenMethodOptions
): Promise<ImageCompareResult | number> {
    // 1.  Take the actual screenshot and retrieve the needed data
    const saveScreenOptions: SaveScreenOptions = {
        wic: checkScreenOptions.wic,
        method: {
            disableCSSAnimation: checkScreenOptions.method.disableCSSAnimation,
            enableLayoutTesting: checkScreenOptions.method.enableLayoutTesting,
            hideScrollBars: checkScreenOptions.method.hideScrollBars,
            hideElements: checkScreenOptions.method.hideElements || [],
            removeElements: checkScreenOptions.method.removeElements || [],
            waitForFontsLoaded: checkScreenOptions.method.waitForFontsLoaded,
        },
    }
    const { devicePixelRatio, fileName, isLandscape } = await saveWebScreen({
        methods,
        instanceData,
        folders,
        tag,
        saveScreenOptions,
        isNativeContext,
    })

    // 2a. Determine the compare options
    const methodCompareOptions = screenMethodCompareOptions(checkScreenOptions.method)
    const executeCompareOptions: ImageCompareOptions = {
        devicePixelRatio,
        compareOptions: {
            wic: checkScreenOptions.wic.compareOptions,
            method: methodCompareOptions,
        },
        fileName,
        folderOptions: {
            autoSaveBaseline: checkScreenOptions.wic.autoSaveBaseline,
            actualFolder: folders.actualFolder,
            baselineFolder: folders.baselineFolder,
            diffFolder: folders.diffFolder,
            browserName: instanceData.browserName,
            deviceName: instanceData.deviceName,
            isMobile: checkIsMobile(instanceData.platformName),
            savePerInstance: checkScreenOptions.wic.savePerInstance,
        },
        isAndroidNativeWebScreenshot: instanceData.nativeWebScreenshot,
        isHybridApp: checkScreenOptions.wic.isHybridApp,
        isLandscape,
        platformName: instanceData.platformName,
    }

    // 2b Now execute the compare and return the data
    return executeImageCompare({
        executor: methods.executor,
        isViewPortScreenshot: true,
        isNativeContext,
        options: executeCompareOptions,
        testContext,
    })
}
