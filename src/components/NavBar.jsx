"use client";

import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link href="/">SpaceX Explorer</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link href="/launches/page/0">Launches</Link>
        </li>
        <li>
          <Link href="/payloads/page/0">Payloads</Link>
        </li>
        <li>
          <Link href="/rockets/page/0">Rockets</Link>
        </li>
        <li>
          <Link href="/cores/page/0">Cores</Link>
        </li>
        <li>
          <Link href="/ships/page/0">Ships</Link>
        </li>
        <li>
          <Link href="/launchpads/page/0">Launchpads</Link>
        </li>
      </ul>
    </nav>
  );
}
