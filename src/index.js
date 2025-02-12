const addon = require('../build/Release/addon');

const mouse = {
    'left': {
        'up': () => addon.mouseLeftUp(),
        'down': () => addon.mouseLeftDown()
    },
    'right': {
        'up': () => addon.mouseRightUp(),
        'down': () => addon.mouseRightDown()
    },
    'middle': {
        'up': () => addon.mouseMiddleUp(),
        'down': () => addon.mouseMiddleDown()
    }
}

const keyboard = {
    'escape': 0x1B,
    'f1': 0x70,
    'f2': 0x71,
    'f3': 0x72,
    'f4': 0x73,
    'f5': 0x74,
    'f6': 0x75,
    'f7': 0x76,
    'f8': 0x77,
    'f9': 0x78,
    'f10': 0x79,
    'f11': 0x7A,
    'f12': 0x7B,
    'printscreen': 0x2C,
    'scrolllock': 0x46,
    'pause': 0x13,
    '`': 0xC0,
    'backquote': 0xC0,
    '1': 0x31,
    '2': 0x32,
    '3': 0x33,
    '4': 0x34,
    '5': 0x35,
    '6': 0x36,
    '7': 0x37,
    '8': 0x38,
    '9': 0x39,
    '0': 0x30,
    '-': 0xBD,
    '=': 0xBB,
    'backspace': 0x08,
    'insert': 0x2D,
    'home': 0x24,
    'pageup': 0x21,
    'pagedown': 0x22,
    'numlock': 0x90,
    'divide': 0x6F,
    'multiply': 0x6A,
    'subtract': 0x6D,
    'add': 0x6B,
    'decimal': 0x6E,
    'numpadenter': 0x0D,
    'numpad1': 0x61,
    'numpad2': 0x62,
    'numpad3': 0x63,
    'numpad4': 0x64,
    'numpad5': 0x65,
    'numpad6': 0x66,
    'numpad7': 0x67,
    'numpad8': 0x68,
    'numpad9': 0x69,
    'numpad0': 0x60,
    'tab': 0x09,
    'q': 0x51,
    'w': 0x57,
    'e': 0x45,
    'r': 0x52,
    't': 0x54,
    'y': 0x59,
    'u': 0x55,
    'i': 0x49,
    'o': 0x4F,
    'p': 0x50,
    '[': 0xDB,
    ']': 0xDD,
    '\\': 0xDC,
    'delete': 0x2E,
    'end': 0x23,
    'capslock': 0x14,
    'a': 0x41,
    's': 0x53,
    'd': 0x44,
    'f': 0x46,
    'g': 0x47,
    'h': 0x48,
    'j': 0x4A,
    'k': 0x4B,
    'l': 0x4C,
    ';': 0xBA,
    '\'': 0xDE,
    'enter': 0x0D,
    'shift': 0xA0,
    'left-shift': 0xA0,
    'z': 0x5A,
    'x': 0x58,
    'c': 0x43,
    'v': 0x56,
    'b': 0x42,
    'n': 0x4E,
    'm': 0x4D,
    ',': 0xBC,
    '.': 0xBE,
    '/': 0xBF,
    'right-shift': 0xA1,
    'ctrl': 0xA2,
    'left-ctrl': 0xA2,
    'win': 0x5B,
    'left-win': 0x5B,
    'alt': 0xA4,
    'left-alt': 0xA4,
    ' ': 0x20,
    'space': 0x20,
    'right-alt': 0xA5,
    'right-win': 0x5C,
    'apps': 0x5D,
    'right-ctrl': 0xA3
}

const assert = (dict, key) => {
    const target = dict[key];
    if (!target) throw new Error('Could not find the key');
    return target;
}

class Mouse {
    /**
     * Checks if the mouse has such a button.
     */
    static has(key) {
        return key in mouse;
    }

    /**
     * Gets the mouse position.
     */
    static position() {
        return addon.mousePosition();
    }

    /**
     * Gets the mouse x position.
     */
    static x() {
        return this.position().x;
    }

    /**
     * Gets the mouse y position.
     */
    static y() {
        return this.position().y;
    }

    /**
     * Moves the mouse relatively.
     */
    static move(x, y) {
        const pos = this.position();
        this.moveTo(pos.x + x, pos.y + y)
    }

    /**
     * Moves the mouse to provided position.
     */
    static moveTo(x, y) {
        addon.mouseMove(x, y)
    }

    /**
     * Scrolls the mouse through provided amount.
     */
    static scroll(amount) {
        addon.mouseScroll(amount);
    }

    /**
     * Clicks the mouse.
     */
    static click(key = 'left') {
        this.down(key);
        this.up(key);
    }

    /**
     * Downs the mouse.
     */
    static down(key = 'left') {
        const target = assert(mouse, key);
        target.down();
    }

    /**
     * Ups the mouse.
     */
    static up(key = 'left') {
        const target = assert(mouse, key);
        target.up();
    }
}

class Touch {
    /**
     * Downs the touch.
     */
    static down(x, y) {
        addon.touchDown(x, y);
    }

    /**
     * Updates the touch.
     */
    static update(x, y) {
        addon.touchUpdate(x, y);
    }

    /**
     * Ups the touch.
     */
    static up(x, y) {
        addon.touchUp(x, y);
    }
}

class Keyboard {
    /**
     * Checks if the keyboard has such a button.
     */
    static has(key) {
        return key in keyboard;
    }

    /**
     * Clicks the key.
     */
    static click(key) {
        this.down(key);
        this.up(key);
    }

    /**
     * Downs the key.
     */
    static down(key) {
        const target = assert(keyboard, key);
        addon.keyboardDown(target);
    }

    /**
     * Ups the key.
     */
    static up(key) {
        const target = assert(keyboard, key);
        addon.keyboardUp(target);
    }
}

module.exports = {
    Mouse,
    Touch,
    Keyboard
}