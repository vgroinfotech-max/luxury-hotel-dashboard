import "../styles/FrontendSettings.css";
import { useState } from "react";
import {
  FaHotel,
  FaPalette,
  FaRegCopyright,
  FaHome,
  FaImage,
  FaPhoneAlt,
  FaLink,
} from "react-icons/fa";

export default function FrontendSettings() {
  const [heroImage, setHeroImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const handleHeroImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setHeroImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setGalleryImages(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="frontend-settings-page">

      
      <div className="settings-page-header">
        <h2>Frontend Settings</h2>
        <p>Control website appearance & home page content</p>
      </div>

      
      <div className="settings-grid">

        {/* GENERAL */}
        <div className="settings-card">
          <h3><FaHotel /> General</h3>
          <div className="form-group">
            <label>Website Name</label>
            <input type="text" placeholder="Hotel Grand Palace" />
          </div>
          <div className="form-group">
            <label>Tagline</label>
            <input type="text" placeholder="Luxury • Comfort • Elegance" />
          </div>
        </div>

        <div className="settings-card">
          <h3><FaPalette /> Theme</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Primary Color</label>
              <input type="color" />
            </div>
            <div className="form-group">
              <label>Secondary Color</label>
              <input type="color" />
            </div>
          </div>
          <div className="form-group">
            <label>Font Family</label>
            <select>
              <option>Inter</option>
              <option>Poppins</option>
              <option>Montserrat</option>
              <option>Playfair Display</option>
            </select>
          </div>
        </div>

       
        <div className="settings-card">
          <h3>Header</h3>
          <div className="toggle-row">
            <span>Enable Header</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="toggle-row">
            <span>Sticky Header</span>
            <input type="checkbox" />
          </div>
        </div>

        
        <div className="settings-card">
          <h3><FaRegCopyright /> Footer</h3>
          <div className="form-group">
            <label>Footer Text</label>
            <input type="text" placeholder="© 2025 Hotel Luxe. All rights reserved." />
          </div>
        </div>

       
        <div className="settings-card full-width">
          <h3><FaHome /> Home Page – Hero</h3>

          <div className="form-group">
            <label>Hero Title</label>
            <input type="text" placeholder="Luxury Stay Experience" />
          </div>

          <div className="form-group">
            <label>Hero Subtitle</label>
            <input type="text" placeholder="Book premium rooms at best prices" />
          </div>

          <div className="upload-box">
            <FaImage />
            <span>Upload Hero Image</span>
            <input type="file" accept="image/*" onChange={handleHeroImage} />
          </div>

          {heroImage && (
            <img src={heroImage} alt="Hero Preview" className="image-preview" />
          )}
        </div>
       
<div className="settings-card full-width">
  <h3>About Section</h3>

  <div className="toggle-row">
    <span>Enable About Section</span>
    <input type="checkbox" defaultChecked />
  </div>

  <div className="form-group">
    <label>About Title</label>
    <input type="text" placeholder="About Our Hotel" />
  </div>

  <div className="form-group">
    <label>About Description</label>
    <textarea
      rows="4"
      placeholder="We offer luxurious rooms, modern amenities and world-class hospitality."
    />
  </div>

  <div className="upload-box">
    <span>Upload About Image</span>
    <input type="file" accept="image/*" />
  </div>
</div>

<div className="settings-card full-width">
  <h3>Rooms Section</h3>

  <div className="toggle-row">
    <span>Enable Rooms Section</span>
    <input type="checkbox" defaultChecked />
  </div>

  <div className="form-group">
    <label>Section Title</label>
    <input type="text" placeholder="Rooms & Suites" />
  </div>

  <div className="form-group">
    <label>Section Description</label>
    <textarea
      rows="3"
      placeholder="Discover our luxurious rooms designed for comfort and elegance."
    />
  </div>

 
  <div className="room-admin-card">
    <h4>Room 1</h4>

    <div className="form-group">
      <label>Room Name</label>
      <input type="text" placeholder="Single Room" />
    </div>

    <div className="form-group">
      <label>Price (per night)</label>
      <input type="text" placeholder="₹3,500" />
    </div>

    <div className="form-group">
      <label>Room Features</label>
      <input
        type="text"
        placeholder="1 Bed, Free WiFi, AC"
      />
    </div>

    <div className="upload-box">
      <span>Upload Room Image</span>
      <input type="file" accept="image/*" />
    </div>
  </div>

  {/* ROOM 2 */}
  <div className="room-admin-card">
    <h4>Room 2</h4>

    <div className="form-group">
      <label>Room Name</label>
      <input type="text" placeholder="Family Room" />
    </div>

    <div className="form-group">
      <label>Price (per night)</label>
      <input type="text" placeholder="₹6,500" />
    </div>

    <div className="form-group">
      <label>Room Features</label>
      <input
        type="text"
        placeholder="2 Beds, Balcony, Free WiFi"
      />
    </div>

    <div className="upload-box">
      <span>Upload Room Image</span>
      <input type="file" accept="image/*" />
    </div>
  </div>

  {/* ROOM 3 */}
  <div className="room-admin-card">
    <h4>Room 3</h4>

    <div className="form-group">
      <label>Room Name</label>
      <input type="text" placeholder="Presidential Suite" />
    </div>

    <div className="form-group">
      <label>Price (per night)</label>
      <input type="text" placeholder="₹15,000" />
    </div>

    <div className="form-group">
      <label>Room Features</label>
      <input
        type="text"
        placeholder="King Bed, Jacuzzi, Sea View"
      />
    </div>

    <div className="upload-box">
      <span>Upload Room Image</span>
      <input type="file" accept="image/*" />
    </div>
  </div>
</div>


        {/* GALLERY */}
        <div className="settings-card full-width">
          <h3><FaImage /> Home Page – Gallery</h3>

          <div className="upload-box">
            <FaImage />
            <span>Upload Gallery Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImages}
            />
          </div>

          <div className="gallery-preview">
            {galleryImages.map((img, i) => (
              <img key={i} src={img} alt="Gallery Preview" />
            ))}
          </div>
        </div>

       
{/* TESTIMONIALS SECTION */}
<div className="settings-card full-width">
  <h3>Testimonials</h3>

  <div className="toggle-row">
    <span>Enable Testimonials</span>
    <input type="checkbox" defaultChecked />
  </div>

  <div className="form-group">
    <label>Section Title</label>
    <input type="text" placeholder="What Our Guests Say" />
  </div>

  <div className="form-group">
    <label>Testimonial 1</label>
    <textarea rows="2" placeholder="Amazing stay and great service!" />
    <input type="text" placeholder="— John Doe" />
  </div>

  <div className="form-group">
    <label>Testimonial 2</label>
    <textarea rows="2" placeholder="Luxurious rooms and friendly staff." />
    <input type="text" placeholder="— Sarah Williams" />
  </div>

  <div className="form-group">
    <label>Testimonial 3</label>
    <textarea rows="2" placeholder="Best hotel experience ever!" />
    <input type="text" placeholder="— Rahul Sharma" />
  </div>
</div>
{/* BLOGS SECTION */}
<div className="settings-card full-width">
  <h3>Blogs Section</h3>

  <div className="toggle-row">
    <span>Enable Blogs Section</span>
    <input type="checkbox" defaultChecked />
  </div>

  <div className="form-group">
    <label>Section Title</label>
    <input type="text" placeholder="Latest Blogs & Updates" />
  </div>

  <div className="form-group">
    <label>Section Description</label>
    <textarea
      rows="3"
      placeholder="Read our latest travel tips, hotel updates and experiences."
    />
  </div>

  {/* BLOG 1 */}
  <div className="blog-admin-card">
    <h4>Blog 1</h4>

    <div className="form-group">
      <label>Blog Title</label>
      <input type="text" placeholder="Top 5 Luxury Stays in 2025" />
    </div>

    <div className="form-group">
      <label>Short Description</label>
      <textarea rows="2" placeholder="Discover the best luxury hotels for your next vacation." />
    </div>

    <div className="form-group">
      <label>Author Name</label>
      <input type="text" placeholder="Admin" />
    </div>

    <div className="form-group">
      <label>Publish Date</label>
      <input type="date" />
    </div>

    <div className="upload-box">
      <span>Upload Blog Cover Image</span>
      <input type="file" accept="image/*" />
    </div>
  </div>

  <div className="blog-admin-card">
    <h4>Blog 2</h4>

    <div className="form-group">
      <label>Blog Title</label>
      <input type="text" placeholder="Why Our Guests Love Us" />
    </div>

    <div className="form-group">
      <label>Short Description</label>
      <textarea rows="2" placeholder="A glimpse into our hospitality and service excellence." />
    </div>

    <div className="form-group">
      <label>Author Name</label>
      <input type="text" placeholder="Hotel Manager" />
    </div>

    <div className="form-group">
      <label>Publish Date</label>
      <input type="date" />
    </div>

    <div className="upload-box">
      <span>Upload Blog Cover Image</span>
      <input type="file" accept="image/*" />
    </div>
  </div>
</div>

 {/* CONTACT */}
        <div className="settings-card">
          <h3><FaPhoneAlt /> Contact Info</h3>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" placeholder="+91 98765 43210" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="info@hotel.com" />
          </div>
        </div>
        {/* SOCIAL */}
        <div className="settings-card">
          <h3><FaLink /> Social Links</h3>
          <div className="form-group">
            <label>Instagram</label>
            <input type="text" placeholder="instagram.com/hotel" />
          </div>
          <div className="form-group">
            <label>Facebook</label>
            <input type="text" placeholder="facebook.com/hotel" />
          </div>
        </div>

      </div>

      {/* SAVE */}
      <div className="save-bar">
        <button className="save-btn">Save Settings</button>
      </div>
    </div>
  );
}
