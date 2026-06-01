import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '24px',
      color: 'var(--text-muted)',
      borderTop: '1px solid var(--border-color)',
      fontSize: '14px',
      background: 'var(--bg-secondary)',
      marginTop: 'auto'
    }}>
      <p>&copy; {new Date().getFullYear()} Antigravity Shop. Xây dựng bằng React & Spring Boot 3.</p>
    </footer>
  );
};

export default Footer;
