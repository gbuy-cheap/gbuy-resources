/**
 * Is the service of the {@link ScreenShotButton} which holds the logic for
 * performing the actual screen shot by sending a message to the background.
 */
class ScreenShotService {

    static _DEFAULT_FILE_NAME = "Egrow_Screenshot_";

    /**
     * @param elementSelector
     * @returns {Promise<any>}
     */
    takeScreenShot(elementSelector) {

        const _saveScreenShot = this._saveScreenShot;
        const screenShot = new MessageBackground(MESSAGE_BACKGROUND_ACTIONS.TAKE_SCREEN_SHOT, null, null);

        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage(screenShot, function (response) {
                if (response && response.isSuccess) {

                    const url = response.value.screenshotUrl;
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const image = new Image();

                    image.addEventListener('load', function () {

                        const scale = window.devicePixelRatio;
                        const scrolledY = $(window).scrollTop();
                        const offset = $(elementSelector).offset();
                        const sourceX = offset.left * scale;
                        const sourceY = (offset.top - scrolledY) * scale;
                        const width = $(elementSelector).width() * scale;
                        const height = $(elementSelector).height() * scale;

                        canvas.width = width;
                        canvas.height = height;
                        context.drawImage(image, sourceX, sourceY, width, height, 0, 0, width, height);

                        const dataUrl = canvas.toDataURL('image/jpg');
                        const fileName = ContentServices.fileNameService.getFileName(ScreenShotService._DEFAULT_FILE_NAME, ".jpg");

                        _saveScreenShot(dataUrl, fileName);
                        resolve();
                    }, false);
                    image.src = url;
                } else {
                    console.debug("Screenshot could not be generated in the background!", response);
                    reject();
                }
            });
        })
    }

    _saveScreenShot(dataUrl, filename) {

        const link = document.createElement('a');

        if (typeof link.download === 'string') {

            link.href = dataUrl;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(dataUrl);
        }
    }
}
