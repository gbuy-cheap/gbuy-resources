var errorHandler = {
    Subject: "Extension Error",
    SendErrorToAdmin: async function (error, extraInfo = "") {
        try {
            let userInfo = common.GetUserInfoFromSessionStorage();
            if (userInfo) {
                userInfo = JSON.stringify(userInfo);
            }

            let errorMessage = "";

            if (error?.stack) {
                errorMessage = error?.stack;
            } else if (typeof error === "object") {
                errorMessage = JSON.stringify(error);
            } else {
                errorMessage = error;
            }

            errorMessage += `\nUser: ${userInfo} \nURL: ${window.location.href}`;

            if (extraInfo) {
                errorMessage += `\n${extraInfo}`;
            }

            errorMessage += `\nChrome Version: ${common.GetChromeVersion()}`;

            errorMessage += `\nUTC Datetime: ${new Date().toUTCString()}`;

            let shouldSendErrorMessage = await this.CheckErrorSentTime();

            if (shouldSendErrorMessage) {
                let result = await contact.SendMessage(errorHandler.Subject, errorMessage);

                if (!result) {
                    await errorHandler.AddNewErrorInStorage(errorMessage);
                } else {
                    await errorHandler.SetLastErrorSentTime();
                }
            } else {
                await errorHandler.AddNewErrorInStorage(errorMessage);
            }
        } catch (err) {
            console.log(err);
            contact.SendMessage(errorHandler.Subject, error?.stack ?? error);
        }
    },
    CheckErrorSentTime: async function () {
        let lastErrorSentTime = await errorHandler.GetLastErrorSentTime();
        let currentErrorSentTime = errorHandler.GenerateErrorSentTime();

        return !lastErrorSentTime || lastErrorSentTime != currentErrorSentTime;
    },
    AddNewErrorInStorage: async function (errorMessage) {
        let errors = await this.GetErrorsInStorage();

        if (!errors) {
            errors = new Array();
        }

        errors.push(errorMessage);

        await this.SetErrorsInStorage(errors);
    },
    ResendErrorsToAdmin: async function () {
        let shouldSendErrorMessage = await this.CheckErrorSentTime();
        if (shouldSendErrorMessage) {
            let errors = await this.GetErrorsInStorage();
            if (errors?.length > 0) {
                let result = await contact.SendMessage(errorHandler.Subject, errors.join("\n\n"));
                if (result) {
                    await this.RemoveErrorsInStorage();
                    await this.SetLastErrorSentTime();
                }
            }
        }
    },
    SetErrorsInStorage: async function (errors) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ userErrors: errors }, function () {
                resolve(true);
            });
        });
    },
    GetErrorsInStorage: async function () {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['userErrors'], function (result) {
                resolve(result?.userErrors);
            })
        })
    },
    RemoveErrorsInStorage: async function () {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove(['userErrors'], function () {
                resolve();
            })
        })
    },
    GetLastErrorSentTime: async function () {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['lastErrorSentTime'], function (result) {
                resolve(result?.lastErrorSentTime);
            })
        })
    },
    SetLastErrorSentTime: async function (lastErrorSentTime) {
        return new Promise((resolve, reject) => {
            if (!lastErrorSentTime) {
                lastErrorSentTime = errorHandler.GenerateErrorSentTime();
            }

            chrome.storage.local.set({ lastErrorSentTime: lastErrorSentTime }, function () {
                resolve(true);
            });
        });
    },
    GenerateErrorSentTime: function () {
        let currentDate = new Date();
        return `d${currentDate.getDate()}.h${currentDate.getHours()}`;
    }
}