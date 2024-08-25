let arbmodal = {
    mysysModal: undefined,
    GetStructure: function (fontsize = "inherit") {
        return "<div class='ms-modal ms-fade' id='mysysModal' tabindex='-1' aria-labelledby='mysysModalLabel' style='z-index:11000;font-size:" + fontsize + ";' aria-hidden='true'>" +
            "<div class='ms-modal-dialog'>" +
            "<div class='ms-bg-light ms-border ms-border-success ms-modal-content ms-rounded'>" +
            "<div class='ms-modal-header ms-px-4'>" +
            "<h5 class='ms-modal-title ms-fw-bold ms-fs-4' id='mysysModalLabel'></h5>" +
            "<button type='button' class='ms-btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
            "</div>" +
            "<div class='ms-modal-body ms-p-4' id='mysysModalBody'>" +
            "<p id='Comment'></p>" +
            "<p id='Comment2'></p>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
    },
    SetHeader: function (header) {
        $('#mysysModal #mysysModalLabel').html(header);
    },
    SetComment: function (comment) {
        $('#mysysModalBody #Comment').html(comment);
    },
    AddComment: function (comment) {
        $('#mysysModalBody #Comment').append(comment);
    },
    SetComment2: function (comment) {
        $('#mysysModalBody #Comment2').html(comment);
    },
    AddComment2: function (comment) {
        $('#mysysModalBody #Comment2').append(comment);
    },
    Show: function () {
        try {
            this.mysysModal = new bootstrap.Modal(document.getElementById('mysysModal'), {
                backdrop: 'static'
            });
            this.mysysModal.show();
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    },
    Hide: function () {
        try {
            if (this.mysysModal) {
                this.mysysModal.hide();
            }
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }
}