function waitForElement(selector, callback) {
    const interval = 250; // 100ms
    const checkExist = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(checkExist);
            callback(element);
        }
    }, interval);
}

// Helper function to simulate typing into an input field
function simulateTyping(element, text, callback) {
    let index = 0;
    function typeCharacter() {
        if (index < text.length) {
            const char = text[index];
            const keyCode = char.charCodeAt(0);

            // Create and dispatch keyboard events
            const keydownEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: char, charCode: keyCode, keyCode: keyCode });
            const keypressEvent = new KeyboardEvent('keypress', { bubbles: true, cancelable: true, key: char, charCode: keyCode, keyCode: keyCode });
            const inputEvent = new Event('input', { bubbles: true });
            const keyupEvent = new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: char, charCode: keyCode, keyCode: keyCode });

            element.dispatchEvent(keydownEvent);
            element.dispatchEvent(keypressEvent);
            element.value += char;
            element.dispatchEvent(inputEvent);
            element.dispatchEvent(keyupEvent);

            index++;
            setTimeout(typeCharacter, 100); // Simulate typing delay
        } else {
            callback();
        }
    }
    typeCharacter();
}

// Helper function to simulate human-like click
function simulateClick(element) {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

// Helper function to remove disabled attribute
function enableButton(selector) {
    const button = document.querySelector(selector);
    if (button) {
        button.disabled = false; // Ensure the button is enabled
        button.removeAttribute('disabled'); // Remove the disabled attribute
    }
}

// Step 1: Wait for the .az-app element
waitForElement('.az-app', (element) => {

    var style = document.createElement('style');
    var cssCode = 'input[type="password"] { -webkit-text-security: disc; }';
    style.appendChild(document.createTextNode(cssCode));
    document.head.appendChild(style);

    waitForElement('#az-app-container .page-footer', (e)=> {
        e.style.display = 'none'
    })

    waitForElement('.page-tab-header-actions', (e)=> {
        e.style.display = 'none'
    })
    waitForElement('.login-form input[type=email]', (e)=> {
        e.setAttribute('autocomplete', 'off');
    })
  
    waitForElement('.login-form input[type=password]', (e)=> {
        e.setAttribute('autocomplete', 'off');
    })
  
    waitForElement('.login-form input[type=email]', () => {

        if(localStorage.getItem('REMEMBER_EMAIL') != null){
            return;
        }

       localStorage.setItem('REMEMBER_EMAIL', 'mehmetsimseek220@gmail.com')
       localStorage.setItem('REMEMBER_PASSWORD', 'Cool2121.')
       window.location.reload()
    });

});