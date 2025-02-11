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
    'escape': 0x01,
    'f1': 0x3B,
    'f2': 0x3C,
    'f3': 0x3D,
    'f4': 0x3E,
    'f5': 0x3F,
    'f6': 0x40,
    'f7': 0x41,
    'f8': 0x42,
    'f9': 0x43,
    'f10': 0x44,
    'f11': 0x57,
    'f12': 0x58,
    'printscreen': 0xB7,
    'scrolllock': 0x46,
    'pause': 0xC5,
    '`': 0x29,
    '1': 0x02,
    '2': 0x03,
    '3': 0x04,
    '4': 0x05,
    '5': 0x06,
    '6': 0x07,
    '7': 0x08,
    '8': 0x09,
    '9': 0x0A,
    '0': 0x0B,
    '-': 0x0C,
    '=': 0x0D,
    'backspace': 0x0E,
    'insert': 0xD2 + 1024,
    'home': 0xC7 + 1024,
    'pageup': 0xC9 + 1024,
    'pagedown': 0xD1 + 1024,
    'numlock': 0x45,
    'divide': 0xB5 + 1024,
    'multiply': 0x37,
    'subtract': 0x4A,
    'add': 0x4E,
    'decimal': 0x53,
    'numpadenter': 0x9C + 1024,
    'numpad1': 0x4F,
    'numpad2': 0x50,
    'numpad3': 0x51,
    'numpad4': 0x4B,
    'numpad5': 0x4C,
    'numpad6': 0x4D,
    'numpad7': 0x47,
    'numpad8': 0x48,
    'numpad9': 0x49,
    'numpad0': 0x52,
    'tab': 0x0F,
    'q': 0x10,
    'w': 0x11,
    'e': 0x12,
    'r': 0x13,
    't': 0x14,
    'y': 0x15,
    'u': 0x16,
    'i': 0x17,
    'o': 0x18,
    'p': 0x19,
    '[': 0x1A,
    ']': 0x1B,
    '\\': 0x2B,
    'delete': 0xD3 + 1024,
    'end': 0xCF + 1024,
    'capslock': 0x3A,
    'a': 0x1E,
    's': 0x1F,
    'd': 0x20,
    'f': 0x21,
    'g': 0x22,
    'h': 0x23,
    'j': 0x24,
    'k': 0x25,
    'l': 0x26,
    ';': 0x27,
    '\'': 0x28,
    'enter': 0x1C,
    'return': 0x1C,
    'shift': 0x2A,
    'left-shift': 0x2A,
    'z': 0x2C,
    'x': 0x2D,
    'c': 0x2E,
    'v': 0x2F,
    'b': 0x30,
    'n': 0x31,
    'm': 0x32,
    ',': 0x33,
    '.': 0x34,
    '/': 0x35,
    'right-shift': 0x36,
    'ctrl': 0x1D,
    'left-ctrl': 0x1D,
    'left-win': 0xDB + 1024,
    'alt': 0x38,
    'left-alt': 0x38,
    ' ': 0x39,
    'space': 0x39,
    'right-alt': 0xB8 + 1024,
    'right-win': 0xDC + 1024,
    'apps': 0xDD + 1024,
    'right-ctrl': 0x9D + 1024
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