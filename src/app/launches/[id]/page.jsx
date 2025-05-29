export const revalidate = 86400;

import Link from "next/link";
import { notFound } from "next/navigation";
import VideoEmbed from "@/components/VideoEmbed";
import GoBackButton from "@/components/GoBackButton";
import { isValidObjectId } from "@/helpers/helpers";
import PageWrapper from "@/components/PageWrapper";
import Image from "next/image";

// Get all ids for static page generation for all payloads
export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/launches", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const launches = await res.json();

  return launches.map((launch) => ({
    id: launch.id,
  }));
}

export async function generateMetadata({ params }) {
  let { id } = await params;
  const res = await fetch(`https://api.spacexdata.com/v4/launches/${id}`);
  const launch = await res.json();

  return {
    title: `${launch.name} | SpaceX Explorer`,
    description:
      launch.details || "Detailed information about this SpaceX launch.",
  };
}

const launchesUrl = "https://api.spacexdata.com/v4/launches/query";

export default async function LaunchPage({ params }) {
  const { id } = await params;

  if (!id || !isValidObjectId(id)) {
    notFound();
  }

  const res = await fetch(launchesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: { _id: id },
      options: {
        populate: [
          "payloads",
          "launchpad",
          "rocket",
          "crew.crew",
          "ships",
          {
            path: "cores",
            populate: {
              path: "core",
            },
          },
        ],
      },
    }),
    cache: "force-cache",
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const launch = data?.docs?.[0];

  if (!launch) {
    notFound();
  }

  return (
    <PageWrapper>
      <div className="launch-page">
        <h1 className="launch-title">Launch Mission: {launch.name}</h1>
        <p className="launch-date">
          <strong>Date:</strong>{" "}
          {new Date(launch.date_utc).toLocaleDateString()}
        </p>
        <p
          className={`launch-status ${launch.success ? "success" : "failure"}`}
        >
          {launch.success ? "✅ Successful Launch" : "❌ Failed Launch"}
        </p>
        {launch.links?.patch?.small && (
          <div className="patch-container">
            <Image
              src={launch.links.patch.small}
              alt="Mission Patch"
              className="patch-image"
              loading="lazy"
              width={100}
              height={100}
              unoptimized
            />
          </div>
        )}

        {/* Mission Details */}
        <section className="launch-section">
          <h2>🧾 Mission Details</h2>
          <p>
            <strong>Flight #:</strong> {launch.flight_number}
          </p>
          <p>
            <strong>Details:</strong> {launch.details || "N/A"}
          </p>
          {launch.failures.length > 0 && (
            <p>
              <strong>Failure Reasons:</strong>{" "}
              {launch.failures.map((f, i) => (
                <span key={i}>
                  {i + 1}) {f.reason}
                  {i !== launch.failures.length - 1 && ", "}
                </span>
              ))}
            </p>
          )}
        </section>

        {/* Rocket Details */}
        <section className="launch-section">
          <h2>🚀 Rocket Details</h2>
          <p>
            <Link href={`/rockets/${launch.rocket.id}`} className="text-link">
              <strong>Name:</strong> {launch.rocket?.name || "N/A"}
            </Link>
          </p>
          <p>
            <strong>Type:</strong> {launch.rocket?.type || "N/A"}
          </p>
        </section>

        {/* Launchpad Details */}
        <section className="launch-section">
          <h2>📍 Launchpad Details</h2>
          <p>
            <strong>Name:</strong> {launch.launchpad?.full_name || "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {launch.launchpad?.locality || "N/A"},{" "}
            {launch.launchpad?.region || "N/A"}
          </p>
          {launch.launchpad?.id && (
            <Link
              href={`/launchpads/${launch.launchpad.id}`}
              className="text-link"
            >
              Launchpad Details Page
            </Link>
          )}
        </section>

        {/* Cores */}
        <section className="launch-section">
          <h2>🛰️ Cores</h2>
          {launch.cores?.length > 0 ? (
            <ul>
              {launch.cores.map(({ core }, i) => (
                <li key={core?.serial || i}>
                  <strong>Core Serial:</strong> {core?.serial || "N/A"} —{" "}
                  <strong>Reuse Count:</strong> {core?.reuse_count ?? "N/A"}
                  {core?.id && (
                    <Link href={`/cores/${core.id}`} className="text-link">
                      View Core
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No core data available.</p>
          )}
        </section>

        {/* Payloads */}
        <section className="launch-section">
          <h2>🧑‍🚀 Payloads</h2>
          {launch.payloads?.length > 0 ? (
            <ul>
              {launch.payloads.map((p, i) => (
                <li key={p.id || i}>
                  <strong>Payload:</strong> {p.name} — <strong>Mass:</strong>{" "}
                  {p.mass_kg ? `${p.mass_kg} kg` : "N/A"}
                  {p.id && (
                    <Link href={`/payloads/${p.id}`} className="text-link">
                      View Payload
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No payloads available.</p>
          )}
        </section>

        {/* Ships */}
        <section className="launch-section">
          <h2>🚢 Ships Involved</h2>
          {launch.ships?.length > 0 ? (
            <ul>
              {launch.ships.map((ship, i) => (
                <li key={ship.id || i}>
                  <strong>Name:</strong> {ship.name || "N/A"} —{" "}
                  <strong>Type:</strong> {ship.type || "N/A"}
                  {ship.id && (
                    <Link href={`/ships/${ship.id}`} className="text-link">
                      View Ship
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No ships involved.</p>
          )}
        </section>

        {launch.links?.youtube_id && (
          <section id="webcast" className="launch-section">
            <h2>🎥 Watch the Launch</h2>
            <VideoEmbed videoId={launch.links.youtube_id} />
          </section>
        )}

        <div className="mt-4 text-center">
          <GoBackButton optionalRoute="/launches/page/0">
            ← Go Back To Launches Listing
          </GoBackButton>
        </div>
      </div>
    </PageWrapper>
  );
}
