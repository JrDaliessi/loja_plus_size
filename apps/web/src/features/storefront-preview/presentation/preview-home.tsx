import Image from 'next/image';

import type { PreviewCollectionResult } from '../application/preview-collection-source';
import { PreviewEmptyState } from './preview-empty-state';
import { PreviewErrorState } from './preview-error-state';

type PreviewHomeProps = Readonly<{
  result: PreviewCollectionResult;
}>;

export function PreviewHome({ result }: PreviewHomeProps) {
  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Ir para o conteúdo principal
      </a>

      <p className="preview-disclosure" role="note">
        Prévia demonstrativa — dados e imagens ilustrativos
      </p>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Plus Store — início">
          <span className="brand-mark" aria-hidden="true">
            PS
          </span>
          <span>
            <strong>Plus Store</strong>
            <small>Moda com presença</small>
          </span>
        </a>

        <nav aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#colecao">Coleção</a>
          <a href="#manifesto">Manifesto</a>
        </nav>
      </header>

      <main id="conteudo-principal" tabIndex={-1}>
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">Moda plus size com presença</p>
            <h1 id="hero-title">Vista aquilo que faz você ocupar o mundo.</h1>
            <p className="hero-copy">
              Uma direção editorial pensada para valorizar estilo, conforto e
              expressão — com a fotografia e cada história no centro.
            </p>
            <a className="primary-action" href="#colecao">
              Conhecer a coleção
              <span aria-hidden="true">↘</span>
            </a>
          </div>

          <aside className="hero-signature" aria-label="Manifesto da prévia">
            <span aria-hidden="true">✦</span>
            <p>Elegância que acompanha movimento, personalidade e presença.</p>
          </aside>
        </section>

        <section
          className="collection-section"
          id="colecao"
          aria-labelledby="collection-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow editorial">Curadoria Purple Noir</p>
              <h2 id="collection-title">Coleção em foco</h2>
            </div>
            <p>
              Quatro estudos de forma e movimento para apresentar a linguagem
              visual desta experiência.
            </p>
          </div>

          {result.status === 'ready' ? (
            <div className="concept-grid">
              {result.items.map((item, index) => (
                <article className="concept-card" key={item.id}>
                  <div className="concept-image-wrap">
                    <Image
                      alt={item.image.alt}
                      className="concept-image"
                      height={item.image.height}
                      priority={index === 0}
                      sizes="(max-width: 767px) 92vw, (max-width: 1199px) 44vw, 23vw"
                      src={item.image.src}
                      width={item.image.width}
                    />
                    <span className="concept-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="concept-details">
                    <div>
                      <p>{item.category}</p>
                      <h3>{item.name}</h3>
                    </div>
                    <span>{item.conceptLabel}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : result.status === 'empty' ? (
            <PreviewEmptyState />
          ) : (
            <PreviewErrorState message={result.message} />
          )}
        </section>

        <section
          className="manifesto"
          id="manifesto"
          aria-labelledby="manifesto-title"
        >
          <p className="manifesto-quote" aria-hidden="true">
            “
          </p>
          <div>
            <p className="eyebrow">Nosso ponto de vista</p>
            <h2 id="manifesto-title">A moda começa quando você se reconhece.</h2>
          </div>
          <p>
            Criamos esta prévia para imaginar uma experiência inclusiva,
            sofisticada e humana, onde cada composição respeita corpos reais.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark" aria-hidden="true">
            PS
          </span>
          <strong>Plus Store</strong>
        </a>
        <p>Prévia Purple Noir · Conteúdo exclusivamente demonstrativo.</p>
        <a href="#inicio">Voltar ao início ↑</a>
      </footer>
    </>
  );
}
