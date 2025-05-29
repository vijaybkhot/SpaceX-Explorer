export const revalidate = 86400;

import GoBackButton from "@/components/GoBackButton";
import { isValidObjectId } from "@/helpers/helpers";
import { notFound } from "next/navigation";
import Link from "next/link";
import VideoEmbed from "@/components/VideoEmbed";
import PageWrapper from "@/components/PageWrapper";

// Get all ids for static page generation for all cores
export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/cores", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const cores = await res.json();

  return cores.map((core) => ({
    id: core.id,
  }));
}

export async function generateMetadata({ params }) {
  let { id } = await params;
  const res = await fetch(`https://api.spacexdata.com/v4/cores/${id}`);
  const core = await res.json();

  return {
    title: `${core.serial} | SpaceX Explorer`,
    description:
      core.last_update || "Detailed information about this SpaceX core.",
  };
}

const coresUrl = "https://api.spacexdata.com/v4/cores/query";

export default async function CorePage({ params }) {
  const { id } = await params;

  if (!id || !isValidObjectId(id)) {
    notFound();
  }

  const res = await fetch(coresUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: { _id: id },
      options: {
        populate: [
          "launches",
          {
            path: "launches",
            populate: [
              { path: "crew.crew" },
              { path: "rocket" },
              { path: "ships" },
              { path: "payloads" },
              { path: "launchpad" },
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
  const core = data?.docs?.[0];
  const launch = core.launches?.[0];

  if (!core) {
    notFound();
  }

  return (
    <PageWrapper>
      <div className="launch-page">
        <h1 className="launch-title">Core: {core.serial || "N/A"}</h1>

        <div className="launch-section">
          <h2>🧾 More Information</h2>
          <p>
            <strong>Number of Launches:</strong>{" "}
            {core.launches?.length || "N/A"}
          </p>
          <p>
            <strong>Current Status:</strong>{" "}
            {core.status
              ? core.status.charAt(0).toUpperCase() + core.status.slice(1)
              : "N/A"}
          </p>
          <p>
            <strong>Last Update:</strong> {core.last_update || "N/A"}
          </p>
          <p>
            <strong>Block:</strong> {core.block || "N/A"}
          </p>
          <p>
            <strong>Reuse Count:</strong> {core.reuse_count ?? "N/A"}
          </p>
        </div>

        <div className="launch-section">
          <h2>🛬 Landing & Recovery</h2>
          <p>
            <strong>RTLS Attempts:</strong> {core.rtls_attempts ?? "N/A"}
          </p>
          <p>
            <strong>RTLS Landings:</strong> {core.rtls_landings ?? "N/A"}
          </p>
          <p>
            <strong>ASDS Attempts:</strong> {core.asds_attempts ?? "N/A"}
          </p>
          <p>
            <strong>ASDS Landings:</strong> {core.asds_landings ?? "N/A"}
          </p>
        </div>

        {launch && (
          <section className="launch-section">
            <h2>🚀 Launch Details</h2>

            <p>
              <strong>Mission:</strong> {launch.name}
            </p>
            <p>
              <strong>Date:</strong> {new Date(launch.date_utc).toDateString()}
            </p>

            {/* Rocket */}
            {launch.rocket && (
              <p>
                <strong>Rocket:</strong>{" "}
                <Link
                  href={`/rockets/${launch.rocket.id}`}
                  className="text-link"
                >
                  {launch.rocket.name}
                </Link>
              </p>
            )}

            {/* Launchpad */}
            {launch.launchpad && (
              <p>
                <strong>Launchpad:</strong>{" "}
                <Link
                  href={`/launchpads/${launch.launchpad.id}`}
                  className="text-link"
                >
                  {launch.launchpad.full_name}
                </Link>
              </p>
            )}

            {/* Payloads */}
            {launch.payloads?.length > 0 && (
              <div>
                <strong>Payloads:</strong>
                <ul>
                  {launch.payloads.map((p, i) => (
                    <li key={p.id || i}>
                      <Link href={`/payloads/${p.id}`} className="text-link">
                        {p.name || `Payload ${i + 1}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ships */}
            {launch.ships?.length > 0 && (
              <div>
                <strong>Ships:</strong>
                <ul>
                  {launch.ships.map((s, i) => (
                    <li key={s.id || i}>
                      <Link href={`/ships/${s.id}`} className="text-link">
                        {s.name || `Ship ${i + 1}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* YouTube Video */}
            {launch.links?.youtube_id && (
              <div className="video-section">
                <h3>🎥 Launch Video</h3>
                <VideoEmbed videoId={launch.links.youtube_id} />
              </div>
            )}
          </section>
        )}

        <div className="go-back-btn">
          <GoBackButton optionalRoute="/cores/page/0">
            Go Back To Cores List
          </GoBackButton>
        </div>
      </div>
    </PageWrapper>
  );
}
