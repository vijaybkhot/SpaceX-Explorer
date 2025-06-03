import Link from "next/link";

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to SpaceX Explorer</h1>
      <p>
        This website provides information about SpaceX, including its history,
        launches, rockets, payloads, and more. Use the links below to explore
        the SpaceX API and learn more about the exciting milestones in space
        exploration.
      </p>

      <div className="links">
        <ul>
          <li>
            <Link href="/launches/page/0">Launches Listing</Link>
          </li>
          <li>
            <Link href="/payloads/page/0">Payloads Listing</Link>
          </li>
          <li>
            <Link href="/cores/page/0">Cores Listing</Link>
          </li>
          <li>
            <Link href="/rockets/page/0">Rockets Listing</Link>
          </li>
          <li>
            <Link href="/ships/page/0">Ships Listing</Link>
          </li>
          <li>
            <Link href="/launchpads/page/0">Launch Pads Listing</Link>
          </li>
        </ul>
      </div>

      <h2>SpaceX History</h2>
      <p>
        SpaceX has made significant contributions to the field of space
        exploration. Below are some historical milestones:
      </p>
      <ul>
        <li>
          <a
            href="http://www.spacex.com/news/2013/02/11/flight-4-launch-update-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Falcon reaches Earth orbit
          </a>
          - 2008-09-28
        </li>
        <li>
          <a
            href="http://www.spacex.com/news/2013/02/12/falcon-1-flight-5"
            target="_blank"
            rel="noopener noreferrer"
          >
            Falcon delivers payload to orbit
          </a>
          - 2009-07-13
        </li>
        <li>
          <a
            href="http://www.bbc.com/news/10209704"
            target="_blank"
            rel="noopener noreferrer"
          >
            First successful Dragon launch
          </a>
          - 2010-06-04
        </li>
        <li>
          <a
            href="http://www.cnn.com/2010/US/12/08/space.flight/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dragon capsule births with ISS
          </a>
          - 2010-12-08
        </li>
        <li>
          <a
            href="http://www.newspacejournal.com/2013/03/27/after-dragon-spacexs-focus-returns-to-falcon/"
            target="_blank"
            rel="noopener noreferrer"
          >
            First Falcon 9 GTO mission
          </a>
          - 2013-12-03
        </li>
        <li>
          <a
            href="https://spaceflightnow.com/2015/12/22/round-trip-rocket-flight-gives-spacex-a-trifecta-of-successes/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Successful Falcon 9 landing
          </a>
          - 2015-12-22
        </li>
        <li>
          <a
            href="https://spaceflightnow.com/2016/04/08/spacex-lands-rocket-on-floating-platform-after-station-resupply-launch/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Successful Falcon 9 droneship landing
          </a>
          - 2016-04-08
        </li>
        <li>
          <a
            href="https://spaceflightnow.com/2017/03/31/spacex-flies-rocket-for-second-time-in-historic-test-of-cost-cutting-technology/"
            target="_blank"
            rel="noopener noreferrer"
          >
            First Falcon 9 reflight
          </a>
          - 2017-03-30
        </li>
        <li>
          <a
            href="https://spaceflightnow.com/2017/03/31/spacex-flies-rocket-for-second-time-in-historic-test-of-cost-cutting-technology/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fairing recovered successfully
          </a>
          - 2017-03-30
        </li>
        <li>
          <a
            href="https://spaceflightnow.com/2017/06/03/reused-dragon-cargo-capsule-launched-on-journey-to-space-station/"
            target="_blank"
            rel="noopener noreferrer"
          >
            First Dragon reflight
          </a>
          - 2017-06-03
        </li>
        <li>
          <a
            href="https://spaceflightnow.com/2018/02/07/spacex-debuts-worlds-most-powerful-rocket-sends-tesla-toward-the-asteroid-belt/"
            target="_blank"
            rel="noopener noreferrer"
          >
            First Falcon Heavy heliocentric mission
          </a>
          - 2018-02-06
        </li>
        <li>
          <a
            href="https://spaceflightnow.com/2019/03/02/spacex-launches-first-crew-dragon-ferry-ship/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Successful Dragon 2 docking with ISS
          </a>
          - 2019-03-02
        </li>
        <li>
          <a href="null" target="_blank" rel="noopener noreferrer">
            First flight of Raptor engine
          </a>
          - 2019-07-25
        </li>
        <li>
          <a href="null" target="_blank" rel="noopener noreferrer">
            First Falcon 9 fairing reuse
          </a>
          - 2020-09-03
        </li>
        <li>
          <a
            href="https://spaceflightnow.com/2020/05/30/nasa-astronauts-launch-from-us-soil-for-first-time-in-nine-years/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SpaceX successfully launches humans to ISS
          </a>
          - 2020-05-30
        </li>
      </ul>
    </div>
  );
}
