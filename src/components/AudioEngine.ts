interface Track {
    buffer: AudioBuffer;
    gain: GainNode;
    enabled: boolean;
    peaks: Float32Array;
}

interface MixedPeaks {
    peaks: Float32Array;
    maxAmplitude: number;
}

export class AudioEngine {
    private context = new AudioContext();

    private tracks: Track[] = [];
    private sources: AudioBufferSourceNode[] = [];
    public playing = false;

    private startTime = 0;
    private pauseOffset = 0;

    async addTrack(url: string) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        const buffer = await this.context.decodeAudioData(arrayBuffer);

        const gain = this.context.createGain();
        gain.connect(this.context.destination);
        gain.gain.value = 0;
        
        const enabled = false;

        const peaks = this.calculatePeaks(buffer);

        this.tracks.push({
            buffer,
            gain,
            enabled,
            peaks
        });

        console.log(url);
    }

    enableTrack(inst: number, forceEnable: boolean = false) {
        if(!this.tracks[inst].enabled || forceEnable) {
            this.tracks[inst].enabled = true;
            this.tracks[inst].gain.gain.value = 1;
        } else {
            this.tracks[inst].enabled = false;
            this.tracks[inst].gain.gain.value = 0;
        }

        console.log(inst + ": " + this.tracks[inst].gain.gain.value);
    }

    calculatePeaks(
        buffer: AudioBuffer,
        resolution = 100
    ): Float32Array {
        const samples = buffer.getChannelData(0);

        const blockSize = Math.floor(samples.length / resolution);

        const peaks = new Float32Array(resolution);

        for (let i = 0; i < resolution; i++) {
            let max = 0;

            const start = i * blockSize;
            const end = start + blockSize;

            for (let j = start; j < end; j++) {
                max = Math.max(max, Math.abs(samples[j]));
            }

            peaks[i] = max;
        }

        return peaks;
    }

    getMixedPeaks(): MixedPeaks {
        const result = new Float32Array(this.tracks[0].peaks.length);
        let max = 0;

        for (const track of this.tracks) {
            if (!track.enabled) continue;

            for (let i = 0; i < result.length; i++) {
                result[i] += track.peaks[i];
                max = Math.max(max, result[i]);
            }
        }

        return {
            peaks: result,
            maxAmplitude: max
        };
    }

    getDuration() {
        return this.tracks[0].buffer.duration;
    }

    getProgress() {
        const duration = this.getDuration();
        if (duration === 0) return 0;
        return this.getCurrentTime() / duration;
    }

    play = async () => {
        await this.context.resume();

        this.startTime = this.context.currentTime - this.pauseOffset;

        this.sources = [];

        for (const track of this.tracks) {
            const source = this.context.createBufferSource();

            source.buffer = track.buffer;
            source.connect(track.gain);

            source.start(
                this.context.currentTime,
                this.pauseOffset
            );

            this.sources.push(source);
        }

        this.playing = true;
    }

    pause() {
        if (!this.playing) return;

        this.pauseOffset =
            this.context.currentTime - this.startTime;

        for (const source of this.sources) {
            source.stop();
        }

        this.sources = [];

        this.playing = false;
    }

    seek(seconds: number) {
        console.log(seconds);
        this.pauseOffset = seconds;

        if (!this.playing) return;

        for (const source of this.sources) {
            source.stop();
        }

        this.play();
    }

    getCurrentTime() {
        if (!this.playing) {
            return this.pauseOffset;
        }

        return this.context.currentTime - this.startTime;
    }
}

export default AudioEngine;