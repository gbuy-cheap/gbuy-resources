'use strict';

var extContent = {
    Init: function () {
        return '<div class="mysys ms-my-2 ms-border ms-rounded ms-border-success ms-bg-light" id="mysc-main-div">' +
            '<div id="main-content">' +
            this.CommonModal() +
            this.TopPanel() +
            this.Header() +
            this.MainContent() +
            this.UserTypeInfo() +
            this.Footer() +
            '</div>' +
            this.MainWarning() +
            '</div>';
    },
    CommonModal: function () {
        return '<div class="ms-modal mysys" id="commonModal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="commonModalLabel" aria-hidden="true">' +
            "<div class='ms-modal-dialog ms-p-5 ms-modal-fullscreen'>" +
            '<div class="ms-modal-content ms-bg-light ms-shadow" style="min-height: 650px;">' +
            "<div class='ms-modal-header ms-bg-light-yellow ms-border-yellow ms-px-3'>" +
            "<div><div class='ms-spinner-border ms-spinner-border-sm ms-invisible' role='status'></div></div>" +
            "<div>" +
            "<h5 class='ms-modal-title ms-d-flex ms-align-items-center ms-my-0' id='commonModalLabel'>" +
            "<img src='" + chrome.runtime.getURL('images/favicon.png') + "' class='ms-d-inline ms-me-2' style='width:27px;'>" +
            "<span>MySYS Extension</span>" +
            "</h5>" +
            "</div>" +
            "<div class='ms-d-flex ms-align-items-center'>" +
            "<button id='commonModalCloseBtn' type='button' class='ms-btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
            "</div>" +
            "</div>" +
            "<div class='ms-modal-body'>" +
            '<div class="ms-px-3">' +
            '<div class="ms-col-6">' +
            '<div class="ms-alert ms-alert-info ms-d-none" id="modalUserMessage"></div>' +
            '</div>' +
            '</div>' +
            "</div>" +
            "<div class='ms-modal-footer ms-justify-content-center'>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
    },
    TopPanel: function () {
        return '<div id="topPanel" class="ms-my-1 ms-mx-1 ms-row ms-align-items-center">' +
            '<div class="ms-col-6 ms-text-end ms-ps-1">' +
            '<div class="minmaxBtn ms-float-start">' +
            icons.MinimizeIcon("ms-float-start ms-me-2") +
            '</div>' +
            '<div class="ms-spinner-border ms-spinner-border-sm ms-float-start" role="status"></div>' +
            '<span id="spMeltable" class="">' +
            '</span>' +
            '<span id="spEligible" class="ms-ms-2">' +
            '</span>' +
            '<span id="spHazmat" class="ms-ms-2">' +
            '</span>' +
            '<span id="spReqApproval" class="ms-ms-2">' +
            '</span>' +
            '<span id="spShopSell" class="ms-ms-2">' +
            '</span>' +
            '<span id="spProductAlert" class="ms-ms-3">' +
            '<svg id="svgProductAlert" tabindex="0" data-bs-toggle="popover" data-bs-placement="top" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-d-none pointer ms-text-danger blink" viewBox="0 0 16 16">' +
            '<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
            '</svg>' +
            '</span>' +
            '</div>' +
            '<div class="ms-align-items-center ms-col-6 ms-d-flex ms-justify-content-between ms-p-0">' +
            '<span id="spWlItem" class="ms-me-1">' +
            '<abbr title="This product has been added to your wishlist.">' +
            '</abbr>' +
            '</span>' +
            '<a id="listOnEbay" class="ms-btn ms-btn-outline-dark ms-me-1 ms-text-decoration-none mys-tooltip ms-fw-bold ms-d-none" target="_blank" rel="noopener noreferrer">' +
            '<span class="ms-text-danger">e</span><span class="ms-text-primary">B</span><span class="ms-text-warning">a</span><span class="ms-text-success">y</span>' +
            '<span class="mys-tooltiptext" style="min-width:90px;margin-left: 12px;margin-top: -5px;">List on eBay</span>' +
            '</a>' +
            '<a href="https://mysys.com/" target="_blank" rel="noreferrer noopener" class="ms-pe-1">' +
            '<img id="logo-header" src="' + chrome.runtime.getURL('images/logo.png') + '">' +
            '</a>' +
            '</div>' +
            '</div>';
    },
    Header: function () {
        return '<header id="mysc-header" class="ms-px-1 ms-top-0 ms-d-flex ms-justify-content-between">' +
            '<ul class="ms-nav ms-nav-tabs ms-ms-0 ms-w-100 ms-fs-6 ms-px-0 ms-mb-1" id="mysysTab" role="tablist">' +
            '<li class="ms-nav-item" role="presentation"  tabindex="0"><a class="mys-tooltip ms-nav-link ms-p-1 active ms-d-flex ms-align-items-center pointer" id="calc-tab" data-bs-toggle="tab" href="#calc" role="tab" aria-controls="calc" aria-selected="true">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="ms-me-2px tab-icon" viewBox="0 0 16 16">' +
            '<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zm0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-1z" />' +
            '</svg><span class="tab-header-text">Calculator</span></a></li>' +
            '<li class="ms-nav-item" role="presentation"  tabindex="0" ><a class="mys-tooltip ms-nav-link ms-p-1 ms-d-flex ms-align-items-center pointer" id="stockChecker-tab" data-bs-toggle="tab" href="#stockChecker" role="tab" aria-controls="stockChecker" aria-selected="false">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="ms-me-2px tab-icon" viewBox="0 0 16 16">' +
            '<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />' +
            '</svg><span class="tab-header-text">Stocks</span></a></li>' +
            '<li class="ms-nav-item" role="presentation"  tabindex="0"><a class="mys-tooltip ms-nav-link ms-p-1 ms-d-flex pointer" id="marketplaces-tab" data-bs-toggle="tab" href="#marketplaces" role="tab" aria-controls="marketplaces" aria-selected="false">' +
            '<svg xmlns="http://www.w3.org/2000/svg" class="ms-me-2px tab-icon" fill="currentColor" viewBox="0 0 16 16" >' +
            '<path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z" />' +
            '</svg><span class="tab-header-text">Marketplaces</span></a></li>' +
            '<li class="ms-nav-item" role="presentation"  tabindex="0"><a class="mys-tooltip ms-nav-link ms-p-1 ms-d-flex ms-align-items-center pointer" id="wishlist-tab" data-bs-toggle="tab" href="#wishlist" role="tab" aria-controls="wishlist" aria-selected="false">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="ms-me-2px tab-icon" viewBox="0 0 16 16">' +
            '<path fill-rule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>' +
            '<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>' +
            '</svg><span class="tab-header-text">Wishlist</span></a></li>' +
            '<li class="ms-nav-item" role="presentation"  tabindex="0"><a class="mys-tooltip ms-nav-link ms-p-1 ms-d-flex ms-align-items-center pointer" id="variations-tab" data-bs-toggle="tab" href="#variations" role="tab" aria-controls="variations" aria-selected="false">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="ms-me-2px tab-icon" viewBox="0 0 16 16">' +
            '<path fill-rule="evenodd" d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5v-1zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"/>' +
            '<path d="M6 4.5H1.866a1 1 0 1 0 0 1h2.668A6.517 6.517 0 0 0 1.814 9H2.5c.123 0 .244.015.358.043a5.517 5.517 0 0 1 3.185-3.185A1.503 1.503 0 0 1 6 5.5v-1zm3.957 1.358A1.5 1.5 0 0 0 10 5.5v-1h4.134a1 1 0 1 1 0 1h-2.668a6.517 6.517 0 0 1 2.72 3.5H13.5c-.123 0-.243.015-.358.043a5.517 5.517 0 0 0-3.185-3.185z"/>' +
            '</svg><span class="tab-header-text">Variations</span></a></li>' +
            '<li class="ms-nav-item" role="presentation"  tabindex="0"><a class="mys-tooltip ms-nav-link ms-p-1 pointer" id="settings-tab" data-bs-toggle="tab" href="#settings" role="tab" aria-controls="settings" aria-selected="false">' +
            '<svg xmlns="http://www.w3.org/2000/svg" class="tab-header-text tab-icon" fill="currentColor" viewBox="0 0 16 16">' +
            '<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />' +
            '<path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />' +
            '</svg></a></li>' +
            '<li class="ms-nav-item" role="presentation"  tabindex="0"><a class="mys-tooltip ms-nav-link ms-p-1 pointer" id="contact-tab" data-bs-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">' +
            '<svg xmlns="http://www.w3.org/2000/svg" class="tab-header-text tab-icon" fill="currentColor" viewBox="0 0 16 16">' +
            '<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>' +
            '</svg></a></li>' +
            '</ul>' +
            '</header>';
    },
    MainWarning: function () {
        return '<main id="main-warning" class="ms-container ms-py-0 ms-fs-4 ms-fw-bold ms-text-left ms-d-none">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="minmaxBtn ms-float-start ms-mt-2" viewBox="0 0 16 16">' +
            '<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>' +
            '<path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"></path>' +
            '</svg>' +
            '<div class="ms-row ms-d-flex ms-justify-content-end">' +
            '<img class="logo-warning" src="' + chrome.runtime.getURL('images/logo.png') + '">' +
            '</div>' +
            '<div id="divWarningMessage" class="ms-row ms-my-5 ms-pt-1 ms-d-none">' +
            '<div class="ms-col-12 ms-text-center ms-d-flex ms-justify-content-center ms-align-items-center">' +
            '<span id="spMainWarningMessage"></span>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mx-auto ms-d-flex ms-justify-content-center">' +
            '<div class="ms-col-10">' +
            '<div class="accordion ms-mb-2" id="accordionAuth">' +
            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingLogin">' +
            '<button class="ms-accordion-button  ms-text-light" type="button" data-bs-toggle="collapse"' +
            'data-bs-target="#collapseLogin" aria-expanded="true" aria-controls="collapseLogin">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke="currentColor" width="18px">' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />' +
            '</svg>' +
            '&nbsp;Log In' +
            '</button>' +
            '</h5>' +
            '<div id="collapseLogin" class="ms-accordion-collapse ms-collapse show" aria-labelledby="headingLogin"' +
            'data-bs-parent="#accordionAuth">' +
            '<div class="ms-accordion-body">' +
            '<form method="POST" id="form-login" class="ms-m-0">' +
            '<input class="ms-shadow-none ms-m-0 ms-form-control ms-mb-1" name="email" type="email" placeholder="E-mail"' +
            'required>' +
            '<input class="ms-shadow-none ms-m-0 ms-form-control ms-mb-1" name="password" type="password"' +
            'placeholder="Password" required>' +
            '<button class="ms-form-control ms-btn ms-btn-secondary" type="submit">' +
            'Log In' +
            '</button>' +
            '</form>' +
            '<div class="ms-text-end ms-mt-1">' +
            '<a class="link-danger pointer ms-fs-6" id="btnForgotPassword">Forgot Password</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingSignUp">' +
            '<button class="ms-accordion-button  collapsed ms-text-light" type="button"' +
            'data-bs-toggle="collapse" data-bs-target="#collapseSignUp" aria-expanded="false"' +
            'aria-controls="collapseSignUp">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke="currentColor" width="18px">' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />' +
            '</svg>' +
            '&nbsp;Sign Up' +
            '</button>' +
            '</h5>' +
            '<div id="collapseSignUp" class="ms-accordion-collapse ms-collapse" aria-labelledby="headingSignUp"' +
            'data-bs-parent="#accordionAuth">' +
            '<div class="ms-accordion-body">' +
            '<form class="" action="" method="post" id="form-signup">' +
            '<input class="ms-shadow-none ms-m-0 ms-form-control ms-mb-1" name="email" type="email" placeholder="E-mail" maxlength="150" ' +
            'required>' +
            '<input class="ms-shadow-none ms-m-0 ms-form-control ms-mb-1" name="name" type="text" placeholder="Name" maxlength="100" ' +
            'required>' +
            '<input class="ms-shadow-none ms-m-0 ms-form-control ms-mb-1" name="phone" type="text" placeholder="Phone" maxlength="20" ' +
            'required>' +
            '<input class="ms-shadow-none ms-m-0 ms-form-control ms-mb-1" name="password" type="password" maxlength="100" ' +
            'placeholder="Password" required>' +
            '<input class="ms-shadow-none ms-m-0 ms-form-control ms-mb-1" name="confirmpassword" type="password" maxlength="100" ' +
            'placeholder="Confirm Password" required>' +
            '<button class="ms-form-control ms-btn ms-btn-secondary" type="submit">' +
            'Register' +
            '</button>' +
            '</form>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-10 ms-fs-7">' +
            '<span class="ms-text-danger" id="spWarningAuthMessage"></span>' +
            '</div>' +
            '</div>' +
            '</main>';
    },
    Footer: function () {
        return '<footer id="mysc-footer" class="ms-border-top ms-bottom-0 ms-px-3">' +
            '<div class="mysysFooter">' +
            '</div>' +
            '</footer>';
    },
    MainContent: function () {
        return '<div class="ms-tab-content" id="mysysTabContent">' +
            this.Calculator() +
            this.StockChecker() +
            this.Marketplaces() +
            this.Wishlist() +
            this.Variations() +
            this.Settings() +
            this.Contact() +
            '</div>';
    },
    Calculator: function () {
        return '<main id="calc" class="ms-py-2 ms-tab-pane ms-fade show active" role="tabpanel" aria-labelledby="calc-tab">' +
            '<section class="ms-mx-3">' +
            '<div class="ms-row">' +
            '<div class="ms-col-4"><span class="ms-text-info ms-fw-bold ms-text-uppercase" id="spCategory"' +
            'data-container="true">Category</span></div>' +
            '<div class="ms-col-4">' +
            '<span class="ms-text-info ms-fw-bold">BSR: <span id="spBSR" data-container="true"></span>' +
            '</span>' +
            '</div>' +
            '<div class="ms-col-4">' +
            '<span class="ms-text-info ms-fw-bold">TOP: <span id="spTOP" data-container="true"></span>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-text-secondary ms-fw-bold ms-fs-6">' +
            '<div class="ms-col-4">' +
            '<input type="hidden" id="hidEstMonthlySales">' +
            '<span>' +
            '<span id="spMoSalesLabel">Mo. Sales:&nbsp;</span>' +
            '<span id="spEstSales" data-container="true"></span>' +
            '&nbsp;<span id="spEstSalesWarn" class="ms-d-none ms-text-warning mys-tooltip help">(!)' +
            '<span class="mys-tooltiptext mys-tooltip-bottom" style="margin-left: -98px;">The product is a variant product. All products in this variant share this sales amount.<br>You can calculate the Mo.Sales distribution from the Variations tab.</span></span>' +
            '</span>' +
            '</div>' +
            '<div class="ms-col-4">' +
            '<span>' +
            '<span >My Mo.Sales:&nbsp;</span>' +
            '<span id="spMyEstSales" data-container="true"></span>' +
            '</span>' +
            '</div>' +
            '<div class="ms-col-4">' +
            '<span>Revenue:&nbsp;</span>' +
            '<span class="currency"></span>&nbsp;' +
            '<span id="spEstRevenue" data-container="true"></span>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row"><span class="ms-text-danger ms-text-decoration-underline ms-fs-6" id="spUserWarning"></span>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-4"><span class="ms-text-primary ms-d-none">Forecast</span></span></div>' +
            '<div class="ms-col-4 ms-text-primary ms-fs-6 ms-fw-bold">FBM (<span id="spFBMOffers" data-container="true">-</span>&nbsp;Offers)</div>' +
            '<div class="ms-col-4 ms-text-primary ms-fs-6 ms-fw-bold">FBA (<span id="spFBAOffers" data-container="true">-</span>&nbsp;Offers)</div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-4 ms-d-flex ms-align-items-center"><span class="ms-text-dark">Sell Price</span></div>' +
            '<div class="ms-col-4">' +
            '<div class="ms-input-group ms-d-flex ms-pe-1">' +
            '<span class="ms-input-group-text currency" id="basic-addon1">$</span>' +
            '<input id="fbmSellInput" type="number" class="ms-form-control border-gray" aria-describedby="basic-addon1" value="0.00" step="0.10" min="0">' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-4">' +
            '<div class="ms-input-group ms-d-flex ms-pe-1">' +
            '<span class="ms-input-group-text currency" id="basic-addon2">$</span>' +
            '<input id="fbaSellInput" type="number" class="ms-form-control border-gray" aria-describedby="basic-addon2" value="0.00" step="0.10" min="0">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-4 ms-d-flex ms-align-items-center"><span class="ms-text-dark">Buy Cost</span></div>' +
            '<div class="ms-col-4">' +
            '<div class="ms-input-group ms-d-flex ms-pe-1">' +
            '<span class="ms-input-group-text currency" id="basic-addon1">$</span>' +
            '<input type="number" id="fbmBuyInput" class="ms-form-control border-gray"' +
            'aria-describedby="basic-addon1" value="0.00" step="0.10" min="0">' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-4">' +
            '<div class="ms-input-group ms-d-flex ms-pe-1">' +
            '<span class="ms-input-group-text currency" id="basic-addon2">$</span>' +
            '<input type="number" id="fbaBuyInput" class="ms-form-control border-gray" aria-describedby="basic-addon2" value="0.00" step="0.10" min="0">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-text-success ms-fs-5 ms-fst-italic ms-fw-bold">' +
            '<div class="ms-col-4"><span>Profit</span></div>' +
            '<div class="ms-col-4"><span class="currency"></span>&nbsp;<span id="spFBMProfit" data-container="true"></span>' +
            '<svg id="svgFBMProfitInfo" data-bs-toggle="popover" data-bs-placement="left"' +
            'xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"' +
            'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
            'class="pointer ms-ms-1">' +
            '<circle cx="12" cy="12" r="10"></circle>' +
            '<line x1="12" y1="16" x2="12" y2="12"></line>' +
            '<line x1="12" y1="8" x2="12.01" y2="8"></line>' +
            '</svg>' +
            '</div>' +
            '<div class="ms-col-4"><span class="currency"></span>&nbsp;<span id="spFBAProfit" data-container="true"></span>' +
            '<svg id="svgFBAProfitInfo" data-bs-toggle="popover" data-bs-placement="left"' +
            'xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"' +
            'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
            'class="pointer ms-ms-1">' +
            '<circle cx="12" cy="12" r="10"></circle>' +
            '<line x1="12" y1="16" x2="12" y2="12"></line>' +
            '<line x1="12" y1="8" x2="12.01" y2="8"></line>' +
            '</svg>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-text-success ms-fs-5 ms-fst-italic ms-fw-bold">' +
            '<div class="ms-col-4"><span>ROI</span></div>' +
            '<div class="ms-col-4"><span id="spFBMROI" data-container="true"></span></div>' +
            '<div class="ms-col-4"><span id="spFBAROI" data-container="true"></span></div>' +
            '</div>' +
            '<div class="ms-row ms-text-success ms-fs-5 ms-fst-italic ms-fw-bold">' +
            '<div class="ms-col-4"><span>MARGIN</span></div>' +
            '<div class="ms-col-4"><span id="spFBMMargin" data-container="true"></span></div>' +
            '<div class="ms-col-4"><span id="spFBAMargin" data-container="true"></span></div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-4">Lowest <span class="currency">$</span></div>' +
            '<div class="ms-col-4"><span class="currency">$</span>&nbsp;<span id="spLowest" data-container="true"></span>' +
            '</div>' +
            '</div>' +
            '</section>' +
            '<section id="secHistoricalSalesData" class="ms-mx-3 ms-my-1 ms-fs-6">' +
            '<div class="ms-container-fluid my-table ms-bg-light">' +
            '<div class="ms-row ms-fw-bold">' +
            '<div tabindex="0" class="ms-col-4 ms-p-0 ms-link-primary pointer" id="salesDataHistory" data-bs-toggle="popover" data-bs-placement="bottom">Historical Sales Data</div>' +
            '<div class="ms-col-3 ms-text-end">30 Day</div>' +
            '<div class="ms-col-3 ms-text-end">90 Day</div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-4 ms-p-0 ms-fw-bold">Sales Rank</div>' +
            '<div class="ms-col-3 ms-text-end"><span id="spSalesRank30"></span></div>' +
            '<div class="ms-col-3 ms-text-end"><span id="spSalesRank90"></span></div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-4 ms-p-0 ms-fw-bold">Sales Rank Drops</div>' +
            '<div class="ms-col-3 ms-text-end"><span id="spSalesRankDrops30"></span></div>' +
            '<div class="ms-col-3 ms-text-end"><span id="spSalesRankDrops90"></span></div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-4 ms-p-0 ms-fw-bold">New Price</div>' +
            '<div class="ms-col-3 ms-text-end"><span class="currency"></span>&nbsp;<span id="spNewPrice30"></span></div>' +
            '<div class="ms-col-3 ms-text-end"><span class="currency"></span>&nbsp;<span id="spNewPrice90"></span></div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-4 ms-p-0 ms-fw-bold">Amazon Price</div>' +
            '<div class="ms-col-3 ms-text-end"><span class="currency"></span>&nbsp;<span id="spAmazonPrice30"></span></div>' +
            '<div class="ms-col-3 ms-text-end"><span class="currency"></span>&nbsp;<span id="spAmazonPrice90"></span></div>' +
            '</div>' +
            '</div>' +
            '</section>' +
            '<section class="ms-mx-3 ms-fs-6">' +
            '<div class="ms-row">' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">Brand:&nbsp;</span>' +
            '<span id="spBrand" data-container="true"></span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">Dim:&nbsp;</span>' +
            '<span id="spDim" data-container="true"></span>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">Model:&nbsp;</span>' +
            '<span id="spModel" style="word-break: break-word;" data-container="true"></span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">Weight:&nbsp;</span>' +
            '<span id="spWeight" data-container="true"></span>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">Mfr.:&nbsp;</span>' +
            '<span id="spMfr" data-container="true"></span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">Chargeable wgt.&nbsp;</span>' +
            '<span id="spShipWgt" data-container="true"></span>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">ASIN:&nbsp;</span>' +
            '<span id="spASIN" data-container="true"></span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold" data-container="true" id="spSizeTier"></span>' +
            '<input type="hidden" id="hiddenSizeTierId"></input>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row">' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">Parent:&nbsp;</span>' +
            '<span id="spParent" data-container="true"></span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">Buybox:&nbsp;</span>' +
            '<span id="spBuybox" data-container="true" style="sword-break: break-word;"></span>' +
            '</div>' +
            '</div>' +
            '<div id="divBarcodes" class="ms-row ms-d-none">' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">EAN:&nbsp;</span>' +
            '<span id="spEAN" data-container="true"></span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<span class="ms-fw-bold">UPC:&nbsp;</span>' +
            '<span id="spUPC" data-container="true"></span>' +
            '</div>' +
            '</div>' +
            '</section>' +
            '</main>';
    },
    StockChecker: function () {
        return '<main id="stockChecker" class="ms-tab-pane ms-fade" role="tabpanel" aria-labelledby="stockChecker-tab">' +
            '<section class="ms-container ms-py-1 ms-w-100">' +
            '<div class="ms-row ms-pb-2">' +
            '<div class="ms-col-6 ms-row">' +
            '<div class="ms-col-12 ms-px-0 ms-d-flex ms-justify-content-end ms-align-items-center">' +
            '<label class="ms-small-text ms-me-1" for="minRating">Min Rating #</label>' +
            '<input type="text" class="ms-form-control ms-form-control-xs" id="minRating" value="1000" style="max-width:100px;">' +
            '</div>' +
            '<div class="ms-col-12 ms-px-0 ms-d-flex ms-justify-content-end ms-align-items-center">' +
            '<label class="ms-small-text ms-me-1" for="minFBack">Min Feedback %</label>' +
            '<input type="text" id="minFBack" class="ms-form-control ms-form-control-xs" value="95" style="max-width:100px;">' +
            '</div>' +
            '</div>' +
            '<div class="ms-border-end ms-col-3 ms-d-flex ms-px-2">' +
            '<a class="ms-align-items-center ms-btn ms-btn-primary ms-btn-xs ms-d-flex ms-h-100 ms-justify-content-center ms-me-1 ms-text-decoration-none" id="getStockFBA">Filtered & FBA Stocks</a>' +
            '<a class="ms-btn ms-btn-primary ms-btn-xs ms-h-100 ms-d-flex ms-justify-content-center ms-align-items-center ms-text-decoration-none" id="getStockAll">All Stocks</a>' +
            '</div>' +
            '<div class="ms-align-items-baseline ms-col ms-d-flex ms-justify-content-between ms-ps-1">' +
            '<a class="ms-btn ms-btn-success ms-btn-xs ms-h-100 ms-d-flex ms-justify-content-center ms-align-items-center ms-text-decoration-none ms-text-light ms-me-1 ms-w-100" id="buyboxStats" style="max-width:65px;">Buybox<br>Statistics</a>' +

            '<span class="mys-tooltip ms-align-self-end">' +
            '<svg id="svgExportStocksToExcel" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="ms-bg-white ms-border ms-p-1 pointer ms-rounded" viewBox="0 0 16 16">' +
            '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h3v1a1 1 0 0 1-1 1h-2zm3-3h-3v-2h3v2zm-7 0v-2h3v2H6z" />' +
            '</svg>' +
            '<span class="mys-tooltip-top mys-tooltiptext" style="min-width: 116px;">Export</span>' +
            '</span>' +

            '<svg xmlns="http://www.w3.org/2000/svg" id="openStockModal" width="16" height="16" fill="currentColor" class="ms-align-self-end pointer ms-mb-1" viewBox="0 0 16 16" data-bs-toggle="modal" data-bs-target="#commonModal"> ' +
            '<path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z">' +
            '</path></svg>' +
            '</div>' +
            '</div>' +
            '<div id="stockGrid" class="ag-theme-balham"></div>' +
            '<div class="ms-py-1 ms-fs-6 ms-row">' +
            '<div class="ms-col-12 ms-d-flex stock-filter ms-justify-content-center">' +
            '<a id="stockAmzFilter" class="ms-me-1 ms-d-flex ms-align-items-center ms-justify-content-center col ms-btn ms-btn-outline-orange ms-text-decoration-none">Amazon</a>' +
            '<a id="stockFBAFilter" class="ms-mx-1 ms-d-flex ms-align-items-center ms-justify-content-center col ms-btn ms-btn-outline-light-blue ms-text-decoration-none">FBA</a>' +
            '<a id="stockLowestFilter" class="ms-mx-1 ms-d-flex ms-align-items-center ms-justify-content-center col ms-btn ms-btn-outline-danger ms-text-decoration-none">Lowest</a>' +
            '<a id="stockResetFilter" class="ms-ms-1 ms-d-flex ms-align-items-center ms-justify-content-center col ms-btn ms-btn-outline-dark ms-text-decoration-none">All</a>' +
            '</div>' +
            '</div>' +
            '</section>' +
            '</main>';
    },
    Variations: function () {
        return '<main id="variations" class="ms-tab-pane ms-fade" role="tabpanel" aria-labelledby="variations-tab">' +
            '<section class="ms-container ms-py-1 ms-w-100 ms-fs-6">' +
            '<div class="ms-fw-bold ms-justify-content-around ms-mt-2 ms-row ms-d-none">No variations found...</div>' +

            '<div class="ms-row ms-justify-content-between ms-mt-1">' +
            '<div class="ms-col-auto"><span class="ms-fw-bold">Total reviews:</span><span id="spTotalRevs" class="ms-ms-1"></span></div>' +
            '<div class="ms-col-auto"><span class="ms-fw-bold">Avg. Rank:<span id="spAvgRank" class="ms-ms-1"></span>&nbsp;in&nbsp;<span id="spVarCat"></span> </span></div>' +
            '</div>' +
            '<div class="ms-row ms-justify-content-between ms-mt-1">' +
            '<div class="ms-col-auto"><span class="ms-fw-bold">Parent ASIN:</span><span id="spParentASIN" class="ms-ms-1"></span></div>' +
            '<div class="ms-col-auto"><span class="ms-fw-bold">Average Price:</span><span class="ms-ms-1 currency"></span>&nbsp;<span id="spAvgPrice"></span></div>' +
            '</div>' +
            '<div id="divRevGrids" class="ms-row ms-mt-1">' +
            '<div class="ms-col-6">' +
            '<a id="summaryOfRevs" class="ms-link-primary ms-text-decoration-none" data-bs-toggle="collapse" href="#collapseRevSummary" role="button" aria-expanded="false" aria-controls="collapseRevSummary">' +
            'Summary of reviews<span class="ms-ms-1" id="spRevSumArrow">&#9661;</span>' +
            '</a>' +
            '</div>' +
            '<div class="ms-col-6 ms-text-end">' +
            '<a id="calcEMSPerVars" class="ms-link-primary">Calculate Mo.Sales per Variations</a>' +
            '</div>' +
            '<div class="ms-collapse" id="collapseRevSummary">' +
            '<div class="ms-row ms-mb-1">' +
            '<div id="divSizeGrid" class="ms-col-6">' +
            '<div id="varSizeGrid" class="ag-theme-balham" style="height: 50px;"></div>' +
            '</div>' +
            '<div id="divColorGrid" class="ms-col-6">' +
            '<div id="varColorGrid" class="ag-theme-balham" style="height: 50px;"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mt-1">' +
            '<div class="ms-col ms-d-flex ms-justify-content-between">' +

            '<div id="divPropertyFilter">' +
            '<a id="propertyFilter" class="ms-link-primary ms-text-decoration-none" data-bs-toggle="collapse" href="#collapseProperties" role="button" aria-expanded="false" aria-controls="collapseProperties">' +
            'Property Filter<span class="ms-ms-1" id="spPropertyFilterArrow">&#9661;</span></a>' +
            '<a id="clearPropertyFilter" class="ms-btn-outline-danger ms-btn ms-ms-3 ms-d-inline ms-text-decoration-none" role="button">' +
            'Clear Filter</a>' +
            '</div>' +

            '<div class="ms-col ms-d-flex ms-justify-content-end">' +
            '<a id="getDetailedVarInfo" class="disabled ms-btn ms-btn-primary ms-text-decoration-none ms-text-light">Get Detailed Info</a>' +
            '<span id="spVarGetInfoWarning" class="ms-d-none help ms-ms-1 mys-tooltip ms-text-primary">' +
            '<svg data-bs-toggle="popover" data-bs-placement="left" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="12" cy="12" r="10"></circle>' +
            '<line x1="12" y1="16" x2="12" y2="12"></line>' +
            '<line x1="12" y1="8" x2="12.01" y2="8"></line>' +
            '</svg>' +
            '<span class="mys-tooltip-right mys-tooltiptext" style="top: -64px;">You have chosen to show detailed info automatically when the "Variations" tab is clicked which may cause slowness. You can change this from the "Variations" section of the "Settings" tab.</span>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div id="divPropertyFilterList" class="ms-row">' +
            '<div class="ms-collapse ms-mt-1" id="collapseProperties">' +
            '<div class="ms-card ms-card-body ms-p-2">' +
            '<div class="ms-row">' +
            '<div class="ms-col" id="divFilterColor">' +
            '<span id="spFilterColor" class="ms-d-block ms-me-1 ms-fw-bold">Color</span>' +
            '<hr class="ms-border-secondary ms-mb-1">' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mt-1">' +
            '<div class="ms-col" id="divFilterSize">' +
            '<span id="spFilterSize" class="ms-d-block ms-me-1 ms-fw-bold">Size</span>' +
            '<hr class="ms-border-secondary ms-mb-1">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-align-items-center ms-justify-content-between ms-mt-1 ms-row">' +
            '<div class="ms-col-auto">' +
            '<input class="ms-form-check-input ms-ms-0 ms-mt-0 ms-me-1 pointer" type="radio" id="radioAll" value="all" name="radioStockStatus" checked>' +
            '<label class="ms-fw-normal ms-form-check-label pointer" for="radioAll">All:<span class="ms-ms-1" id="spAllVars">0</span></label>' +
            '</div>' +
            '<div class="ms-col-auto">' +
            '<input class="ms-form-check-input ms-ms-0 ms-mt-0 ms-me-1 pointer" type="radio" id="radioFoundInStock" value="instock" name="radioStockStatus">' +
            '<label class="ms-fw-normal ms-form-check-label pointer" for="radioFoundInStock">In Stock:<span class="ms-ms-1" id="spFoundInStock">0</span></label>' +
            '</div>' +
            '<div class="ms-col-auto">' +
            '<input class="ms-form-check-input ms-ms-0 ms-mt-0 ms-me-1 pointer" type="radio" id="radioOutOfStock" value="oos" name="radioStockStatus">' +
            '<label class="ms-fw-normal ms-form-check-label pointer" for="radioOutOfStock">Out of Stock:<span class="ms-ms-1" id="spOutOfStock">0</span></label>' +
            '</div>' +
            '<div class="ms-col-auto">' +
            '<span class="mys-tooltip">' +
            '<svg id="svgExportVarsToExcel" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="ms-bg-white ms-border ms-p-1 pointer ms-rounded ms-me-1" viewBox="0 0 16 16">' +
            '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h3v1a1 1 0 0 1-1 1h-2zm3-3h-3v-2h3v2zm-7 0v-2h3v2H6z" />' +
            '</svg>' +
            '<span class="mys-tooltip-top mys-tooltiptext" style="min-width: 116px;">Export</span>' +
            '</span>' +
            '<svg xmlns="http://www.w3.org/2000/svg" id="openVariantModal" width="16" height="16" fill="currentColor" class="ms-align-self-end pointer" viewBox="0 0 16 16" data-bs-toggle="modal" data-bs-target="#commonModal"> ' +
            '<path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z">' +
            '</path></svg>' +
            '</div>' +
            '</div>' +

            '<div id="varGrid" class="ag-theme-balham ms-mt-1" style="height: 350px;"></div>' +
            '</section>' +
            '</main>';
    },
    Marketplaces: function () {
        return '<main id="marketplaces" class="ms-tab-pane ms-fade ms-p-1" role="tabpanel" aria-labelledby="marketplaces-tab">' +
            '<section>' +
            '<div class="ms-container-fluid ms-bg-light ms-fs-7 ms-text-center">' +

            '<table class="ms-table" id="divMarketplacesTableHeader">' +
            '<thead>' +
            '<tr>' +
            '<th></th>' +
            '<th class="ms-mb-1 ms-align-middle">Market</th>' +
            '<th class="ms-align-middle">BSR</th>' +
            '<th class="ms-align-middle">Buybox</th>' +
            '<th class="ms-align-middle">Lowest</th>' +
            '<th class="ms-align-middle">Sellers</th>' +
            '<th class="ms-align-middle">FBA Fee</th>' +
            '<th class="ms-align-middle">Ref.Fee %</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
            '</table>' +

            '<div class="accordion ms-mx-0 ms-d-none" id="accordionQArb">' +
            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingQArb">' +
            '<button class="ms-accordion-button ms-text-light collapsed" type="button" data-bs-toggle="collapse"' +
            'data-bs-target="#collapseQArb" aria-expanded="false" aria-controls="collapseQArb">Quick Arbitrage Calculator</button>' +
            '</h5>' +
            '<div id="collapseQArb" class="ms-accordion-collapse ms-collapse" aria-labelledby="headingQArb"' +
            'data-bs-parent="#accordionQArb">' +
            '<div class="ms-accordion-body ms-fs-6 ms-pt-2">' +
            '<div class="ms-row ms-mb-2">' +
            '<div class="ms-col-12 ms-px-0">' +

            '<table class="ms-table" id="divMarketplacesQArbTableHeader">' +
            '<thead>' +
            '<tr>' +
            '<th class="ms-mb-1 ms-align-middle" style="width:45px;">Market</th>' +
            '<th></th>' +
            '<th class="ms-align-middle">Sell Price</th>' +
            '<th class="ms-align-middle">Buy Cost</th>' +
            '<th class="ms-align-middle">Ship. Cost</th>' +
            '<th class="ms-align-middle">Mo. Sales</th>' +
            '<th class="ms-align-middle" style="wdith:45px;">Fees</th>' +
            '<th class="ms-text-end ms-align-middle">Profit</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody class="ms-bg-light">' +
            '</tbody>' +
            '</table>' +

            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div id="divMarketplacesPleaseWait" class="ms-mt-2 ms-text-center ms-fw-bold ms-fs-6">Please Wait&nbsp;' + common.DotsAnimation + '</div>' +
            '</div>' +
            '</section>' +
            '</main>';
    },
    Wishlist: function () {
        return '<main id="wishlist" class="ms-tab-pane ms-fade" role="tabpanel" aria-labelledby="wishlist-tab">' +
            '<section class="ms-container ms-py-1 ms-w-100">' +
            '<input type="hidden" id="wlItemId">' +
            '<input type="hidden" id="wlReviewCount">' +
            '<input type="hidden" id="wlPrice">' +
            '<input type="hidden" id="wlDomain">' +
            '<p id="pSellersInfo" class="ms-d-none"></p>' +
            '<div class="ms-align-items-center ms-mb-2 ms-mt-1 ms-row">' +
            '<label for="wlASIN" class="ms-col-form-label ms-py-0 ms-col-2">ASIN</label>' +
            '<div class="ms-col-4">' +
            '<input type="text" class="ms-form-control" id="wlASIN" readonly>' +
            '</div>' +
            '<label for="wlImportance" class="ms-col-2 col-form-label ms-px-0 ms-py-0 ms-text-end">Importance</label>' +
            '<div class="ms-col ms-pe-0">' +
            '<select class="ms-form-select" aria-label="importance" id="wlImportance">' +
            '<option class="ms-text-success" value="3" selected> Low </option>' +
            '<option class="ms-text-warning" value="2"> Medium </option>' +
            '<option class="ms-text-danger" value="1"> High </option>' +
            '</select>' +
            '</div>' +
            '<div class="ms-col-auto">' +
            '<svg id="wlImpSymbol" xmlns="http://www.w3.org/2000/svg" height="20" style="margin-right:1px" fill="currentColor" class="ms-text-success" viewBox="0 0 16 16">' +
            '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z" />' +
            '</svg>' +
            '</div>' +
            '</div>' +
            '<div class="ms-align-items-center ms-row ms-mb-2">' +
            '<label for="wlTitle" class="ms-col-form-label ms-py-0 ms-col-2">Title</label>' +
            '<div class="ms-col-10">' +
            '<input type="text" maxlength="200" class="ms-form-control" id="wlTitle">' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mb-1">' +
            '<label for="wlNote" class="ms-col-form-label ms-py-0 ms-col-2">Note</label>' +
            '<div class="ms-col-10">' +
            '<textarea id="wlNote" class="ms-form-control ms-py-1" style="resize: none;" placeholder="Write down a note" rows="4" maxlength="300"></textarea>' +
            '<label id="wlNoteCounter" for="wlNote" class="ms-text-secondary ms-fs-7">0/300</label>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mb-2">' +
            '<div class="ms-align-items-center ms-col-2 ms-d-flex ms-justify-content-end ms-pe-0">' +
            '<svg id="wlProcessSuccessIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="display:none;" class="ms-text-success" viewBox="0 0 16 16">' +
            '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>' +
            '</svg>' +
            '</div>' +
            '<div id="divWlSmallButtons" class="ms-col ms-d-flex ms-align-items-center ms-justify-content-between">' +
            '<div>' +
            '<span class="mys-tooltip">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" id="addToWishlist" class="ms-bg-white ms-border ms-p-1 pointer ms-rounded ms-me-1" viewBox="0 0 16 16">' +
            '<path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>' +
            '</svg>' +
            '<span class="mys-tooltip-top mys-tooltiptext" style="min-width: 116px;">Add New</span>' +
            '</span>' +
            '<span class="mys-tooltip">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" id="updateWishlist" class="ms-bg-white ms-border ms-p-1 pointer ms-rounded ms-me-1" viewBox="0 0 16 16">' +
            '<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>' +
            '</svg>' +
            '<span class="mys-tooltip-top mys-tooltiptext" style="min-width: 116px;">Apply Changes</span>' +
            '</span>' +
            '<span class="mys-tooltip">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" id="removeFromWishlist" class="ms-bg-white ms-border ms-p-1 pointer ms-rounded ms-me-1" viewBox="0 0 16 16">' +
            '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
            '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
            '</svg>' +
            '<span class="mys-tooltip-top mys-tooltiptext" style="min-width: 130px;margin-left: -68px;">Remove Selected</span>' +
            '</span>' +
            '<span class="mys-tooltip">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" id="removeAllWishlist" class="ms-bg-white ms-border ms-p-1 pointer ms-rounded ms-me-1" viewBox="0 0 16 16">' +
            '<path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>' +
            '</svg>' +
            '<span class="mys-tooltip-top mys-tooltiptext" style="min-width: 116px;">Remove All</span>' +
            '</span>' +
            '</div>' +
            '<div>' +
            '<span class="mys-tooltip">' +
            '<svg id="svgExportWlToExcel" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="ms-bg-white ms-border ms-p-1 pointer ms-rounded ms-me-1" viewBox="0 0 16 16">' +
            '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h3v1a1 1 0 0 1-1 1h-2zm3-3h-3v-2h3v2zm-7 0v-2h3v2H6z" />' +
            '</svg>' +
            '<span class="mys-tooltip-top mys-tooltiptext" style="min-width: 116px;">Export</span>' +
            '</span>' +
            '<span class="mys-tooltip">' +
            '<svg id="svgResetPanel" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="ms-bg-white ms-border ms-p-1 pointer ms-rounded" viewBox="0 0 16 16">' +
            '<path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>' +
            '</svg>' +
            '<span class="mys-tooltip-top mys-tooltiptext" style="min-width: 116px;">Reset The Panel</span>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="wlGrid" class="ag-theme-balham" style="height: 250px;"></div>' +
            '</section>' +
            '</main>';
    },
    Settings: function () {
        return '<main id="settings" class="ms-tab-pane ms-fade" role="tabpanel" aria-labelledby="settings-tab">' +
            '<section class="ms-container ms-py-1 ms-w-100">' +
            '<div class="accordion" id="accordionSettings">' +


            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingPremium">' +
            '<button class="ms-accordion-button ms-text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePremium" aria-expanded="true" aria-controls="collapsePremium">' +
            'Subscription' +
            '</button>' +
            '</h5>' +
            '<div id="collapsePremium" class="ms-accordion-collapse ms-collapse show" aria-labelledby="headingPremium" data-bs-parent="#accordionSettings">' +
            '<div class="ms-accordion-body">' +
            '<div class="ms-row">' +
            '<span>' +
            '<a id="premiumLink" class="ms-text-primary" target="_blank">' +
            '<u>Upgrade to PREMIUM</u></a> and search unlimitedly.' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingBuyboxStats">' +
            '<button class="ms-accordion-button ms-text-light collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBuyboxStats" aria-expanded="false" aria-controls="collapseBuyboxStats">' +
            'Buybox Statistics' +
            '</button>' +
            '</h5>' +
            '<div id="collapseBuyboxStats" class="ms-accordion-collapse ms-collapse" aria-labelledby="headingBuyboxStats" data-bs-parent="#accordionSettings">' +
            '<div class="ms-accordion-body">' +
            '<div class="ms-row">' +

            '<div class="ms-col-12 ms-fs-6">' +
            '<span id="buyboxStatsAuthWarning" class="ms-d-none ms-alert ms-alert-warning">' +
            'You can access the sellers and their BUYBOX winning percentages within 90 days. You can also view the BUYBOX prices of the sellers and the last time they won the BUYBOX. <a class="ms-text-primary" target="_blank" href="https://app.mysys.com/Profile/ServicePlan/60">In order to access BUYBOX statistics, sign up for PREMIUM PLUS now!</a>' +
            '</span>' +
            'Days interval for Buybox Statistics searching:&nbsp;<input id="setsBuyboxStatsSearchDaysInterval" style="width: 50px;" type="number" class="ms-form-control border-gray ms-d-inline ms-text-end" value="90">' +
            '</div>' +
            '<div class="ms-col-12 ms-mt-3"><a class="ms-btn ms-btn-primary ms-btn-xs ms-col-3" id="saveBuyboxStats">Save</a><svg id="buyboxStatsSaveSuccessIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="display:none;" class="ms-ms-1 ms-text-success" viewBox="0 0 16 16">' +
            '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>' +
            '</svg>' +
            '</div>' +

            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingQuiArbCalc">' +
            '<button class="ms-accordion-button ms-text-light collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseQuiArbCalc" aria-expanded="false" aria-controls="collapseQuiArbCalc">Quick Arbitrage Calculator</button>' +
            '</h5>' +
            '<div id="collapseQuiArbCalc" class="ms-accordion-collapse ms-collapse" aria-labelledby="headingQuiArbCalc" data-bs-parent="#accordionSettings">' +
            '<div class="ms-accordion-body">' +
            '<div class="ms-row">' +
            '<span id="qArbCalcPremiumWarn" class="ms-alert ms-alert-warning ms-mb-2 ms-p-2">' +
            'You must be a PREMIUM user to use this feature.&nbsp;<br>' +
            '<a id="premiumLink" class="ms-text-primary" target="_blank" href="#"><u>Upgrade to PREMIUM</u></a>' +
            '</span>' +
            '<span class="ms-mb-1 ms-fw-bold">Shipping cost for</span>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">USA</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForUSA" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon1">' +
            '<span class="ms-input-group-text" id="basic-addon1">$</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">Canada</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForCA" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon2">' +
            '<span class="ms-input-group-text" id="basic-addon2">C$</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">Mexico</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForMX" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon3">' +
            '<span class="ms-input-group-text" id="basic-addon3">M$</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">Germany</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForDE" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon4">' +
            '<span class="ms-input-group-text" id="basic-addon4">€</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">Spain</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForES" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon5">' +
            '<span class="ms-input-group-text" id="basic-addon5">€</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">France</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForFR" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon6">' +
            '<span class="ms-input-group-text" id="basic-addon6">€</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">Italy</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForIT" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon7">' +
            '<span class="ms-input-group-text" id="basic-addon7">€</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">UK</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForUK" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon8">' +
            '<span class="ms-input-group-text" id="basic-addon8">£</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">UAE</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForAE" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon9">' +
            '<span class="ms-input-group-text" id="basic-addon9">AED</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">Turkey</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForTR" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon10">' +
            '<span class="ms-input-group-text" id="basic-addon10">₺</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">Netherlands</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForNL" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon11">' +
            '<span class="ms-input-group-text" id="basic-addon11">€</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">Sweden</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForSE" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon12">' +
            '<span class="ms-input-group-text" id="basic-addon12">kr</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex">' +
            '<div class="ms-col-6 ms-mb-1">' +
            '<span class="ms-fw-normal ms-fs-6">Belgium</span>' +
            '</div>' +
            '<div class="ms-col-6">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsShipCostForBE" class="ms-form-control ms-form-control-xs" value="0" min="0" aria-describedby="basic-addon13">' +
            '<span class="ms-input-group-text" id="basic-addon13">€</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mt-2">' +
            '<div class="ms-col-12">' +
            '<a class="ms-col-4 ms-btn ms-btn-primary ms-btn-xs" id="saveShipCost">Save</a>' +
            '<svg id="saveShipCostSuccessIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="display: none;" class="ms-ms-1 ms-text-success" viewBox="0 0 16 16">' +
            '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>' +
            '</svg>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +



            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingStock">' +
            '<button class="ms-accordion-button  collapsed ms-text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseStock" aria-expanded="false" aria-controls="collapseStock">' +
            'Stocks Settings' +
            '</button>' +
            '</h5>' +
            '<div id="collapseStock" class="ms-accordion-collapse ms-collapse" aria-labelledby="headingStock" data-bs-parent="#accordionSettings">' +
            '<div class="ms-accordion-body ms-fs-6">' +
            '<div class="ms-row">' +
            '<div class="ms-row ms-align-items-center">' +
            '<div class="ms-col-4">' +
            '<label for="setsMinRating">Min Rating #</label>' +
            '</div>' +
            '<div class="ms-col-4 ms-px-0 ms-text-start">' +
            '<input type="number" id="setsMinRating" class="ms-form-control ms-height" value="1000">' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mt-1 ms-align-items-center">' +
            '<div class="ms-col-4">' +
            '<label for="setsMinFBack">Min Feedback %</label>' +
            '</div>' +
            '<div class="ms-col-4 ms-px-0 ms-text-start">' +
            '<input type="number" id="setsMinFBack" class="ms-form-control ms-height" value="95">' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-12 ms-mt-3">' +
            '<a class="ms-btn ms-btn-primary ms-btn-xs ms-col-3" id="saveStockFilter">Save Filter</a>' +
            '<svg id="stockFilterSaveSuccessIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="display:none;" class="ms-ms-1 ms-text-success" viewBox="0 0 16 16">' +
            '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>' +
            '</svg>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingMESParams">' +
            '<button class="ms-accordion-button  collapsed ms-text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMESParams" aria-expanded="false" aria-controls="collapseMESParams">' +
            'My Mo.Sales Parameters' +
            '</button>' +
            '</h5>' +
            '<div id="collapseMESParams" class="ms-accordion-collapse ms-collapse" aria-labelledby="headingMESParams" data-bs-parent="#accordionSettings">' +
            '<div class="ms-accordion-body">' +
            '<div class="ms-row" id="divMESParameter">' +
            '<div class="ms-col-12 ms-mb-1">' +
            '<h5 class="ms-fst-italic ms-text-uppercase">Competitor Count Calculation Parameters</h5>' +
            '</div>' +
            '<div class="ms-col-12 ms-fs-6">' +
            'Include FBAs selling between the lowest price and&nbsp;' +
            '<input id="setsFBAPercent" type="number" class="ms-form-control ms-form-control-xs border-gray inline-input ms-text-end" value="3">' +
            '% higher than the lowest price.' +
            '</div>' +
            '<div class="ms-col-12 ms-fs-6 ms-mt-1">' +
            'Include FBMs that have:' +
            '<ul>' +
            '<li class="ms-ms-3 ms-mt-1">feedbacks equal or higher than&nbsp;<input id="setsFBMFeedback" type="number" class="ms-form-control ms-form-control-xs border-gray inline-input ms-text-end" value="80">%&nbsp; positive feedback,</li>' +
            '<li class="ms-ms-3 ms-mt-1">ratings equal or higher than&nbsp;<input id="setsFBMRatings" type="number" class="ms-form-control ms-form-control-xs border-gray inline-input ms-text-end" value="10">&nbsp;ratings.</li>' +
            '</ul>' +
            '</div>' +
            '<div class="ms-col-12 ms-fs-6 ms-mt-3">' +
            '<a class="ms-btn ms-btn-primary ms-btn-xs" id="saveMESParameters">Save Parameters</a>' +
            '<svg id="mesSaveSuccessIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="display:none;" class="ms-ms-1 ms-text-success" viewBox="0 0 16 16">' +
            '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>' +
            '</svg>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingAlerts">' +
            '<button class="ms-accordion-button  collapsed ms-text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAlerts" aria-expanded="false" aria-controls="collapseAlerts"> Alerts </button>' +
            '</h5>' +
            '<div id="collapseAlerts" class="ms-accordion-collapse ms-collapse" aria-labelledby="headingAlerts" data-bs-parent="#accordionSettings">' +
            '<div class="ms-accordion-body ms-fs-6">' +
            '<div class="ms-row">' +
            '<div class="ms-form-check ms-form-switch">' +
            '<input class="ms-form-check-input alert-filter" type="checkbox" id="cboxProduct" name="cboxProduct" value="Product">' +
            '<label class="ms-fw-bold ms-form-check-label" for="cboxProduct">The product size tier is</label>' +
            '</div>' +
            '<div class="ms-ms-1 ms-col-12">' +
            '<div class="ms-col-12 ms-mt-1">' +
            '<span class="ms-fst-italic">For American Continent</span>' +
            '<hr class="ms-mb-1 ms-border-success">' +
            '<div id="divSetsAmericanSize" class="ms-ms-1 ms-col-12"> </div>' +
            '</div>' +
            '<div class="ms-col-12 ms-mt-2">' +
            '<span class="ms-fst-italic">For European Continent</span>' +
            '<hr class="ms-mb-1 ms-border-success">' +
            '<div id="divSetsEuropeanSize" class="ms-ms-1 ms-col-12"> </div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mt-2">' +
            '<div class="ms-form-check ms-form-switch ms-col-7">' +
            '<input class="ms-form-check-input alert-filter" type="checkbox" id="cboxAmzNotSellerLast" name="cboxAmzNotSellerLast" value="AmzNotSellerLast">' +
            '<label class="ms-fw-bold ms-form-check-label" for="cboxAmzNotSellerLast">Amazon is NOT a Seller Last</label>' +
            '</div>' +
            '<div class="ms-col-5">' +
            '<div class="ms-form-check ms-form-check-inline">' +
            '<input disabled class="ms-form-check-input" type="radio" id="amzNotSellerLast30" name="amzNotSellerLastSettings" value="30">' +
            '<label class="ms-form-check-label ms-fw-normal" for="amzNotSellerLast30">30 Days</label>' +
            '</div>' +
            '<div class="ms-form-check ms-form-check-inline">' +
            '<input disabled class="ms-form-check-input" type="radio" id="amzNotSellerLast90" name="amzNotSellerLastSettings" value="90">' +
            '<label class="ms-form-check-label ms-fw-normal" for="amzNotSellerLast90">90 Days</label>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-align-items-baseline ms-mt-2 ms-row">' +
            '<div class="ms-form-check ms-form-switch ms-col-7">' +
            '<input class="ms-form-check-input alert-filter" type="checkbox" id="cboxAmzOOS" name="cboxAmzOOS">' +
            '<label class="ms-fw-bold ms-form-check-label" for="cboxAmzOOS">' +
            '<span class="mys-tooltip help">' +
            '<span class="mys-tooltiptext mys-tooltip-top" style="min-width: 130px;">Amazon Out Of Stock</span> AMZ OOS' +
            '</span>&nbsp;% is equal or greater than</label>' +
            '</div>' +
            '<div class="ms-col-4">' +
            '<input type="number" id="setsAmzOOS" class="ms-form-control ms-form-control-xs" value="0" min="0" disabled>' +
            '</div>' +
            '</div>' +
            '<div class="ms-align-items-baseline ms-mt-2 ms-row">' +
            '<div class="ms-form-check ms-form-switch ms-col-7">' +
            '<input class="ms-form-check-input alert-filter" type="checkbox" id="cboxSalesRankExc" name="cboxSalesRankExc" value="SalesrankExceeds">' +
            '<label class="ms-fw-bold ms-form-check-label" for="cboxSalesRankExc">Sales Rank is equal or less than</label>' +
            '</div>' +
            '<div class="ms-col-4">' +
            '<input type="number" id="salesRankExceeds" class="ms-form-control ms-form-control-xs" value="0" min="0" disabled>' +
            '</div>' +
            '</div>' +
            '<div class="ms-align-items-baseline ms-mt-2 ms-row">' +
            '<div class="ms-form-check ms-form-switch ms-col-7">' +
            '<input class="ms-form-check-input alert-filter" type="checkbox" id="cboxTop" name="cboxTop" value="Top">' +
            '<label class="ms-fw-bold ms-form-check-label" for="cboxTop">BSR TOP (%) is equal or less than</label>' +
            '</div>' +
            '<div class="ms-col-4">' +
            '<input type="number" id="setsTop" class="ms-form-control ms-form-control-xs" value="0.00" step="0.10" min="0" disabled>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mt-2">' +
            '<div class="ms-col-12">' +
            '<a class="ms-col-4 ms-btn ms-btn-primary ms-btn-xs" id="saveAlertSets">Save</a>' +
            '<svg id="alertSuccessIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="display:none;" class="ms-ms-1 ms-text-success" viewBox="0 0 16 16">' +
            '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>' +
            '</svg>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingVariations">' +
            '<button class="ms-accordion-button  ms-text-light collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseVariations" aria-expanded="true" aria-controls="collapseVariations">' +
            'Variations' +
            '</button>' +
            '</h5>' +
            '<div id="collapseVariations" class="ms-accordion-collapse ms-collapse" aria-labelledby="headingVariations" data-bs-parent="#accordionSettings">' +
            '<div class="ms-accordion-body">' +
            '<div class="ms-row">' +
            '<div class="ms-form-check ms-form-switch">' +
            '<input class="ms-form-check-input" type="checkbox" id="cboxVarAutoStart" name="cboxVarAutoStart" value="VarAutoStart">' +
            '<label class="ms-fw-bold ms-form-check-label" for="cboxVarAutoStart">Start collecting detailed information right after clicking on the "Variations" tab</label>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mt-2 ms-align-items-center">' +
            '<a class="ms-col-4 ms-btn ms-btn-primary ms-btn-xs" id="saveVarSets">Save</a>' +
            '<svg id="varSuccessIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="display:none;" class="ms-ms-1 ms-text-success ms-col-auto" viewBox="0 0 16 16">' +
            '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>' +
            '</svg>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingVAT"><button class="ms-accordion-button  ms-text-light collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseVAT" aria-expanded="true" aria-controls="collapseVAT">Value-Added Tax (VAT)</button></h5>' +
            '<div id="collapseVAT" class="ms-accordion-collapse ms-collapse" aria-labelledby="headingVAT" data-bs-parent="#accordionSettings">' +
            '<div class="ms-accordion-body">' +
            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-6 ms-d-flex ms-ps-0">' +
            '<div class="ms-form-check ms-form-switch ms-col-8">' +
            '<input class="ms-form-check-input vat-cbox" type="checkbox" id="cboxVATforUSA" name="cboxVATforUSA" value="VATforUSA">' +
            '<label class="ms-fw-normal ms-fs-6 ms-form-check-label" for="cboxVATforUSA">VAT for USA</label>' +
            '</div>' +
            '<div class="ms-col-3">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsVATforUSA" class="ms-form-control ms-form-control-xs vatInput" value="0" min="0" max="99" disabled aria-describedby="basic-addon1">' +
            '<span class="ms-input-group-text" id="basic-addon1">%</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex ms-pe-0">' +
            '<div class="ms-form-check ms-form-switch ms-col-8">' +
            '<input class="ms-form-check-input vat-cbox" type="checkbox" id="cboxVATforUK" name="cboxVATforUK" value="VATforUK">' +
            '<label class="ms-fw-normal ms-fs-6 ms-form-check-label" for="cboxVATforUK">VAT for UK</label>' +
            '</div>' +
            '<div class="ms-col-3">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsVATforUK" class="ms-form-control ms-form-control-xs vatInput" value="0" min="0" max="99" disabled aria-describedby="basic-addon2">' +
            '<span class="ms-input-group-text" id="basic-addon2">%</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-6 ms-d-flex ms-ps-0">' +
            '<div class="ms-form-check ms-form-switch ms-col-8">' +
            '<input class="ms-form-check-input vat-cbox" type="checkbox" id="cboxVATforDe" name="cboxVATforDe" value="VATforDe">' +
            '<label class="ms-fw-normal ms-fs-6 ms-form-check-label" for="cboxVATforDe">VAT for Germany</label>' +
            '</div>' +
            '<div class="ms-col-3">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsVATforDe" class="ms-form-control ms-form-control-xs vatInput" value="0" min="0" max="99" disabled aria-describedby="basic-addon3">' +
            '<span class="ms-input-group-text" id="basic-addon3">%</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex ms-pe-0">' +
            '<div class="ms-form-check ms-form-switch ms-col-8">' +
            '<input class="ms-form-check-input vat-cbox" type="checkbox" id="cboxVATforCa" name="cboxVATforCa" value="VATforCa">' +
            '<label class="ms-fw-normal ms-fs-6 ms-form-check-label" for="cboxVATforCa">VAT for Canada</label>' +
            '</div>' +
            '<div class="ms-col-3">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsVATforCa" class="ms-form-control ms-form-control-xs vatInput" value="0" min="0" max="99" disabled aria-describedby="basic-addon4">' +
            '<span class="ms-input-group-text" id="basic-addon4">%</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-6 ms-d-flex ms-ps-0">' +
            '<div class="ms-form-check ms-form-switch ms-col-8">' +
            '<input class="ms-form-check-input vat-cbox" type="checkbox" id="cboxVATforFr" name="cboxVATforFr" value="VATforFr">' +
            '<label class="ms-fw-normal ms-fs-6 ms-form-check-label" for="cboxVATforFr">VAT for France</label>' +
            '</div>' +
            '<div class="ms-col-3">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsVATforFr" class="ms-form-control ms-form-control-xs vatInput" value="0" min="0" max="99" disabled aria-describedby="basic-addon5">' +
            '<span class="ms-input-group-text" id="basic-addon5">%</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex ms-pe-0">' +
            '<div class="ms-form-check ms-form-switch ms-col-8">' +
            '<input class="ms-form-check-input vat-cbox" type="checkbox" id="cboxVATforIt" name="cboxVATforIt" value="VATforIt">' +
            '<label class="ms-fw-normal ms-fs-6 ms-form-check-label" for="cboxVATforIt">VAT for Italy</label>' +
            '</div>' +
            '<div class="ms-col-3">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsVATforIt" class="ms-form-control ms-form-control-xs vatInput" value="0" min="0" max="99" disabled aria-describedby="basic-addon6">' +
            '<span class="ms-input-group-text" id="basic-addon6">%</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mb-1">' +
            '<div class="ms-col-6 ms-d-flex ms-ps-0">' +
            '<div class="ms-form-check ms-form-switch ms-col-8">' +
            '<input class="ms-form-check-input vat-cbox" type="checkbox" id="cboxVATforEs" name="cboxVATforEs" value="VATforEs">' +
            '<label class="ms-fw-normal ms-fs-6 ms-form-check-label" for="cboxVATforEs">VAT for Spain</label>' +
            '</div>' +
            '<div class="ms-col-3">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsVATforEs" class="ms-form-control ms-form-control-xs vatInput" value="0" min="0" max="99" disabled aria-describedby="basic-addon7">' +
            '<span class="ms-input-group-text" id="basic-addon7">%</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-col-6 ms-d-flex ms-pe-0">' +
            '<div class="ms-form-check ms-form-switch ms-col-8">' +
            '<input class="ms-form-check-input vat-cbox" type="checkbox" id="cboxVATforMx" name="cboxVATforMx" value="VATforMx">' +
            '<label class="ms-fw-normal ms-fs-6 ms-form-check-label" for="cboxVATforMx">VAT for Mexico</label>' +
            '</div>' +
            '<div class="ms-col-3">' +
            '<div class="ms-input-group">' +
            '<input type="number" id="setsVATforMx" class="ms-form-control ms-form-control-xs vatInput" value="0" min="0" max="99" disabled aria-describedby="basic-addon8">' +
            '<span class="ms-input-group-text" id="basic-addon8">%</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-mt-2 ms-align-items-center">' +
            '<a class="ms-col-4 ms-btn ms-btn-primary ms-btn-xs" id="saveVATSets">Save</a>' +
            '<svg id="vatSuccessIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="display:none;" class="ms-ms-1 ms-text-success ms-col-auto" viewBox="0 0 16 16">' +
            '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>' +
            '</svg>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingAmzToken">' +
            '<button class="ms-accordion-button  ms-text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAmzToken" aria-expanded="true" aria-controls="collapseAmzToken">' +
            'Amazon Seller Token' +
            '</button>' +
            '</h5>' +
            '<div id="collapseAmzToken" class="ms-accordion-collapse ms-collapse show" aria-labelledby="headingAmzToken" data-bs-parent="#accordionSettings">' +
            '<div class="ms-accordion-body">' +
            '<div class="ms-row">' +
            '<span>Save your Amazon Seller Token to see more detailed info. <a id="amzSellerTokenLink" class="ms-text-primary" target="_blank">' +
            '<u>Click here.</u></a></span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +


            '</div>' +
            '</section>' +
            '</main>';
    },
    Contact: function () {
        return '<main id="contact" class="ms-tab-pane ms-fade" role="tabpanel" aria-labelledby="contact-tab">' +
            '<section class="ms-container ms-py-1 ms-w-100">' +
            '<div class="accordion" id="accordionContact">' +
            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingAboutUs">' +
            '<button class="ms-accordion-button  ms-text-light collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAboutUs" aria-expanded="false" aria-controls="collapseAboutUs">' +
            'About Us' +
            '</button>' +
            '</h5>' +
            '<div id="collapseAboutUs" class="ms-accordion-collapse ms-collapse" aria-labelledby="headingAboutUs" data-bs-parent="#accordionContact">' +
            '<div class="ms-accordion-body">' +
            '<div class="ms-row">' +
            '<span>' +
            '<div class="ms-mb-1">' +
            'MySYS Multi-Channel e-Commerce Management System' +
            '</div>' +
            '<div>All-In-One Analysis Tool</div>' +
            '<ul class="disc">' +
            '<li>Wholesaler Analysis</li>' +
            '<li>Competitor Analysis (Amazon / eBay)</li>' +
            '<li>Book Analysis</li>' +
            '<li>Order Management (Amazon / eBay)</li>' +
            '<li>Warehouse Management</li>' +
            '<li>eBay Quick Lister</li>' +
            '</ul>' +
            '<a href="https://mysys.com" target="_blank" class="ms-link-primary pointer">Click here for more information...</a>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="ms-accordion-item">' +
            '<h5 class="ms-accordion-header ms-mb-0" id="headingSendMessage">' +
            '<button class="ms-accordion-button  ms-text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSendMessage" aria-expanded="true" aria-controls="collapseSendMessage">' +
            'Contact' +
            '</button>' +
            '</h5>' +
            '<div id="collapseSendMessage" class="ms-accordion-collapse ms-collapse show" aria-labelledby="headingSendMessage" data-bs-parent="#accordionContact">' +
            '<div class="ms-accordion-body">' +
            '<div class="ms-row">' +
            '<div class="ms-col-12">' +
            '<span>You can send message</span>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-pt-1">' +
            '<div class="ms-col-12">' +
            '<input id="contactSubject" class="ms-form-control" type="text" placeholder="Subject" required>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-pt-1">' +
            '<div class="ms-col-12">' +
            '<textarea id="contactMessage" class="ms-form-control" style="resize: none;" placeholder="Message" rows="4" maxlength="700" spellcheck="false" required></textarea>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-pt-1">' +
            '<div class="ms-col-12">' +
            '<a id="sendMessage" class="ms-col-5 ms-btn ms-btn-primary ms-btn-xs">Send</a>' +
            '</div>' +
            '</div>' +
            '<div class="ms-row ms-pt-3">' +
            '<span>Or you can&nbsp;' +
            '<a class="ms-link-info" href="mailto:ext.mysys@gmail.com?cc=b.emre@mysys.com&subject=MySYS%20Extension">Email Us</a></span>' +
            '</div>' +
            '<div id="divContactMessage" class="row ms-pt-3 ms-d-none">' +
            '<div class="ms-col-12 ms-fs-6"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</section>' +
            '</main>';
    },
    UserTypeInfo: function () {
        return '<div class="ms-px-3 ms-py-1 ms-border-top ms-fw-bold ms-text-primary ms-fs-6 ms-d-none">' +
            '<span id="spUserTypeInfo"></span>' +
            '</div>';
    }
}



