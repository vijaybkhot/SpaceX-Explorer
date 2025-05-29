export const revalidate = 86400;

import GoBackButton from "@/components/GoBackButton";
import VideoEmbed from "@/components/VideoEmbed";
import { isValidObjectId } from "@/helpers/helpers";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";

// Get all ids for static page generation for all payloads
export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/payloads", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const payloads = await res.json();

  return payloads.map((payload) => ({
    id: payload.id,
  }));
}

export async function generateMetadata({ params }) {
  let { id } = await params;

  const res = await fetch(`https://api.spacexdata.com/v4/payloads/${id}`);
  const payload = await res.json();

  return {
    title: `${payload.name} | SpaceX Explorer`,
    description:
      payload.details || "Detailed information about this SpaceX payload.",
  };
}

const payloadsUrl = "https://api.spacexdata.com/v4/payloads/query";

export default async function PayloadPage({ params }) {
  const { id } = await params;

  if (!id || !isValidObjectId(id)) {
    notFound();
  }

  const res = await fetch(payloadsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: { _id: id },
      options: {
        populate: [
          "launch",
          {
            path: "launch",
            populate: [
              { path: "launchpad" },
              { path: "rocket" },
              { path: "ships" },
              {
                path: "cores",
                populate: { path: "core" },
              },
            ],
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
  const payload = data?.docs?.[0];

  if (!payload) {
    notFound();
  }

  const launch = payload.launch;
  const rocket = launch?.rocket;
  const launchpad = launch?.launchpad;
  const ships = launch?.ships || [];
  const cores = launch?.cores || [];

  return (
    <PageWrapper>
      <div className="launch-page">
        <h1 className="launch-title">Payload: {payload.name}</h1>

        {/* Payload Basic Info */}
        <div className="launch-section">
          <h2>🧾 Payload Information</h2>
          <p>
            <strong>Type:</strong> {payload.type}
          </p>

          {payload.customers?.length > 0 && (
            <>
              <strong>Customer(s):</strong>
              <ul>
                {payload.customers.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </>
          )}

          {payload.mass_kg !== null && (
            <p>
              <strong>Mass:</strong> {payload.mass_kg} kg ({payload.mass_lbs}{" "}
              lbs)
            </p>
          )}

          {payload.nationalities?.length > 0 && (
            <>
              <strong>Nationality:</strong> {payload.nationalities.join(", ")}
            </>
          )}

          {payload.reference_system && (
            <p>
              <strong>Reference System:</strong>{" "}
              {payload.reference_system[0].toUpperCase() +
                payload.reference_system.slice(1)}
            </p>
          )}
        </div>

        {/* Launch Info */}
        {launch && (
          <div className="launch-section">
            <h2>🚀 Launch Details</h2>
            <p>
              <strong>Mission Name:</strong> {launch.name}
            </p>
            {launch.id && (
              <p>
                <Link href={`/launches/${launch.id}`} className="text-link">
                  🔗 View Launch Details
                </Link>
              </p>
            )}
            <p>
              <strong>Launch Date:</strong>{" "}
              {new Date(launch.date_utc).toDateString()}
            </p>

            {/* Launchpad */}
            {launchpad && (
              <>
                <p>
                  <strong>Launchpad:</strong> {launchpad.full_name}
                </p>
                <p>
                  <strong>Location:</strong> {launchpad.locality},{" "}
                  {launchpad.region}
                </p>
                {launchpad.id && (
                  <p>
                    <Link
                      href={`/launchpads/${launchpad.id}`}
                      className="text-link"
                    >
                      🔗 View Launchpad
                    </Link>
                  </p>
                )}
              </>
            )}

            {/* Rocket */}
            {rocket && (
              <>
                <h3>🚀 Rocket Used</h3>
                <p>
                  <strong>Name:</strong> {rocket.name}
                </p>
                <p>
                  <strong>Type:</strong> {rocket.type}
                </p>
                {rocket.id && (
                  <p>
                    <Link href={`/rockets/${rocket.id}`} className="text-link">
                      🔗 View Rocket
                    </Link>
                  </p>
                )}
              </>
            )}

            {/* Cores */}
            {cores.length > 0 && (
              <>
                <h3>🛰️ Cores</h3>
                <ul>
                  {cores.map(({ core }, i) => (
                    <li key={core?.id || i}>
                      <strong>Core Serial:</strong> {core?.serial || "N/A"} —
                      <strong> Reuse Count:</strong>{" "}
                      {core?.reuse_count ?? "N/A"}{" "}
                      {core?.id && (
                        <Link href={`/cores/${core.id}`} className="text-link">
                          🔗 View Core
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Ships */}
            {ships.length > 0 && (
              <>
                <h3>🚢 Ships Involved</h3>
                <ul>
                  {ships.map((ship, i) => (
                    <li key={ship?.id || i}>
                      <strong>Name:</strong> {ship?.name || "N/A"} —
                      <strong> Type:</strong> {ship?.type || "N/A"}{" "}
                      {ship?.id && (
                        <Link href={`/ships/${ship.id}`} className="text-link">
                          🔗 View Ship
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Video Embed */}
            {launch.links?.youtube_id && (
              <div className="video-section">
                <h2>🎥 Watch the Launch</h2>
                <VideoEmbed videoId={launch.links.youtube_id} />
              </div>
            )}
          </div>
        )}

        {/* Go Back Button */}
        <div className="go-back-btn">
          <GoBackButton optionalRoute="/payloads/page/0">
            ← Go Back To Payloads Listing
          </GoBackButton>
        </div>
      </div>
    </PageWrapper>
  );
}
