var toast = {
    Init: function () {
        $("body").append('<div id="mysysToast" class="ms-position-fixed ms-top-25 ms-end-0 ms-p-3" style="z-index: 1000001">' +
            '<div class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">' +
            '<div class="toast-header">' +
            '<div class="ms-bg-primary ms-rounded ms-me-2" style="width:20px;height: 20px;"></div>' +
            '<strong class="ms-me-auto">Header</strong>' +
            '<button type="button" class="ms-btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
            '</div>' +
            '<div class="toast-body">' +
            'Message' +
            '</div>' +
            '</div>' +
            '</div>');
    },
    ShowError: function (message, header = "Error") {
        $("#mysysToast>div.toast, #mysysToast>div>div.toast-header>div").removeClass("ms-bg-primary");
        $("#mysysToast>div.toast, #mysysToast>div>div.toast-header>div").removeClass("ms-bg-warning");
        $("#mysysToast>div.toast, #mysysToast>div>div.toast-header>div").addClass("ms-bg-danger");
        $("#mysysToast > div > div.toast-body").addClass("ms-text-light");
        $("#mysysToast > div > div.toast-body").removeClass("ms-text-dark");

        this.Show(message, header);
    },
    ShowWarning: function (message, header = "Warning") {
        $("#mysysToast>div.toast, #mysysToast>div>div.toast-header>div").removeClass("ms-bg-danger");
        $("#mysysToast>div.toast, #mysysToast>div>div.toast-header>div").removeClass("ms-bg-primary");
        $("#mysysToast>div.toast, #mysysToast>div>div.toast-header>div").addClass("ms-bg-warning");
        $("#mysysToast > div > div.toast-body").addClass("ms-text-dark");
        $("#mysysToast > div > div.toast-body").removeClass("ms-text-light");

        this.Show(message, header);
    },
    ShowMessage: function (message, header = "Info") {
        $("#mysysToast>div.toast, #mysysToast>div>div.toast-header>div").removeClass("ms-bg-danger");
        $("#mysysToast>div.toast, #mysysToast>div>div.toast-header>div").removeClass("ms-bg-warning");
        $("#mysysToast>div.toast, #mysysToast>div>div.toast-header>div").addClass("ms-bg-primary");
        $("#mysysToast > div > div.toast-body").addClass("ms-text-light");
        $("#mysysToast > div > div.toast-body").removeClass("ms-text-dark");

        this.Show(message, header);
    },
    Show: function (message, header) {
        $("#mysysToast>div>div.toast-header>strong").html(header);
        $("#mysysToast>div>div.toast-body").html(message);

        var toastEl = document.querySelector("#mysysToast > .toast");
        var mysysToast = new bootstrap.Toast(toastEl, {
            delay: 60000
        });
        mysysToast.show();
    },
    Exists: function () {
        return $("#mysysToast").length > 0;
    }
}