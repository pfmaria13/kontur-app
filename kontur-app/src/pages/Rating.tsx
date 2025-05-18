// src/pages/Rating.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo-kontur.png";
import playArrow from "../img/play-arrow.png";
import RatingLine from "../components/rating/RatingLine";

interface Entry {
    firstName: string;
    lastName: string;
    score: number;
}

interface UserEntry extends Entry {
    place: number;
}

export default function Rating() {
    const navigate = useNavigate();
    const [top, setTop] = useState<Entry[]>([]);
    const [user, setUser] = useState<UserEntry | null>(null);

    useEffect(() => {
        const tg = localStorage.getItem("telegram")!;
        fetch(`http://localhost:3000/leaderboard?telegram=${encodeURIComponent(tg)}`)
            .then(r=>r.json())
            .then((data:{top:Entry[], user:UserEntry})=>{
                setTop(data.top);
                setUser(data.user);
            });
    }, []);

    const handlePlayAgain = () => {
        navigate("/competition", { replace: true });
    };

    const total = user?.score ?? 0;

    return (
        <div className="rating-page-container container">
            <img src={logo} className="logo" alt="Логотип"/>
            <div className="rating-top">
                <h2 className="rating-main-text">
                    Поздравляем, вы прошли игру! Ваши баллы:
                </h2>
                <p className="rating-score">{total}</p>
                <button className="play-again" onClick={handlePlayAgain}>
                    <p>Играть!</p>
                    <img src={playArrow} className="play-again-arrow" alt=""/>
                </button>
            </div>
            <p className="general-rating-text">Общий рейтинг:</p>
            <div className="general-rating">
                {top.map((e, i) => (
                    <RatingLine
                        key={i}
                        num={i+1}
                        name={`${e.firstName} ${e.lastName}`}
                        score={e.score}
                        last={i+1}     // здесь можете вставить прошлое место, если храните
                        current={i+1}  // или просто текущее тоже
                    />
                ))}
                {user && user.place > top.length && (
                    <RatingLine
                        num={user.place}
                        name={`${user.firstName} ${user.lastName}`}
                        score={user.score}
                        last={user.place}
                        current={user.place}
                    />
                )}
            </div>
        </div>
    );
}
