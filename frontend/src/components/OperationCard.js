import React from 'react';
import { useNavigate } from 'react-router-dom';

function OperationCard({ name, image, path }) {
    const navigate = useNavigate();

    return (
        <div className="operation-card" onClick={() => navigate(path)}>
            <img src={image} alt={name} className="operation-image" />
            <h3 className="operation-name">{name}</h3>
        </div>
    );
}

export default OperationCard;
