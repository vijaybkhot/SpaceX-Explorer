export const revalidate = 86400;

import GoBackButton from "@/components/GoBackButton";
import { isValidObjectId } from "@/helpers/helpers";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import Image from "next/image";

// Get all ids for static page generation for all launchpads
export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/launchpads", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const launchpads = await res.json();

  return launchpads.map((launchpad) => ({
    id: launchpad.id,
  }));
}

export async function generateMetadata({ params }) {
  let { id } = await params;

  const res = await fetch(`https://api.spacexdata.com/v4/launchpads/${id}`);
  const launchpad = await res.json();

  return {
    title: `${launchpad.name} | SpaceX Explorer`,
    description:
      launchpad.details || "Detailed information about this SpaceX launchpad.",
  };
}

const launchpadsUrl = "https://api.spacexdata.com/v4/launchpads/query";

export default async function LaunchpadPage({ params }) {
  const { id } = await params;

  if (!id || !isValidObjectId(id)) {
    notFound();
  }

  const res = await fetch(launchpadsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: { _id: id },
      options: {
        pagination: false,
        populate: ["launches", "rockets"],
      },
    }),
    cache: "force-cache",
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const launchpad = data?.docs?.[0];

  if (!launchpad) {
    notFound();
  }

  return (
    <PageWrapper>
      <div className="launch-page">
        <h1 className="launch-title">Launchpad: {launchpad.full_name}</h1>

        <div className="launch-section">
          <h2>🧾 Launchpad Information</h2>
          <p>
            <strong>Launchpad Name:</strong> {launchpad.name || "N/A"}
          </p>
          <p>
            <strong>Launchpad Fullname:</strong> {launchpad.full_name || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {launchpad.status || "N/A"}
          </p>
        </div>

        <div className="launch-section">
          <h2>📍 Location</h2>
          <p>
            <strong>Locality:</strong> {launchpad.locality || "N/A"}
          </p>
          <p>
            <strong>Region:</strong> {launchpad.region || "N/A"}
          </p>
          <p>
            <strong>Co-ordinates:</strong>{" "}
            {launchpad.latitude
              ? `${launchpad.latitude}, ${launchpad.longitude}`
              : "N/A"}
          </p>
          <p>
            <strong>Timezone:</strong> {launchpad.timezone || "N/A"}
          </p>
        </div>

        {launchpad.images.large.length > 0 && (
          <div className="launch-section">
            <h2>📍 Photo</h2>
            <div className="patch-container">
              <Image
                src={launchpad.images.large[0]}
                alt="Launchpad"
                className="launchpad-image"
                width={100}
                height={100}
                unoptimized
              />
            </div>
          </div>
        )}

        <div className="launch-section">
          <h2>📊 Launchpad Stats</h2>
          <p>
            <strong>Launch Attempts:</strong>{" "}
            {launchpad.launch_attempts || "N/A"}
          </p>
          <p>
            <strong>Launch Successes:</strong>{" "}
            {launchpad.launch_successes || "N/A"}
          </p>
          {launchpad.rockets.length > 0 ? (
            <>
              <strong>Rockets Launched:</strong>
              <ul>
                {launchpad.rockets.map((rocket) => (
                  <li key={rocket.id}>
                    {rocket.name}{" "}
                    <Link href={`/rockets/${rocket.id}`} className="text-link">
                      View Rocket Details Page
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No Rockets Launched</p>
          )}
        </div>

        <div className="launch-section">
          <h2>📄 History and Details</h2>
          <p>{launchpad.details || "N/A"}</p>
        </div>

        <div className="launch-section">
          <h2>🚀 Launches</h2>
          {launchpad.launches.length > 0 ? (
            <>
              <strong>Launches So Far:</strong>
              <ul>
                {launchpad.launches.map((launch) => (
                  <li key={launch.id}>
                    {launch.name}{" "}
                    <Link href={`/launches/${launch.id}`} className="text-link">
                      View Launch Details Page
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No Launches So Far</p>
          )}
        </div>

        <div className="go-back-btn">
          <GoBackButton optionalRoute="/launchpads/page/0">
            Go Back To Launchpads Listing
          </GoBackButton>
        </div>
      </div>
    </PageWrapper>
  );
}
