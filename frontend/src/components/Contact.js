import React from 'react';

const Contact = () => {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <div className="columns">
          <div className="column">
            <p><strong>Turismo Huarowilca</strong></p>
            <p>Huánuco, Perú</p>
            <p>Tel: (01) 6237</p>
            <p>
              Email: <a href="mailto:info@turismohuarowilca.com">info@turismohuarowilca.com</a>
            </p>
          </div>
          <div className="column">
            <div className="buttons is-centered">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="button is-info">
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="button is-info">
                Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="button is-info">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;