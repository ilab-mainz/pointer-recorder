
class Recorder {

    constructor() {
        
        this.replay = true; // always replay after recording
        this.stop();
        this.frames = [];
        
        // enable interaction
        this.addButtonListeners();
        this.addPointerListener();
        this.addKeyboardListener();
    }

    stop() {
        if(this.state === 'RECORD' && this.replay) {
            console.log('start replay');
            this.play();
        } else {
            this.state = 'STOP';
            this.setStopButton();
            this.showRealCursor();
        }
    }

    toggle() {
        console.log('TOGGLE OFF', this.state);
        if(this.state === 'STOP') {
            this.record();
        } else {
            this.stop();
        }
    }

    record() {
        console.log('started recording ...', this);
        this.frames = [];
        this.state = 'RECORD';
        this.timerStart();
        this.setRecordButton();
    }

    play() {

        if(this.state === 'RECORD') {
            console.log(`recorded ${this.frames.length} frames`);
            //this.logFrames();
        }

        this.state = 'PLAY';
        this.setPlayButton();
        this.showFakeCursor();
    
        this.timerUpdate();
        // did we record any frames?
        if(this.frames.length > 0) {
            this.frames.forEach((move, i) => {
                let delay = move.time - this.startTime;
                setTimeout(() => this.playFrame(move, i), delay);         
            });
        } else {
           this.stop(); 
        }
        return false;
    }

    logFrames() {
        this.frames.forEach((f, i) => console.log(`frame ${i}`, f));
    }

    logTimes() {
        if(this.frames.length > 1) {
            this.frames.reduce( (f1, f2, i) => {
                console.log(`frame ${i}`, Math.round(f2.time - f1.time));
                return f2;
            });  
        }
    }

    playFrame(move, i) {
        // move the cursor around
        var cursor = document.querySelector('div.cursor');
        cursor.style.left = move.x + 'px';
        cursor.style.top = move.y + 'px';
        // stop playing when we reach the last frame
        if((i === this.frames.length - 1) || (this.state != 'PLAY') ) {
            this.state = 'PLAY';
            this.stop();
        }
    }

    timerStart() {
        this.timerUpdate();
        // keep the starting time 
        this.startTime = this.time;
    }

    timerUpdate() {
        // update current time
        this.time = performance.now();
    }

    setButton(cls, state) {
        // switch button classes to change its style
        const button = document.querySelector('.' + cls );
        const styles = button.classList;
        if(state) {
            styles.add('pressed');
        } else {
            styles.remove('pressed');
        }
    }

    setStopButton() {
        this.setButton('stop', true);
        this.setButton('play', false);
        this.setButton('record', false);
        this.setInfo('Hit <code>SPACE</code> to start recording...');
    }

    setPlayButton() {
        this.setButton('stop', false);
        this.setButton('play', true);
        this.setButton('record', false);
        this.setInfo('<span class="blink">PLAYING</span> — <code>SPACE</code> to stop');
    }

    setRecordButton() {
        this.setButton('stop', false);
        this.setButton('play', false);
        this.setButton('record', true);
        this.setInfo(' <span class="blink">RECORDING</span> — <code>SPACE</code> to stop');
    }

    setInfo(html) {
        document.querySelector('.info').innerHTML = html;
    }

    showFakeCursor() {  
        document.querySelector('.cursor').style.visibility = 'visible';
        document.body.style.cursor = 'none';
    }

    showRealCursor() {
        document.querySelector('.cursor').style.visibility = 'hidden';
        document.body.style.cursor = 'default';
    }
    
    addButtonListeners() {
        // button elements may prevent hiding the mouse pointer, so we use divs
        // do not add events to buttons elements directly otherwise pressing space may trigger the click event ...
        document.querySelector(".button.stop").addEventListener("click", () => this.stop());
        document.querySelector(".button.play").addEventListener("click", () => this.play());
        document.querySelector(".button.record").addEventListener("click", () => this.record());
    }
    
       
    addKeyboardListener() {
        window.addEventListener("keydown", (e) => this.keydown(e));
    }
    
    addPointerListener() {
        window.onpointermove = ((e) => {
            if(this.state === 'RECORD') {

                // console.log();
                this.timerUpdate();

                const {
                    pointerId, pointerType,
                    timeStamp, 
                    clientX, clientY,
                    pressure, tangentialPressure,
                    tiltX, tiltY, twist, 
                    height, width
                 } = e;

                this.frames.push({
                    id: pointerId,
                    type: pointerType,
                    time: timeStamp, 
                    x: clientX, 
                    y: clientY, 
                    pressure, tangentialPressure,
                    tiltX, tiltY, twist, 
                    height, width
                });
            }
        });
    }
 
    keydown(e) {
        switch(e.key) {
            case 'r':
                recorder.record();
                break;
            case 'p':
                recorder.play();
                break;
            case 'Escape':
                recorder.stop();
                break;
            case ' ':
                recorder.toggle();
                break;
            case 'Enter':
                recorder.play();
                break;
            case 's':
                //console.log('s = SAVE');
                break;
            default:
                //console.log();
        }
    }

}

const recorder = new Recorder();
