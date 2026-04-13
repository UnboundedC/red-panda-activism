import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

function Header({ reduceMotion, setReduceMotion }) {
  return (
    <header className="header">
      <h1>🐾 Save the Red Pandas</h1>
      <nav>
        <a href="#about">About</a>
        <a href="#threats">Threats</a>
        <a href="#action">Take Action</a>
        <button
          className="reduce-motion-btn"
          onClick={() => setReduceMotion((v) => !v)}
        >
          {reduceMotion ? '✨ Enable Animations' : '⏸ Reduce Motion'}
        </button>
      </nav>
    </header>
  );
}

function ScrollSection({ children, reduceMotion, id, className }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [reduceMotion]);

  return (
    <section
      id={id}
      ref={ref}
      className={`scroll-section ${visible ? 'visible' : ''} ${reduceMotion ? 'no-animation' : ''} ${className || ''}`}
    >
      {children}
    </section>
  );
}

function Modal({ data, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="modal-image-wrapper">
          <img
            src={process.env.PUBLIC_URL + '/images/red-panda-modal.jpg'}
            alt="Cute red panda"
            className="modal-image"
          />
        </div>
        <h2>Thank You, {data.name}! 🎉</h2>
        <p>
          Your voice matters! We've recorded your signature from{' '}
          <strong>{data.city}</strong> to help protect red pandas.
        </p>
        <p className="modal-email">
          A confirmation will be sent to <strong>{data.email}</strong>.
        </p>
      </div>
    </div>
  );
}

function PetitionForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', city: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.city) return;
    onSubmit(form);
    setForm({ name: '', email: '', city: '', message: '' });
  };

  return (
    <form className="petition-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="city"
        placeholder="City / Hometown"
        value={form.city}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Why do red pandas matter to you? (optional)"
        value={form.message}
        onChange={handleChange}
        rows={3}
      />
      <button type="submit" className="submit-btn">
        ✍️ Sign the Petition
      </button>
    </form>
  );
}

function SignaturesList({ signatures }) {
  if (signatures.length === 0) return null;
  return (
    <div className="signatures">
      <h3>🖊️ {signatures.length} Signature{signatures.length > 1 ? 's' : ''}</h3>
      <ul>
        {signatures.map((s, i) => (
          <li key={i}>
            <strong>{s.name}</strong> from {s.city}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [signatures, setSignatures] = useState([]);
  const [modalData, setModalData] = useState(null);

  const handlePetitionSubmit = (data) => {
    setSignatures((prev) => [...prev, data]);
    setModalData(data);
  };

  const closeModal = useCallback(() => {
    setModalData(null);
  }, []);

  return (
    <div className="app">
      <Header reduceMotion={reduceMotion} setReduceMotion={setReduceMotion} />

      <div className="hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/red-panda-modal.jpg)` }}>
        <div className="hero-overlay">
          <h2>Red Pandas Need Our Help</h2>
          <p>Fewer than 10,000 remain in the wild. Act now before it's too late.</p>
          <a href="#action" className="hero-cta">
            Sign the Petition
          </a>
        </div>
      </div>

      <ScrollSection id="about" reduceMotion={reduceMotion}>
        <h2>About Red Pandas</h2>
        <div className="two-col">
          <img
            src={process.env.PUBLIC_URL + '/images/red-panda-modal.jpg'}
            alt="Red panda in a tree"
          />
          <div>
            <p>
              The red panda (<em>Ailurus fulgens</em>) is a small, arboreal mammal
              native to the eastern Himalayas and southwestern China. Despite their
              name, red pandas are not closely related to giant pandas — they are
              the only living member of the family <em>Ailuridae</em>.
            </p>
            <p>
              These shy, solitary creatures spend most of their lives in trees and
              even sleep aloft. Their diet is almost entirely bamboo, though they
              also eat berries, blossoms, and bird eggs.
            </p>
          </div>
        </div>
      </ScrollSection>

      <ScrollSection id="threats" reduceMotion={reduceMotion} className="dark-section">
        <h2>Why Are They Endangered?</h2>
        <div className="cards">
          <div className="card">
            <span className="card-icon">🌲</span>
            <h3>Habitat Loss</h3>
            <p>
              Deforestation and land-use change destroy the temperate forests red
              pandas call home.
            </p>
          </div>
          <div className="card">
            <span className="card-icon">🪤</span>
            <h3>Poaching</h3>
            <p>
              Red pandas are hunted for their pelts and sometimes captured for the
              illegal pet trade.
            </p>
          </div>
          <div className="card">
            <span className="card-icon">🌡️</span>
            <h3>Climate Change</h3>
            <p>
              Rising temperatures shift bamboo growth zones, reducing available
              food sources.
            </p>
          </div>
        </div>
      </ScrollSection>

      <ScrollSection reduceMotion={reduceMotion}>
        <h2>What You Can Do</h2>
        <div className="actions-grid">
          <div className="action-item">
            <span>📢</span>
            <h3>Spread Awareness</h3>
            <p>Share red panda facts on social media and in your community.</p>
          </div>
          <div className="action-item">
            <span>💰</span>
            <h3>Donate</h3>
            <p>Support organizations like the Red Panda Network directly.</p>
          </div>
          <div className="action-item">
            <span>🌱</span>
            <h3>Adopt Sustainably</h3>
            <p>Choose products that don't contribute to deforestation.</p>
          </div>
          <div className="action-item">
            <span>✍️</span>
            <h3>Sign Our Petition</h3>
            <p>Scroll down to add your name and demand stronger protections.</p>
          </div>
        </div>
      </ScrollSection>

      <ScrollSection id="action" reduceMotion={reduceMotion} className="dark-section">
        <h2>Sign the Petition</h2>
        <p className="petition-intro">
          Demand that world leaders strengthen protections for red panda habitats.
          Every signature counts!
        </p>
        <PetitionForm onSubmit={handlePetitionSubmit} />
        <SignaturesList signatures={signatures} />
      </ScrollSection>

      <footer className="footer">
        <p>
          © 2026 Save the Red Pandas · Built with ❤️ for endangered species
        </p>
      </footer>

      {modalData && <Modal data={modalData} onClose={closeModal} />}
    </div>
  );
}

export default App;
