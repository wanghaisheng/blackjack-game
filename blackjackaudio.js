class BlackjackAudio {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
    }

    initializeAudioOnUserGesture() {
        const initAudio = () => {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            document.removeEventListener("click", initAudio);
            document.removeEventListener("touchstart", initAudio);
        };

        document.addEventListener("click", initAudio);
        document.addEventListener("touchstart", initAudio);
    }

    playSound(type) {
        if (!this.isInitialized) {
            console.warn("Audio not initialized. Call initializeAudio() first.");
            return;
        }

        switch (type) {
            case "dealCard":
                this.playDealCardSound();
                break;
            case "win":
                this.playWinSound();
                break;
            case "lose":
                this.playLoseSound();
                break;
            case "chip":
                this.playChipSound();
                break;
        }
    }

    playDealCardSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            440,
            this.audioContext.currentTime + 0.1
        );

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.1
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    playWinSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
            659.25,
            this.audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
            783.99,
            this.audioContext.currentTime + 0.2
        );

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.3
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    playLoseSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(311.13, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
            233.08,
            this.audioContext.currentTime + 0.1
        );

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
            0.01,
            this.audioContext.currentTime +0.2
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    playChipSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            500,
            this.audioContext.currentTime + 0.1
        );

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.1
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
}