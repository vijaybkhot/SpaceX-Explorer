export const revalidate = 86400;

import GoBackButton from "@/components/GoBackButton";
import { isValidObjectId } from "@/helpers/helpers";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import Image from "next/image";

// Get all ids for static page generation for all cores
export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/ships", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const ships = await res.json();

  return ships.map((ship) => ({
    id: ship.id,
  }));
}

export async function generateMetadata({ params }) {
  let { id } = await params;

  const res = await fetch(`https://api.spacexdata.com/v4/ships/${id}`);
  const ship = await res.json();

  return {
    title: `${ship.name} | SpaceX Explorer`,
    description:
      ship.description || "Detailed information about this SpaceX ship.",
  };
}

const shipsUrl = "https://api.spacexdata.com/v4/ships/query";

export default async function ShipPage({ params }) {
  const { id } = await params;

  if (!id || !isValidObjectId(id)) {
    notFound();
  }

  const res = await fetch(shipsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: { _id: id },
      options: {
        pagination: false,
        populate: ["launches"],
      },
    }),
    cache: "force-cache",
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const ship = data?.docs?.[0];

  if (!ship) {
    notFound();
  }

  return (
    <PageWrapper>
      <div className="launch-page">
        <h1 className="launch-title">Ship: {ship.name}</h1>
        <h3 className="launch-title">Type: {ship.type}</h3>

        {ship.image && (
          <div className="launch-section">
            <h2>📍 Photo</h2>
            <div className="text-center">
              <Image
                src={ship.image}
                alt="Ship Image"
                className="launchpad-image"
                width={100}
                height={100}
                unoptimized
              />
            </div>
          </div>
        )}

        <div className="launch-section">
          <h2>🧾 Ship Information</h2>
          <div>
            <p>
              <strong>Ship Name: </strong> {ship.name || "N/A"}
            </p>
            <p>
              <strong>Ship Type: </strong> {ship.type || "N/A"}
            </p>
            <p>
              <strong>Status: </strong> {ship.status || "N/A"}
            </p>
            <p>
              <strong>Year Built: </strong> {ship.year_built || "N/A"}
            </p>
            <p>
              <strong>Home Port: </strong> {ship.home_port || "N/A"}
            </p>
            <div>
              <strong>Roles: </strong>{" "}
              {ship.roles.length > 0 ? (
                ship.roles.length > 1 ? (
                  <ul>
                    {ship.roles.map((role, index) => (
                      <li key={index}>{role}</li>
                    ))}
                  </ul>
                ) : (
                  ship.roles[0]
                )
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>

        <div className="launch-section">
          <h2>✅ Technical Sepcs</h2>
          <div>
            <p>
              <strong>IMO: </strong> {ship.imo || "N/A"}
            </p>
            <p>
              <strong>MMSI: </strong> {ship.mmsi || "N/A"}
            </p>
            <p>
              <strong>ABS: </strong> {ship.abs || "N/A"}
            </p>
            <p>
              <strong>Class: </strong> {ship.class || "N/A"}
            </p>
            <p>
              <strong>Mass: </strong>{" "}
              {ship.mass_kg && ship.mass_lbs
                ? `${ship.mass_kg.toLocaleString()} Kg / ${ship.mass_lbs.toLocaleString()} Lbs`
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="launch-section">
          <h2>🚀 Launches</h2>
          <div>
            {ship.launches.length > 0 ? (
              <>
                <strong>Launches So Far:</strong>
                <ol className="list-decimal pl-5">
                  {ship.launches.map((launch) => (
                    <li key={launch.id}>
                      <span>{launch.name}</span>{" "}
                      <Link
                        href={`/launches/${launch.id}`}
                        className="text-link"
                      >
                        View Launch Details Page
                      </Link>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <p>No Launches So Far</p>
            )}
          </div>
        </div>

        <div className="go-back-btn">
          <GoBackButton optionalRoute="/ships/page/0">
            Go Back To Ships Listing
          </GoBackButton>
        </div>
      </div>
    </PageWrapper>
  );
}
