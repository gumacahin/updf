import Link from 'next/link';
import  { letters }  from '../constants';

export default function Letters() {
  return (
    <nav className="main-navigation">
      <ul className="navigation-list">{
       letters.map((letter) => (
        <li className="navigation-list__item" key={letter.char}>
          <Link href={`/titik/${letter.name}`}>
            <a className="navigation-list__link">{letter.char}</a>
          </Link>
        </li>))
      }</ul>
    </nav>
  );
}