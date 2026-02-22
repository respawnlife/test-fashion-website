import { useTranslation } from 'react-i18next';
import './Hero.css';

function Hero() {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          {t('home.heroTitle')}
        </h1>
        <p className="hero-subtitle">
          {t('home.heroSubtitle')}
        </p>
        <a href="#collections" className="hero-cta">
          {t('home.exploreBtn')}
        </a>
      </div>
      <div className="hero-image">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=1600&fit=crop" 
          alt="Fashion Hero"
        />
      </div>
    </section>
  );
}

export default Hero;
