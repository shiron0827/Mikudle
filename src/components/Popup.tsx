import { useEffect, useState } from 'react';
import '../styles/Popup.css';
import YoutubeEmbed from './YoutubeEmbed';

interface Props {
    guesses: number;
    won: boolean;
    title: string;
    link: string;
    buttonClick: Function
}

interface GameStats {
    played: number;
    wins: number;
    currentStreak: number;
    maxStreak: number;
}

function Popup({ guesses, won, title, link, buttonClick }: Props) {
    const [headTxt, setHeadTxt] = useState("");
    const [shareTxt, setShareTxt] = useState("");
    const [embedId, setEmbedId] = useState("");
    const [stats, setStats] = useState<GameStats>(() => {
        try {
            const saved = localStorage.getItem("gameStats");

            return saved
                ? JSON.parse(saved)
                : {
                    played: 0,
                    wins: 0,
                    currentStreak: 0,
                    maxStreak: 0
                };
        } catch (error) {
            console.error("Error reading game stats:", error);

            return {
                played: 0,
                wins: 0,
                currentStreak: 0,
                maxStreak: 0
            };
        }
    });

    useEffect(() => {
        setEmbedId(new URL(link).pathname.slice(1));

        if (guesses === 1) {
            setHeadTxt("You guessed the song in 1 guess!");
        } else if (won) {
            setHeadTxt(`You guessed the song in ${guesses} guesses!`);
        } else {
            setHeadTxt("You didn't guess the song... Better luck next time!");
        }

        let txt = "";
        if(!won) txt = ":blue_square::blue_square::blue_square::blue_square::blue_square:"
        else {
            for(let i = 1; i < guesses; i++) {
                txt += ":blue_square:"
            }
            if(guesses < 6) txt += ":green_square:"
            for(let j = guesses + 1; j < 6; j++) {
                txt += ":white_large_square:"
            }
        }
        setShareTxt(txt);

        setStats(prev => {
            const newPlayed = prev.played + 1;
            const newWins = prev.wins + (won ? 1 : 0);

            const newCurrentStreak = won
                ? prev.currentStreak + 1
                : 0;

            const newMaxStreak = Math.max(
                prev.maxStreak,
                newCurrentStreak
            );

            const newStats = {
                played: newPlayed,
                wins: newWins,
                currentStreak: newCurrentStreak,
                maxStreak: newMaxStreak
            };

            localStorage.setItem(
                "gameStats",
                JSON.stringify(newStats)
            );

            return newStats;
        });
    }, []);

    function exit() {
        buttonClick()
    }


    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        if(!isCopied) {
            try {
                const date = new Date();
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;

                await navigator.clipboard.writeText("Mikudle " + formattedDate + "\n" + window.location.href + "\n" + shareTxt);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    }
    
    return ( 
        <div className="popup-background">
            <section className="popup-base">
                <button 
                    className="x-button"
                    onClick={() => exit()}
                >X</button>
                <div className="correct-answer-text">The correct answer was: {title}</div>
                <div className="guesses-text">{headTxt}</div>
                <div className="yt-parent">
                    <YoutubeEmbed embedId={embedId}></YoutubeEmbed>
                </div>
                <div className="stats-section">
                    <div>{stats["played"]} games played</div>
                    <div>{stats["wins"]} wins</div>
                    <div>{stats["currentStreak"]} current streak</div>
                    <div>{stats["maxStreak"]} max streak</div>
                </div>
                <button
                    className="share-button"
                    onClick={() => handleCopy()}
                >Share</button>
            </section>
        </div>
    )
}

export default Popup;