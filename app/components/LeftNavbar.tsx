'use client';

export default function LeftNavbar() {
  const rulebookUrl = "https://docs.google.com/document/d/1asukNIo8Kfx_qK9IzvarUcNpbX2Wn9TszDawgh17Jh4/preview";
  
  const handleRulebookClick = () => {
    window.open(rulebookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', paddingLeft: '50px', position: 'fixed', zIndex: 1001 }}>
      <div style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', transition: 'opacity 0.2s ease, transform 0.2s ease' }}>
        ABOUT
      </div>
      <div style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', transition: 'opacity 0.2s ease, transform 0.2s ease' }}>
        HOME
      </div>
      <div style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', transition: 'opacity 0.2s ease, transform 0.2s ease' }} onClick={handleRulebookClick}>
        RULE BOOK
      </div>
    </div>
  );
}