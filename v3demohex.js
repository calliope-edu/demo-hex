let buttonAFlag = false
let buttonBFlag = false
let buttonABFlag = false
let shakeFlag = false

input.onButtonPressed(Button.A, function () {
    buttonAFlag = true
})

input.onButtonPressed(Button.B, function () {
    buttonBFlag = true
})

input.onButtonPressed(Button.AB, function () {
    buttonABFlag = true
})
input.onGesture(Gesture.ThreeG, function () {
    shakeFlag = true
})

// ============= WELCOME DEMO =============
function welcomeDemo() {
    startSound()
    basic.showString("Hi!", 100)
    // Press A
    showStringUntilButton("A", 1)
    IMAGE_CHECK.showImage(0)
    basic.pause(300)
    basic.clearScreen()
    // Press B
    showStringUntilButton("B", 2)
    IMAGE_CHECK.showImage(0)
    basic.pause(300)
    basic.clearScreen()
    // Press A + B
    showStringUntilButton("A+B", 3)
    IMAGE_CHECK.showImage(0)
    basic.pause(200)
    basic.clearScreen()


    moveImageUntilShake(IMAGE_DOUBLE_ROW)
    IMAGE_CHECK.showImage(0)
    music.setVolume(255)
    basic.pause(300)
    basic.clearScreen()
    basic.showString("OK!", 100)
    music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.InBackground)
    // Rainbow animation
    rainbow()
    basic.pause(1000)
}
// ============= MENU SYSTEM =============
function menuLoop() {

    // Reset flags so only NEW presses count
    buttonAFlag = false
    buttonBFlag = false
    buttonABFlag = false
    shakeFlag = false

    // Initial display
    LEDcounter(menuState)
    basic.showNumber(menuState)

    while (true) {


        // --- A pressed → previous menu ---
        if (buttonAFlag && !buttonBFlag) {
            buttonAFlag = false   // consume event

            if (menuState > 1) {
                menuState -= 1
                LEDcounter(menuState)
                basic.showNumber(menuState)
            }

            continue
        }

        // --- B pressed → next menu ---
        if (buttonBFlag && !buttonAFlag) {
            buttonBFlag = false   // consume event

            if (menuState < 4) {
                menuState += 1
                LEDcounter(menuState)
                basic.showNumber(menuState)
            }

            continue
        }

        if (shakeFlag) {
            shakeFlag = false   // consume event

            basic.pause(100)  // let shake settle

            menuAnimateEnter()

            if (menuState == 1) {
                oracleRun()
            } else if (menuState == 2) {
                rockPaperScissorsRun()
            } else if (menuState == 3) {
                multiplicationRun()
            } else if (menuState == 4) {
                volumeMeterRun()
            }

            menuAnimateLeave()

            LEDcounter(menuState)
            
            basic.showNumber(menuState)

            continue
        }

        basic.pause(1)
    }
}

function disableLEDs() {
    basic.turnRgbLedOff()
}
function showStringUntilButton(text: string, event_id: number) {

    // Reset button flags so only NEW presses count
    buttonAFlag = false
    buttonBFlag = false
    buttonABFlag = false

    // Pick arrow image
    let arrow = IMAGE_ARROW_LEFT
    if (event_id == 2) arrow = IMAGE_ARROW_RIGHT
    if (event_id == 3) arrow = IMAGE_ARROW_LEFT_RIGHT

    // Show the text (blocking is fine now)
    basic.showString(text, 100)

    // Wait until the correct button press happens
    while (true) {


        // Check for the correct event
        if (event_id == 1 && buttonAFlag) {
            buttonAFlag = false
            buttonBFlag = false
            buttonABFlag = false
            break
        }
        if (event_id == 2 && buttonBFlag) {
            buttonAFlag = false
            buttonBFlag = false
            buttonABFlag = false
            break
        }
        if (event_id == 3 && buttonABFlag) {
            buttonAFlag = false
            buttonBFlag = false
            buttonABFlag = false
            break
        }
        // Animate arrow
        arrow.showImage(0)
        basic.pause(200)
        basic.clearScreen()
        basic.pause(200)
    }

    // Wait until all buttons are released
    while (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
        basic.pause(10)
    }

    // Clear flags for next time
    buttonAFlag = false
    buttonBFlag = false
    buttonABFlag = false
}

function startSound() {

}

