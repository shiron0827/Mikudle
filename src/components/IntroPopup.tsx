import '../styles/IntroPopup.css';
import { GiDrumKit, GiGuitarBassHead } from "react-icons/gi";
import { FaArrowRightLong, FaImage } from "react-icons/fa6";
import { LuMicVocal } from "react-icons/lu";
import { MdPiano } from "react-icons/md";

interface Props {
    buttonClick: Function
}

function IntroPopup( {buttonClick} : Props ) {

    function handleClick() {
        buttonClick()
    }
    
    return ( 
            <div className="intro-popup-background">
                <section className="intro-popup-base">
                    <div className="mikudle-title-b">Mikudle</div>
                    <div className="subtext">Guess the song based on its tracks!</div>

                    <section className="guesses-parent-b">
                        <div className="guess-component">
                            <button className="guess-box-neutral-b">
                                <GiDrumKit className="guess-icon-b"/>
                                <div className="guess-box-active-b"></div>
                                <div className="guess-box-enabled1-b"></div>
                            </button>
                            <div className="inst-name">Drums</div>
                        </div>
                        <FaArrowRightLong className="arrows"/>
                        <div className="guess-component">
                            <button className="guess-box-neutral-b">
                                <GiGuitarBassHead className="guess-icon-b"/>
                                <div className="guess-box-active-b"></div>
                                <div className="guess-box-enabled2-b"></div>
                            </button>
                            <div className="inst-name">Bass</div>
                        </div>
                        <FaArrowRightLong className="arrows"/>
                        <div className="guess-component">
                            <button className="guess-box-neutral-b">
                                <MdPiano className="guess-icon-b"/>
                                <div className="guess-box-active-b"></div>
                                <div className="guess-box-enabled3-b"></div>
                            </button>
                            <div className="inst-name">Music</div>
                        </div>
                        <FaArrowRightLong className="arrows"/>
                        <div className="guess-component">
                                <button className="guess-box-neutral-b">
                                <FaImage className="guess-icon-b"/>
                                <div className="guess-box-enabled4-b"></div>
                            </button>
                            <div className="inst-name">Thumbnail</div>
                        </div>
                        <FaArrowRightLong className="arrows"/>
                        <div className="guess-component">
                            <button className="guess-box-neutral-b">
                                <LuMicVocal className="guess-icon-b"/>
                                <div className="guess-box-active-b"></div>
                                <div className="guess-box-enabled5-b"></div>
                            </button>
                            <div className="inst-name">Vocals</div>
                        </div>
                    </section>

                    <div className="subtext-b">More tracks will be added with each guess</div>

                    <button
                        className="go-button"
                        onClick={handleClick}
                    >Go!</button>
                </section>
            </div>
        )
}

export default IntroPopup;