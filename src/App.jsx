import React, {useState} from "react";
import "./../styles.css";

function App() {
    return (
        <div>
            <header>
                <h1 className="main-title">おのまーず</h1>
                <h1>Welcome to [Your Club Name]</h1>
                <p>Join the team. Build the legacy. Play with passion!</p>
            </header>

            <main>
                <section id="about">
                    <h2>我々について</h2>
                    <p>初心者と経験者が混在しているチームで楽しみながらも本気で勝ちに行く混合バレーボールチームです。</p>
                </section>

                <section id="gallery">
                    <h2>写真</h2>
                    <div className="gallery">
                        <img src="./../images/team1.jpg" alt="Team Celebration" />
                        <img src="./../images/team2.jpg" alt="Team Celebration" />
                        <img src="./../images/victory1.jpg" alt="Winning Moment" />
                    </div>
                    <div className="modal" id="modal">
                        <span className="modal-close" id="modal-close">&times;</span>
                        <img id="modal-img" src="" alt="" />
                    </div>
                </section>

                <section id="videos">
                    <h2>Videos</h2>
                    <div className="video-gallery">
                        <iframe src="https://www.youtube.com/embed/[YourVideoID1]" allowFullScreen></iframe>
                        <iframe src="https://www.youtube.com/embed/[YourVideoID2]" allowFullScreen></iframe>
                        <iframe src="https://www.youtube.com/embed/[YourVideoID3]" allowFullScreen></iframe>
                    </div>
                </section>

                <section id="members">
                    <h2>Our Team</h2>
                    <div className="members">
                        <div className="member-card">
                            <img src="images/member1.jpg" alt="John Doe" />
                            <h3>John Doe</h3>
                            <p>Position: Captain</p>
                        </div>
                        <div className="member-card">
                            <img src="images/member2.jpg" alt="Jane Smith" />
                            <h3>Jane Smith</h3>
                            <p>Position: Setter</p>
                        </div>
                        <div className="member-card">
                            <img src="images/member3.jpg" alt="Mike Brown" />
                            <h3>Mike Brown</h3>
                            <p>Position: Libero</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <p>&copy; 2024 おのまーず</p>
            </footer>
        </div>
    );
}

export default App;