// ============= PROGRAM 1: ORACLE =============
function oracleRun() {

    leave = false
    pressed = false

    // Reset flags so only NEW presses count
    buttonAFlag = false
    buttonBFlag = false
    buttonABFlag = false

    while (!leave) {

        pressed = false

        //
        // --- WAIT FOR BUTTON A OR AB ---
        //
        while (!pressed && !leave) {

            // AB → leave immediately
            if (buttonABFlag) {
                buttonABFlag = false
                leave = true
                break
            }

            // A → user pressed the oracle button
            if (buttonAFlag) {
                buttonAFlag = false
                pressed = true
                break
            }

            // Arrow animation
            IMAGE_ARROW_LEFT.showImage(0)
            basic.pause(400)
            basic.clearScreen()
            basic.pause(400)
        }

        if (leave) break

        //
        // --- BUTTON A WAS PRESSED → WAIT FOR RELEASE ---
        //
        while (input.buttonIsPressed(Button.A)) {
            basic.pause(10)
        }

        //
        // --- ANIMATION (DOT BLINKING) ---
        //
        for (let i = 0; i < 5; i++) {

            if (buttonABFlag) {
                buttonABFlag = false
                leave = true
                break
            }

            IMAGE_DOT.showImage(0)
            basic.pause(100)
            basic.clearScreen()
            basic.pause(100)
        }

        if (leave) break

        //
        // --- SHOW RESULT ---
        //
        if (Math.random() < 0.5) {
            IMAGE_SMILEY.showImage(0)
        } else {
            IMAGE_SAD.showImage(0)
        }

        //
        // --- WAIT UP TO 2 SECONDS OR UNTIL AB IS PRESSED ---
        //
        buttonABFlag = false  // start fresh
        for (let t = 0; t < 2000; t += 100) {
            basic.pause(100)
            if (buttonABFlag) {
                buttonABFlag = false
                leave = true
                break
            }
        }
        basic.clearScreen()
    }
}
// ============= PROGRAM 2: ROCK PAPER SCISSORS =============
function rockPaperScissorsRun() {
    leave = false
    // Show what's possible
    IMAGE_ROCK.showImage(0)
    basic.pause(400)
    IMAGE_PAPER.showImage(0)
    basic.pause(400)
    IMAGE_SCISSORS.showImage(0)
    basic.pause(400)
    basic.clearScreen()
    basic.pause(200)
    while (!(leave)) {
        // Wait for shake gesture with moving animation
        moveImageUntilShake(IMAGE_DOUBLE_ROW)
        if (leave) {
            break;
        }
        // Show random choice
        choice = Math.floor(Math.random() * 3)
        if (choice == 0) {
            IMAGE_ROCK.showImage(0)
        } else if (choice == 1) {
            IMAGE_PAPER.showImage(0)
        } else {
            IMAGE_SCISSORS.showImage(0)
        }

        //
        // --- WAIT UP TO 2 SECONDS OR UNTIL AB IS PRESSED ---
        //
        buttonABFlag = false  // start fresh
        for (let t = 0; t < 2000; t += 100) {
            basic.pause(100)
            if (buttonABFlag) {
                buttonABFlag = false
                leave = true
                break
            }
        }
        basic.clearScreen()
    }
}

