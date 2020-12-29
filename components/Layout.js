import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Footer() {
  return (
    <footer className='page-footer'>Ginawa nang may ❤️ ni <a href="https://github.com/gumacahin/">ME</a>. Source code sa <a href="https://github.com/gumacahin/updf">GitHub</a>.</footer>
  )
}

function Header() {
  const router = useRouter();
  return (
    <header id='top' className='page-header'>
      <h1 className='page-header__title'>
        <Link href='/'>
          <a className='page-header__title-link'>Diksiyonaryong Filipino</a>
        </Link>
      </h1>
      <div className='page-header__icons'>
        <Link href='/'>
          <a className={ (router.pathname === '/'
           || router.pathname.match(/^\/(titik|hanapin)/) )
                ? 'page-header__search page-header__search--active'
                : 'page-header__search' }>
            <FontAwesomeIcon icon={faSearch} />
          </a>
        </Link>
        <Link href='/tulong'>
          <a className={ router.pathname.match(/^\/tulong/)
                ? 'page-header__help page-header__help--active'
                : 'page-header__help' }>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </a>
        </Link>
      </div>
    </header>
  )
}

export default function Layout({ children }) {
  const [showScroll, setShowScroll] = useState(false)

  const checkScrollTop = () => {    
    if (!showScroll && window.pageYOffset > 400){
        setShowScroll(true)    
    } else if (showScroll && window.pageYOffset <= 400){
        setShowScroll(false)    
    }  
  };

  const scrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    }
  });

  return (
    <>
      <Head>
          <title>Diksiyonaryong Filipino</title>
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <meta name='description' content='Alamin ang kahulugan ng mga salita sa wikang Filipino at ang tumpak na ispeling at estilo ng pagsulat ng mga ito.' />
          <link rel="manifest" href="/manifest.json" />
          <link rel="search"
          type="application/opensearchdescription+xml"
          href="/opensearch.xml"
          title="Maghanap ng salita" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <meta name="theme-color" content="#303336" />
      </Head>
      <Header />
      <main className='page-body' role='main'>{children}</main>
      <a href='#top'
        className={`scroll-to-top scroll-to-top${ showScroll ? '' : '--hidden'}`}
        onClick={scrollTop}
        >
        <FontAwesomeIcon icon={faArrowCircleUp} />
      </a>
      <Footer />
    </>
  );
}
  