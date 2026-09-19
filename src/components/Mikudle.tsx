import '../styles/Mikudle.css';
import AudioEngine from './AudioEngine'
import Waveform from './Waveform'
import { GiDrumKit, GiGuitarBassHead } from "react-icons/gi";
import { FaRegCirclePause, FaImage } from "react-icons/fa6";
import { LuMicVocal } from "react-icons/lu";
import { MdOutlineForward10, MdOutlineReplay10, MdPiano } from "react-icons/md";
import { useEffect, useRef, useState } from 'react';
import { CgPlayButtonO } from "react-icons/cg";
import { IoVolumeHigh, IoVolumeLowSharp, IoVolumeMedium, IoVolumeOff } from "react-icons/io5";
import Popup from './Popup';
import IntroPopup from './IntroPopup';

interface Song {
    songId: number;
    titles: string[];
    youtubeUrl: string;
    thumbUrl: string;
}

function Mikudle() {
    const engineRef = useRef(new AudioEngine());
    const init = useRef(false);

    const [level, setLevel] = useState(0);
    const [guessText, setGuessText] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState([false, true, true, true, true]);
    const [trackEnabled, setTrackEnabled] = useState([true, false, false, false, false]);
    const [volume, setVolume] = useState(50);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [song, setSong] = useState<Song | null>(null);
    //const [loading, setLoading] = useState(true);
    const [won, setWon] = useState(false);

    const [introOpen, setIntroOpen] = useState(true);
    const [resultsOpen, setResultsOpen] = useState(true);
    const [finished, setFinished] = useState(false);


    const mixedPeaks = loaded ? engineRef.current.getMixedPeaks() : null;

    async function LoadData() {
        const response = await fetch(
            `${import.meta.env.BASE_URL}/songs/today/songData.json`
        );

        if (!response.ok) {
            throw new Error("Failed to load song data");
        }
        setSong(await response.json());
    }

    function ToggleTrack(num: number, forceEnable: boolean = false) {
        if(num != 3 && num < 5) {
            if(num > 3) engineRef.current.enableTrack(num - 1, forceEnable);
            else engineRef.current.enableTrack(num, forceEnable);

            if(forceEnable) setTrackEnabled(prevTags => prevTags.map((val, index) => index === num ? true : val));
            else setTrackEnabled(prevTags => prevTags.map((val, index) => index === num ? !val : val));
        }
    }

    function CheckAnswer(guess: string) {
        if(song == null) return;
        const correct = song.titles.some(
            title => guess.toLowerCase() === title.toLowerCase()
        );
        if (correct) {
            setWon(true);
            Finish();
            return;
        }
        if(level >= 4) {
            setWon(false);
            Finish();
            return;
        }
        setLevel(prev => prev + 1);
    }

    function Finish() {
        setFinished(true);
        for(let i = 0; i < 4; i++) {
            engineRef.current.enableTrack(i, true);
        }
        setTrackEnabled([true, true, true, true, true]);
        setButtonDisabled([false, false, false, false, false]);
    }

    useEffect(() => {
        if(init.current) return;
        init.current = true;
        LoadData();
        async function LoadSong() {
            await engineRef.current.addTrack(`${import.meta.env.BASE_URL}songs/today/fullsong_(Drums)_htdemucs_ft.wav`);
            await engineRef.current.addTrack(`${import.meta.env.BASE_URL}songs/today/fullsong_(Bass)_htdemucs_ft.wav`);
            await engineRef.current.addTrack(`${import.meta.env.BASE_URL}songs/today/fullsong_(Other)_htdemucs_ft.wav`);
            await engineRef.current.addTrack(`${import.meta.env.BASE_URL}songs/today/fullsong_(Vocals)_htdemucs_ft.wav`);
            ToggleTrack(0, true);

            setLoaded(true);
        }

        LoadSong();
    }, []);

    useEffect(() => {
        if (level === 0 || level > 4) return;

        setButtonDisabled(prev => {
            const updated = [...prev];
            updated[level] = false;
            return updated;
        });

        ToggleTrack(level);
    }, [level]);

    function playButton() {
        if(!playing) {
            engineRef.current.play();
            setPlaying(true);
        }
        else {
            engineRef.current.pause();
            setPlaying(false);
        }
    }

    useEffect(() => {
        if (!loaded) return;

        let animation: number;

        const update = () => {
            const duration = engineRef.current.getDuration();

            if (duration > 0) {
                setProgress(engineRef.current.getProgress());
            }

            animation = requestAnimationFrame(update);
        };

        animation = requestAnimationFrame(update);

        return () => cancelAnimationFrame(animation);
    }, [loaded]);

    function CloseIntro() {
        setIntroOpen(false);
    }

    function ViewResults() {
        setResultsOpen(true);
    }

    function CloseResults() {
        setResultsOpen(false);
    }

    return ( 
        <main>
            {introOpen && (
                <IntroPopup buttonClick={CloseIntro}></IntroPopup>
            )}
            <div className="mikudle-background">
                <section className="top-bar">
                    <h1 className="mikudle-title">Mikudle</h1>
                </section>
                <section className="guesses-parent">            
                    <button className="guess-box-neutral" 
                        onClick = {() => ToggleTrack(0)}
                        disabled = {buttonDisabled[0]}
                    >
                        <GiDrumKit className="guess-icon"/>
                        {!buttonDisabled[0] && (
                            <div className="guess-box-active"></div>
                        )}
                        {trackEnabled[0] && (
                            <div className="guess-box-enabled1"></div>
                        )}
                    </button>
                
                    <button className="guess-box-neutral" 
                        onClick = {() => ToggleTrack(1)}
                        disabled = {buttonDisabled[1]}
                    >
                        <GiGuitarBassHead className="guess-icon"/>
                        {!buttonDisabled[1] && (
                            <div className="guess-box-active"></div>
                        )}
                        {trackEnabled[1] && (
                            <div className="guess-box-enabled2"></div>
                        )}
                    </button>
                    <button className="guess-box-neutral" 
                        onClick = {() => ToggleTrack(2)}
                        disabled = {buttonDisabled[2]}
                    >
                        <MdPiano className="guess-icon"/>
                        {!buttonDisabled[2] && (
                            <div className="guess-box-active"></div>
                        )}
                        {trackEnabled[2] && (
                            <div className="guess-box-enabled3"></div>
                        )}
                    </button>
                    <button className="guess-box-neutral" 
                        disabled = {buttonDisabled[3]}
                    >
                        <FaImage className="guess-icon"/>
                        {!buttonDisabled[3] && (
                            <div className="guess-box-enabled4"></div>
                        )}
                    </button>
                    <button className="guess-box-neutral" 
                        onClick = {() => ToggleTrack(4)}
                        disabled = {buttonDisabled[4]}
                    >
                        <LuMicVocal className="guess-icon"/>
                        {!buttonDisabled[4] && (
                            <div className="guess-box-active"></div>
                        )}
                        {trackEnabled[4] && (
                            <div className="guess-box-enabled5"></div>
                        )}
                    </button>
                </section>
                <section className="music-play-box">
                    {level >= 3 && song ? (
                        <div className="thumb-container">
                            <img src={song["thumbUrl"]} className="thumbnail"></img>
                            <img src={song["thumbUrl"]} className="thumbnail-reflection"></img>
                        </div>
                    ) : (
                        <div className="thumb-container">
                            <div className="thumbnail-hidden"></div>
                            <img src="https://preview.colorkit.co/color/808080.png?size=wallpaper&static=true" className="thumbnail-reflection"></img>
                        </div>
                    )}
                    {loaded &&
                        <div className="waveform">
                            <Waveform
                                waveformData={mixedPeaks!.peaks}
                                maxAmplitude={mixedPeaks!.maxAmplitude}
                                progress={progress}
                                duration={engineRef.current.getDuration()}
                                onSeek={(time) => engineRef.current.seek(time)}
                            />
                        </div>
                    }
                    <div className="playback-control-grid">
                        <div className="volume-parent">
                            {volume <= 20 && (
                                <IoVolumeOff className="volume-icon"/>    
                            )}
                            {volume > 20 && volume <= 45 && (
                                <IoVolumeLowSharp className="volume-icon"/>
                            )}
                            {volume > 45 && volume <= 70 && (
                                <IoVolumeMedium className="volume-icon"/>
                            )}
                            {volume > 70 && (
                                <IoVolumeHigh className="volume-icon"/>
                            )}
                            <input
                                className="volume-slider"
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                            />
                        </div>

                        <MdOutlineReplay10 className="skip-button-left"/>
                        
                        <button
                            className="play-button"
                            onClick={
                                playButton
                            }
                        > {engineRef.current.playing ? <FaRegCirclePause className="pause-icon"/> : <CgPlayButtonO className="play-icon"/>} </button>
                        
                        <MdOutlineForward10 className="skip-button-right"/>
                    </div>
                </section>
                
                {!finished && (
                    <div className="answer-section">
                        <input
                            className="answer-box"
                            type="text"
                            placeholder="Guess the song"
                            onChange={(e) => setGuessText(e.target.value)
                        }></input>
                        <button className="answer-button" onClick={() => CheckAnswer(guessText)}>&#8594;</button>
                    </div>
                )}

                {finished && (
                    <>
                        <button 
                            className="results-button"
                            onClick={ViewResults}
                        >View results</button>
                    </>
                )}
                {finished && resultsOpen && (
                    <Popup
                        guesses = {level + 1}
                        won = {won}
                        title={song ? song["titles"][0] : ""}
                        link={song ? song["youtubeUrl"] : ""}
                        buttonClick={CloseResults}
                    ></Popup>
                )}
            </div>
        </main>
        );
}

export default Mikudle;