// ============= PROGRAM 3: MULTIPLICATION =============
function multiplicationRun() {

    leave = false
    ready = false

    // Reset button flags so only NEW presses count
    buttonAFlag = false
    buttonBFlag = false
    buttonABFlag = false

    IMAGE_ARROW_LEFT.showImage(0)
    while (!leave) {
        // --- AB pressed → leave ---
        if (buttonABFlag) {
            buttonABFlag = false   // consume event
            while (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
                basic.pause(10)
            }
            leave = true
            break
        }
        // --- Button A → first factor ---
        if (buttonAFlag) {
            buttonAFlag = false   // consume event

            factor1 = Math.floor(Math.random() * 10)
            basic.showNumber(factor1)

            ready = false
            basic.pause(300)
        }
        // --- Button B → second factor ---
        if (buttonBFlag) {
            buttonBFlag = false   // consume event

            IMAGE_MULTIPLY.showImage(0)
            basic.pause(300)

            factor2 = Math.floor(Math.random() * 10)
            basic.showNumber(factor2)

            ready = true
            basic.pause(300)
        }
        // --- Shake → show result ---
        if (shakeFlag && ready) {
            shakeFlag = false   // consume event
            result = factor1 * factor2
            basic.showNumber(result)
            basic.pause(1000)

            IMAGE_ARROW_LEFT.showImage(0)
            ready = false
        }
        basic.pause(50)
    }
}
// ============= PROGRAM 4: VOLUME METER =============
function volumeMeterRun() {
    leave = false
    gauges = [
        0,
        0,
        0,
        0,
        0
    ]
    buttonABFlag = false  // start fresh
    while (!(leave)) {

        if (buttonABFlag) {
            buttonABFlag = false
            leave = true
            break
        }

        for (let n = 0; n <= 3; n++) {
            gauges[n] = gauges[n + 1]
        }
        soundLevel = input.soundLevel()
        gauges[4] = Math.map(soundLevel, 0, 255, 0, 5)
        for (let x2 = 0; x2 <= 4; x2++) {
            gauge = gauges[x2]
            for (let y = 0; y <= 4; y++) {
                if (gauge > y) {
                    led.plot(x2, 4 - y)
                } else {
                    led.unplot(x2, 4 - y)
                }
            }
        }
        sum = 0
        for (let o = 0; o <= 4; o++) {
            sum += gauges[o]
        }
        if (sum > 15) {
            // rot
            LEDTrafficLight(2)
        } else if (sum > 7) {
            // gelb
            LEDTrafficLight(1)
        } else {
            // gruen
            LEDTrafficLight(0)
        }
        basic.pause(100)
    }
    basic.clearScreen()
    disableLEDs()
}
function hslToHex(h: number, s: number, l: number) {
    h = h % 360;
    s = s / 100;
    l = l / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return (r << 16) | (g << 8) | b;
}
function rainbow() {
    led.setBrightness(0)
    IMAGE_SMILEY.showImage(0)
    for (let j = 0; j <= 299; j++) {
        basic.setLedColors(hslToHex(j % 360, 100, 50), hslToHex((j + 30) % 360, 100, 50), hslToHex((j + 60) % 360, 100, 50))
        led.setBrightness(Math.min(255, j))
        basic.pause(10)
    }
    // Faden
    for (let l = 0; l <= 30; l++) {
        brightness = Math.max(0, 8 - l * 0.26)
        basic.setLedColors(hslToHex(299 % 360, 100, 50 - l), hslToHex((299 + 30) % 360, 100, 50 - l), hslToHex((299 + 60) % 360, 100, 50 - l))
        led.setBrightness(Math.max(0, 300 - l * 10))
        basic.pause(10)
    }
    basic.clearScreen()
    led.setBrightness(displayBrightness)
    disableLEDs()
}
function LEDTrafficLight(color: number) {
    if (color == 0) {
        // Green
        basic.setLedColors(0x00ff00, 0x000000, 0x000000)
    } else if (color == 1) {
        // Yellow
        basic.setLedColors(0x000000, 0xffff00, 0x000000)
    } else if (color == 2) {
        // Red
        basic.setLedColors(0x000000, 0x000000, 0xff0000)
    }
}
function LEDcounter(number: number) {
    // Light up RGB LEDs based on menu number
    // Menu 1: Left LED only
    // Menu 2: Left + Middle LEDs
    // Menu 3: Middle + Right LEDs
    // Menu 4: Right LED only
    if (number == 1) {
        basic.setLedColors(0xffffff, 0x000000, 0x000000)
    } else if (number == 2) {
        basic.setLedColors(0xffffff, 0xffffff, 0x000000)
    } else if (number == 3) {
        basic.setLedColors(0x000000, 0xffffff, 0xffffff)
    } else if (number == 4) {
        basic.setLedColors(0x000000, 0x000000, 0xffffff)
    }
}



function moveImageUntilShake(image: Image) {

    // Start fresh
    shakeFlag = false
    buttonABFlag = false

    localX = -3
    localDirection = 1

    while (!shakeFlag && !leave) {

        //
        // --- Move image ---
        //
        localX += localDirection
        if (localX >= 4) {
            localDirection = -1
        } else if (localX <= -3) {
            localDirection = 1
        }

        drawImageFast(image, localX)
        basic.pause(70)

        //
        // --- Check for AB exit (latched) ---
        //
        if (buttonABFlag) {
            buttonABFlag = false     // consume event
            leave = true
            shakeFlag = false        // consume shake if any
            break
        }

        //
        // --- Check for shake (latched) ---
        //
        if (shakeFlag) {
            break
        }

        //
        // Small pause to control animation speed
        //
        basic.pause(10)

        frameCount += 1
    }

    // Let movement settle
    basic.pause(100)
}

function drawImageFast(img: Image, offsetX: number) {
    basic.clearScreen()

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {

            // Convert pixel to boolean on the fly
            if (img.pixel(x, y)) {
                let px = x + offsetX
                if (px >= 0 && px < 5) {
                    led.plot(px, y)
                }
            }
        }
    }
}

