import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const CabCard = ({
    availability,
    belongsTo,
    email,
    _id,
    capacity,
    createdAt,
    feature,
    isReady,
    modelName,
    photos,
    price,
    type
}) => {

    return (

        <section className="cab-card">
            <div className="carousel">
                {photos.length > 0 ? (
                    photos.map((photo, index) => (
                        <img key={index} src={photo.url} alt={`Photo ${index + 1}`} />
                    ))
                ) : (
                    <p>No photos available</p>
                )}
            </div>
            <div className="cab-info">
                <h2>{modelName}</h2>
                <p className="price">₹ {price}</p>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi at ipsa vero neque optio commodi laudantium! </p>
                <div className="features">
                    <span>Air Condition</span>
                    <span>{_id}</span>

                    <span>Diesel</span>
                    <span>Auto</span>
                    <span>{capacity} Seater</span>
                </div>
                <Link className="book-button" to={`/cabs/${_id}`}>Book It</Link>
            </div>

        </section>

    );
};

export default CabCard;
