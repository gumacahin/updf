import Layout from '../components/Layout';
import Head from 'next/head';

const Daglat = ({daglat}) => (
  <tr className='daglat-item'>
    <td className='daglat-item__abbr'>{daglat.abbr}</td>
    <td className='daglat-item__term'>{daglat.term}</td>
  </tr>
);

export default function About({daglat}) {
  const items = daglat.map((daglat) => <Daglat key={daglat.abbr} daglat={daglat} />);
  return (
    <Layout>
      <Head>
        <meta key='description' name='description'
          content='Tulong sa paggamit at karagdagang impormasyong tungkol sa Diksiyonaryong Filipino.' />
          <title key='title'>Tulong | Diksiyonaryong Filipino</title>
      </Head>
      <div className='content'>
        <h1>Talaan ng mga Daglat</h1>
        <table className='daglat-list'><tbody>{items}</tbody></table>
      </div>
    </Layout>
  );
}

export async function getStaticProps(context) {
  const url = 'https://raw.githubusercontent.com/gumacahin/filipino/master/updf-daglat.json';
  const data = await fetch(url).then((res) => (res.json()));

  if (!data) {
    return {
      notFound: true
    };
  }
  return { props: { daglat: data } };
}

