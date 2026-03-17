import React from "react";

function StatsCard({ title, value, lastUpdated }) {
    console.log(title + " rendered");

    return (
        <div className="card">
            <h4>{title}</h4>
            <p>Value: {value}</p>
            <p>Last Updated: {lastUpdated}</p>
        </div>
    );
}
    export default React.memo(StatsCard);