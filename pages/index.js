import Head from 'next/head';
import Search from '../components/Search';
import Layout from '../components/Layout';
import Letters from '../components/Letters';

export default function Home() {
  return (
    <Layout>
      <div className="wrapper">
        <Search />
        <Letters />
      </div>
    </Layout>
  )
}
