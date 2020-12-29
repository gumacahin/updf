import { useRef, useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Search from '../../components/Search';
import Letters from '../../components/Letters';
import { useRouter } from 'next/router';
import fetcher from '../../util/fetcher';
import  useSWR  from 'swr';
import  Head  from 'next/head';
import { letters } from '../../constants';
import debounce from 'lodash.debounce';


function EntryWord({entry}) {
  return (
    <div className='word-list__item'
     key={entry.order}
     dangerouslySetInnerHTML={ {__html: entry.entry} }
    />
  );
}

function Page({ letter, index, setPageEnd }) {

  const { data , error } = useSWR(
    `http://localhost:3000/api/list?letter=${letter}&page=${index}`, fetcher
  );

  if (error) return <div className="error">Naku! May error.</div>
  if (!data) return <div className="notice">Nagloload pa…</div>

  setTimeout(() => {
    data.data.length > 0 ? setPageEnd(false) : setPageEnd(true);
  }, 0);

  return data.data.map( entry => <EntryWord key={entry.order} entry={entry} />);
}

export default function List({ data }) {
  const wordList = useRef(null);
  const [count, setCount] = useState(2);
  const [pageEnd, setPageEnd] = useState(false);
  const router = useRouter();
  const { titik } = router.query;
  const letter = letters.find((letter) => letter.name === titik);
  const firstPage = data.map( entry => <EntryWord key={entry.order} entry={entry} /> );
  const pages = [];

  for (let i = 2; i < count; i++) {
    pages.push(<Page letter={titik} index={i} key={i} setPageEnd={setPageEnd} />);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  });

  const handleScroll = debounce(() => {
    if (pageEnd) return; 
    if (wordList.current.getBoundingClientRect().bottom <= window.innerHeight) {
      setCount(count + 1);
    }
  }, 500);

  return (
    <Layout>
      <Head>
          <title key='title'>{letter.char} ({letter.name}) | Diksiyonaryong Filipino</title>
          <meta
            name='description'
            content={
              `Mga salitang Filipino na nagsisimula sa titik “${letter.char}” (${letter.name}).`}
            key='description'
          />
      </Head>
      <div className='wrapper'>
        <Search />
        <Letters />
        <div ref={wordList} className='word-list'>{firstPage}{pages}</div>
      </div>
    </Layout>
  );
}

export function getStaticPaths() {
  const paths = letters.map((letter) => ({ params: { titik: letter.name } }) );
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const titik = params.titik;
  const urlStart = process.env.NODE_ENV === 'development'
    ? "http://localhost:3000"
    : "https://" + process.env.VERCEL_URL
  const {
     data
  } = await fetch(`${urlStart}/api/list?letter=${titik}`)
  .then(res => res.json());

  return {
    props: { data },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  }
}