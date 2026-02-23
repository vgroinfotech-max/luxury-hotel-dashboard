import { FaVrCardboard } from "react-icons/fa";

export default function Gallery({ images }) {
  return (
    <div className="premium-card gallery">
      <h4 className="section-title">Gallery</h4>

       <div className="images-scroll">
        {images.map((img, i) => (
          <div className="img-wrapper" key={i}>
            <img src={img} alt={`Room ${i}`} />
          </div>
        ))}

        
        <div
          className="img-wrapper view360"
          onClick={() => alert("360° View coming soon")}
        >
          <FaVrCardboard size={28} />
          <span>360° View</span>
        </div>
      </div>
    </div>
  );
}
