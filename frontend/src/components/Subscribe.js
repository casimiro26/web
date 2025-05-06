import React, { useState } from 'react';

const Subscribe = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`¡Gracias por suscribirte, ${email}!`);
      setEmail('');
    } else {
      alert('Por favor, ingresa un correo electrónico válido.');
    }
  };

  return (
    <section className="section has-background-light">
      <div className="container">
        <h2 className="title is-3 has-text-centered">Suscríbete a Nuestro Boletín</h2>
        <p className="subtitle is-5 has-text-centered mb-5">
          Recibe las últimas noticias y ofertas de Turismo Yarowilca directamente en tu correo.
        </p>
        <div className="columns is-centered">
          <div className="column is-half">
            <form onSubmit={handleSubmit}>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    className="input is-medium"
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="control">
                  <button
                    type="submit"
                    className="pulse-button is-medium"
                  >
                    Suscribirse
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;