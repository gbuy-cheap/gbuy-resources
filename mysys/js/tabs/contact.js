var contact = {
    Init: function () {
        $(".mysys").on("click", "#sendMessage", function (e) {
            try {
                $("#sendMessage").addClass("disabled");
                e.preventDefault();
    
                let subject = $("#contactSubject").val(),
                    message = $("#contactMessage").val();
    
                if (subject && message) {
                    $("#divContactMessage").addClass("ms-d-none");
    
                    contact.SendMessage(subject, message, true);
                } else {
                    toast.ShowWarning("Subject and Message cannot be empty.");
                    $("#sendMessage").removeClass("disabled");
                }   
            } catch (error) {
                errorHandler.SendErrorToAdmin(error);
            }
        });
    },
    SendMessage: function (subject, message, showResultToUser = false) {
        return new Promise((resolve, reject) => {
            let contactData = {
                "Subject": subject,
                "Message": message
            }
            chrome.runtime.sendMessage({
                data: contactData,
                type: "m6",
            }, (response) => {
                if (showResultToUser) {
                    if (response?.response?.isSuccess) {
                        toast.ShowMessage(response.response.userMessage);
                    } else {
                        toast.ShowError("Unable to send message.");
                    }
                }
                
                $("#sendMessage").removeClass("disabled");

                if (response?.response?.isSuccess) {
                    resolve(true);
                } else {
                    resolve(false);
                }                
            });
        })
    }
}