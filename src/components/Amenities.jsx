import {
  FaWifi,
  FaSnowflake,
  FaTv,
  FaCoffee,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaConciergeBell,
  FaSpa,
  FaUmbrellaBeach,
} from "react-icons/fa";

const amenityIcons = {
  wifi: <FaWifi color="#4CAF50" size={24} />,          
  ac: <FaSnowflake color="#00BCD4" size={24} />,       
  tv: <FaTv color="#2196F3" size={24} />,             
  breakfast: <FaCoffee color="#FF9800" size={24} />,  
  parking: <FaParking color="#795548" size={24} />,   
  pool: <FaSwimmingPool color="#03A9F4" size={24} />, 
  gym: <FaDumbbell color="#9C27B0" size={24} />,      
  roomservice: <FaConciergeBell color="#FFC107" size={24} />, 
  spa: <FaSpa color="#E91E63" size={24} />,           
  balcony: <FaUmbrellaBeach color="#009688" size={24} />, 
};
export default function Amenities({ amenities }) {
  return (
    <div className="premium-card">
      <h4 className="section-title">Amenities</h4>

      <div className="amenities">
        {amenities.map((a, i) => {
          const key = a.trim().toLowerCase(); // normalize
          return (
            <span key={i} className="amenity">
              <span className="amenity-icon">
                {amenityIcons[key] || <FaCoffee color="#FF9800" size={24} />}
              </span>
              {a.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
}
