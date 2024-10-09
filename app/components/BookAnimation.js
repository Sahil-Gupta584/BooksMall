import React from 'react';
import './BookAnimation.css'; // Include the animation styles

const BookAnimation = () => {
    return (
        <div className="book-animation-container">
            <div className="book">
                <div className="front-cover"></div>
                <div className="pages"></div>
                <div className="back-cover"></div>
            </div>
        </div>
    );
}

export default BookAnimation;
