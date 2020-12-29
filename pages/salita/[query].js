import Layout from '../../components/Layout';
import Search from '../../components/Search';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from '../../util/fetcher';
import Head from 'next/head';

export default function List() {
  const router = useRouter();
  const { query } = router.query;
  const { data, error } = useSWR(
    `/api/word/${encodeURI(query)}`, fetcher)

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

  const title = `${ query ? query : 'Maghanap ng Kahulugan' } | Diksiyonaryong Filipino`;
  const description = query ?
            `Kahulugan ng salitang “${query}” mula sa Diksiyonaryong Filipino.`
          : `Maghanap ng kahulugan ng mga salitang Filipino.`
  // @TODO getStaticPaths/getStaticProps to pre-render each word for SEO
  return (
    <Layout>
      <Head>
          <title key='title'>{title}</title>
          <meta
            name='description' key='description'
            content={description}
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