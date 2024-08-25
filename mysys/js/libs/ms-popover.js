$(document).on("mouseenter", ".show-popup-thumb", function () {
    let offset = $(this).offset();
    let offsetTop = offset.top;
    let offsetLeft = offset.left;
    let width = $(this).width();
    let height = $(this).height();
    let msPopoverHeight, msPopoverTop, msPopoverLeft;

    msPopoverTop = offsetTop - (height / 2);
    msPopoverLeft = offsetLeft + width + 15;

    $(".ms-popover").css("top", msPopoverTop);
    $(".ms-popover").css("left", msPopoverLeft);

    $(".ms-popover img").attr("src", $(this).attr("src"));

    $(".ms-popover").addClass("ms-invisible");
    $(".ms-popover").removeClass("ms-d-none");

    msPopoverHeight = $(".ms-popover").height();

    if ((msPopoverHeight + msPopoverTop) > window.innerHeight) {
        let diff = (msPopoverHeight + msPopoverTop) - window.innerHeight;

        $(".ms-popover").css("top", (msPopoverTop - diff - 50));
        $(".ms-popover").css("left", msPopoverLeft);
    }

    $(".ms-popover").removeClass("ms-invisible");
});

$(document).on("mouseleave", ".ms-product-thumb", function () {
    $(".ms-popover").addClass("ms-d-none");
});