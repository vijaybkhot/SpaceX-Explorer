export const revalidate = 86400;

import GoBackButton from "@/components/GoBackButton";
import { isValidObjectId } from "@/helpers/helpers";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import Image from "next/image";
// Get all ids for static page generation for all cores
export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/rockets", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const rockets = await res.json();

  return rockets.map((rocket) => ({
    id: rocket.id,
  }));
}

export async function generateMetadata({ params }) {
  let { id } = await params;
  const res = await fetch(`https://api.spacexdata.com/v4/rockets/${id}`);
  const rocket = await res.json();

  return {
    title: `${rocket.name} | SpaceX Explorer`,
    description:
      rocket.description || "Detailed information about this SpaceX rocket.",
  };
}

const rocketsUrl = "https://api.spacexdata.com/v4/rockets/query";

export default async function RocketPage({ params }) {
  const { id } = await params;

  if (!id || !isValidObjectId(id)) {
    notFound();
  }

  const res = await fetch(rocketsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: { _id: id },
      options: {
        pagination: false,
        populate: [],
      },
    }),
    cache: "force-cache",
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const rocket = data?.docs?.[0];

  if (!rocket) {
    notFound();
  }

  const launch = rocket?.launches?.[0];
  return (
    <PageWrapper>
      <div className="launch-page">
        <h1 className="launch-title">Rocket: {rocket.name}</h1>
        <p className="launch-status">
          <span>Type: {rocket.type}</span>
          {rocket.active ? (
            <span className="success"> &nbsp; Active ✅</span>
          ) : (
            <span className="failure"> &nbsp; Retired ❌</span>
          )}
        </p>
        <p className="launch-date">
          First Flight: {new Date(rocket.first_flight).toDateString()}
        </p>

        {rocket.flickr_images.length > 0 && (
          <div className="launch-section">
            <h2>📍 Photo</h2>
            <Image
              src={rocket.flickr_images[0]}
              alt="Rocket Image"
              className="launchpad-image"
              width={100}
              height={100}
              unoptimized
            />
          </div>
        )}

        <div className="launch-section">
          <h2>🧾 Rocket Information</h2>
          <p>
            <strong>Company:</strong> {rocket.company || "N/A"}
          </p>
          <p>
            <strong>Country:</strong> {rocket.country || "N/A"}
          </p>
        </div>

        <div className="launch-section">
          <h2>📆 Rocket History and Details</h2>
          <p>
            <strong>Description:</strong> {rocket.description || "N/A"}
          </p>
          {rocket.wikipedia ? (
            <a
              href={rocket.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Wikipedia Link
            </a>
          ) : (
            <p className="text-link">No Wikipedia Link</p>
          )}
        </div>

        <div className="launch-section">
          <h2>🔢 Stats</h2>
          <p>
            <strong>Cost Per Launch ($):</strong>{" "}
            {rocket.cost_per_launch.toLocaleString() || "N/A"}
          </p>
          <p>
            <strong>Success Rate (%):</strong>{" "}
            {rocket.success_rate_pct || "N/A"}
          </p>
          <p>
            <strong>Stages:</strong> {rocket.stages || "N/A"}
          </p>
          <p>
            <strong>Boosters:</strong> {rocket.boosters || "N/A"}
          </p>
        </div>

        <div className="launch-section">
          <h2>📦 Payload Weights</h2>
          <table className="rocket-table">
            <thead>
              <tr>
                <th>Orbit</th>
                <th>Weight (kg)</th>
                <th>Weight (lbs)</th>
              </tr>
            </thead>
            <tbody>
              {rocket.payload_weights.map((payload) => (
                <tr key={payload.id}>
                  <td>{payload.name}</td>
                  <td>{payload.kg.toLocaleString()} kg</td>
                  <td>{payload.lb.toLocaleString()} lbs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="launch-section">
          <h2>📏 Mass and Dimensions</h2>
          <p>
            <strong>Height (m/ft):</strong> {rocket.height.meters || "N/A"} m /{" "}
            {rocket.height.feet || "N/A"} ft
          </p>
          <p>
            <strong>Diameter (m/ft):</strong> {rocket.diameter.meters || "N/A"}{" "}
            m / {rocket.diameter.feet || "N/A"} ft
          </p>
          <p>
            <strong>Mass (Kg/Lbs):</strong> {rocket.mass.kg || "N/A"} Kg /{" "}
            {rocket.mass.lb || "N/A"} Lbs
          </p>
        </div>

        <div className="launch-section">
          <h2>1️⃣ First Stage Details</h2>
          <ul>
            <li>Engines: {rocket.first_stage.engines}</li>
            <li>Reusable: {rocket.first_stage.reusable ? "Yes" : "No"}</li>
            <li>Fuel: {rocket.first_stage.fuel_amount_tons} tons</li>
            <li>Burn Time: {rocket.first_stage.burn_time_sec} sec</li>
            <li>
              Thrust (Sea Level): {rocket.first_stage.thrust_sea_level.kN} kN
            </li>
            <li>Thrust (Vacuum): {rocket.first_stage.thrust_vacuum.kN} kN</li>
          </ul>
        </div>

        <div className="launch-section">
          <h2>2️⃣ Second Stage Details</h2>
          <ul>
            <li>Engines: {rocket.second_stage.engines}</li>
            <li>Reusable: {rocket.second_stage.reusable ? "Yes" : "No"}</li>
            <li>Fuel: {rocket.second_stage.fuel_amount_tons} tons</li>
            <li>Burn Time: {rocket.second_stage.burn_time_sec} sec</li>
            <li>Thrust: {rocket.second_stage.thrust.kN} kN</li>
          </ul>
        </div>

        <div className="launch-section">
          <h2>⚙️ Engine Information</h2>
          <ul>
            <li>Type: {rocket.engines.type}</li>
            <li>Version: {rocket.engines.version}</li>
            <li>Layout: {rocket.engines.layout}</li>
            <li>
              Propellants: {rocket.engines.propellant_1} +{" "}
              {rocket.engines.propellant_2}
            </li>
            <li>Thrust-to-weight: {rocket.engines.thrust_to_weight}</li>
            <li>ISP (Sea Level): {rocket.engines.isp.sea_level}</li>
            <li>ISP (Vacuum): {rocket.engines.isp.vacuum}</li>
          </ul>
        </div>

        <div className="go-back-btn">
          <GoBackButton optionalRoute="/rockets/page/0">
            Go Back To Rockets Listing
          </GoBackButton>
        </div>
      </div>
    </PageWrapper>
  );
}
