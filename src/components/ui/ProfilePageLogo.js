import React from "react";
import "styles/ui/profilePageLogo.scss";

export const ProfilePageLogo = props => {
    return (
        <svg viewBox="0 0 24 24"
             className="profilePageLogo">
            <circle cx="12" cy="5.5" r="2.5"/>
            <path d="M15 10H9a4 4 0 0 0-4 4v7h14v-7a4 4 0 0 0-4-4z"/>
        </svg>
    );
};
