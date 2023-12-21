import { browser, expect } from '@wdio/globals'
import { fileExists } from '../helpers/fileExists.ts'

describe('wdio-image-comparison-service check that multi remote is working', () => {
    const resolution = '1366x768'

    beforeEach(async () => {
        await multiremotebrowser.chromeBrowserOne.url('')
        await multiremotebrowser.chromeBrowserOne.pause(500)

        await multiremotebrowser.chromeBrowserTwo.url('')
        await multiremotebrowser.chromeBrowserTwo.pause(500)
    })

    // Chrome remembers the last postion when the url is loaded again, this will reset it.
    afterEach(async () => {
        await multiremotebrowser.chromeBrowserOne.execute(
            'window.scrollTo(0, 0);',
            []
        )
        await multiremotebrowser.chromeBrowserTwo.execute(
            'window.scrollTo(0, 0);',
            []
        )
    })

    it('take a screenshot of each browser', async () => {
        const tag = 'homepage'
        const imageDataOne =
            await multiremotebrowser.chromeBrowserOne.saveScreen(tag)
        const imageDataTwo =
            await multiremotebrowser.chromeBrowserTwo.saveScreen(tag)

        const logNameOne =
            'wdio-ics:options' in
            multiremotebrowser.chromeBrowserOne.capabilities
                ? multiremotebrowser.chromeBrowserOne.capabilities[
                    'wdio-ics:options'
                // @ts-ignore
                ]?.logName
                : ''
        const filePathOne = `${imageDataOne.path}/${tag}-${logNameOne}-${resolution}.png`

        expect(fileExists(filePathOne)).toBe(true)

        const logNameTwo =
            'wdio-ics:options' in
            multiremotebrowser.chromeBrowserTwo.capabilities
                ? multiremotebrowser.chromeBrowserTwo.capabilities[
                    'wdio-ics:options'
                // @ts-ignore
                ]?.logName
                : ''
        const filePathTwo = `${imageDataTwo.path}/${tag}-${logNameTwo}-${resolution}.png`

        expect(fileExists(filePathTwo)).toBe(true)
    })

    it('take a screenshot of each browser using the global browser', async () => {
        const tag = 'homepage-multi'
        const imageDatas = await browser.saveScreen(tag)

        // Result is
        // [0-0] imageDatas =  {
        // [0-0]   chromeBrowserOne: Promise { <pending> },
        // [0-0]   chromeBrowserTwo: Promise { <pending> }
        // [0-0] }

        for (const [browserName, imageData] of Object.entries(imageDatas)) {
            // @ts-ignore
            const logName =
                // @ts-ignore
                'wdio-ics:options' in global[browserName].capabilities
                    ? // @ts-ignore
                    global[browserName].capabilities['wdio-ics:options']
                        ?.logName
                    : ''
            const filePath = `${imageData.path}/${tag}-${logName}-${resolution}.png`

            expect(fileExists(filePath)).toBe(true)
        }
    })
})