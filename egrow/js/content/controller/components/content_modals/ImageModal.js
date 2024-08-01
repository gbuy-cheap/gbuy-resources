/**
 * It represents the modal which holds the image, price and reviews of the
 * product. It is displayed as soon as a user hovers over the title column.
 */
class ImageModal extends ContentModal {
    constructor () {
        super("#imageModal");
    }

    hide () {
        $(this.selector).hide();
    }

    display (imageCode, title, price, reviews) {
        const imageModal = $(this.selector);

        const imageDiv = $(".product-image", imageModal);
        this._setImage(imageDiv, imageCode);

        const modalBody = $(".egrow-user-modal-body", imageModal);
        modalBody.html(title + price + reviews);

        super.display();
    }

    /**
     *
     * @param { jQuery } imageElement
     * @param { string } imageCode
     * @private
     */
    _setImage(imageElement, imageCode) {
        if (null != imageCode) {
            imageElement.html('');
            imageElement.css("background-image", "url(" + "https://images-na.ssl-images-amazon.com/images/I/" + imageCode + "._SL250_.jpg" + ")");
        } else {
            imageElement.css("background-image", "");
            imageElement.html(`<i class="fas fa-file-image image-placeholder"></i>`);
        }
    }
}