function menuAnimateLeave() {
    drawImageFast(IMAGE_RECT_L, 0)
    basic.pause(150)
    drawImageFast(IMAGE_RECT_S, 0)
    basic.pause(150)
    drawImageFast(IMAGE_DOT, 0)
    basic.pause(150)
    basic.clearScreen()
    disableLEDs()
}
function menuAnimateEnter() {
    disableLEDs()
    drawImageFast(IMAGE_DOT, 0)
    basic.pause(150)
    drawImageFast(IMAGE_RECT_S, 0)
    basic.pause(150)
    drawImageFast(IMAGE_RECT_L, 0)
    basic.pause(150)
    basic.clearScreen()
}
let frameCount = 0
let accelZ = 0
let accelY = 0
let accelX = 0
let localDirection = 0
let localX = 0
let result = 0
let factor2 = 0
let factor1 = 0
let ready = false
let choice = 0
let brightness = 0
let sum = 0
let gauge = 0
let soundLevel = 0
let gauges: number[] = []
let localArrowImage: Image = null
let displayBrightness = 0
let menuState = 0
let IMAGE_MULTIPLY: Image = null
let IMAGE_SCISSORS: Image = null
let IMAGE_PAPER: Image = null
let IMAGE_ROCK: Image = null
let IMAGE_DOUBLE_ROW: Image = null
let IMAGE_RECT_L: Image = null
let IMAGE_RECT_S: Image = null
let IMAGE_DOT: Image = null
let IMAGE_CHECK: Image = null
let IMAGE_ARROW_LEFT_RIGHT: Image = null
let IMAGE_ARROW_RIGHT: Image = null
let IMAGE_ARROW_LEFT: Image = null
let IMAGE_SAD: Image = null
let IMAGE_SMILEY: Image = null
let localBtnDetected = false
let displayState = 0
let arrowImage = null
let buttonDetected = false
let detected = false
let pressed = false
let leave = false
let x = 0
let direction = 0
let accelStrength = 0
IMAGE_SMILEY = images.createImage(`
    . # . # .
    . # . # .
    . . . . .
    # . . . #
    . # # # .
    `)
IMAGE_SAD = images.createImage(`
    . # . # .
    . # . # .
    . . . . .
    . # # # .
    # . . . #
    `)
let IMAGE_HEART = images.createImage(`
    . # . # .
    # # # # #
    # # # # #
    . # # # .
    . . # . .
    `)
IMAGE_ARROW_LEFT = images.createImage(`
    . . # . .
    . # . . .
    # # # # #
    . # . . .
    . . # . .
    `)
IMAGE_ARROW_RIGHT = images.createImage(`
    . . # . .
    . . . # .
    # # # # #
    . . . # .
    . . # . .
    `)
IMAGE_ARROW_LEFT_RIGHT = images.createImage(`
    . . # . .
    . # . # .
    # . . . #
    . # . # .
    . . # . .
    `)
IMAGE_CHECK = images.createImage(`
    . . . . .
    . . . . #
    . . . # .
    # . # . .
    . # . . .
    `)
IMAGE_DOT = images.createImage(`
    . . . . .
    . . . . .
    . . # . .
    . . . . .
    . . . . .
    `)
IMAGE_RECT_S = images.createImage(`
    . . . . .
    . # # # .
    . # . # .
    . # # # .
    . . . . .
    `)
IMAGE_RECT_L = images.createImage(`
    # # # # #
    # . . . #
    # . . . #
    # . . . #
    # # # # #
    `)
IMAGE_DOUBLE_ROW = images.createImage(`
    . # # . .
    . # # . .
    . # # . .
    . # # . .
    . # # . .
    `)
IMAGE_ROCK = images.createImage(`
    . . . . .
    . # # # .
    . # # # .
    . # # # .
    . . . . .
    `)
IMAGE_PAPER = images.createImage(`
    # # # # #
    # . . . #
    # . . . #
    # . . . #
    # # # # #
    `)
IMAGE_SCISSORS = images.createImage(`
    # # . . #
    # # . # .
    . . # . .
    # # . # .
    # # . . #
    `)
IMAGE_MULTIPLY = images.createImage(`
    . . . . .
    . # . # .
    . . # . .
    . # . # .
    . . . . .
    `)

menuState = 1
let firstTime = true
displayBrightness = 255

led.setBrightness(displayBrightness)
disableLEDs()
if (firstTime) {
    welcomeDemo()
    firstTime = false
}
menuLoop()
