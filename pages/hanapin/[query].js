import Layout from '../../components/Layout';
import Search from '../../components/Search';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import fetcher from '../../util/fetcher';
import { useEffect } from 'react';

export default function List() {
  const router = useRouter();
  const { query } = router.query;
  const { data, error } = useSWR(
    `/api/search/${encodeURI(query)}`, fetcher)

  const getId = (s) => {
    try {
      return s.match(/#(.+)$/)[1];
    } catch(e) {
      return null;
    }
  }

  useEffect(() => {
    const id = getId(document.location.href);
    if (!id) {
      return;
    }
    const target = document.getElementById(id);
    target && target.scrollIntoView();
  });

  let content;
  if (error) {
    content =  <div className='error'>Nabigong mag-load. Subukan ulit maya-maya.</div>
  } else if (!data) {
    content =  <div className='info'>Nagloload…</div>
  } else { 
    content = <div className='word-list'>{
      data.data.map((entry) => (
        <div className='word-list__item'
        key={entry.order}
        dangerouslySetInnerHTML={ {__html: entry.entry} }
        />
      )) }</div>
  }

  return (
    <Layout>
      <Head>
          <title key='title'>Mga Resulta ng Paghahanap | Diksiyonaryong Filipino</title>
          <meta
            name='description'
            content={
              `Hanapin ang kahulugan ng mga salita sa Diksiyonaryong Filipino.`}
            key='description'
          />
      </Head>
      <div className='wrapper'>
        <Search />
        { data  ? <h2 className='search-query'>{ query }</h2> : null }
        { content }
      </div>
    </Layout>
  );
}