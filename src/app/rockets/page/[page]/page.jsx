export const revalidate = 86400;

import Link from "next/link";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import PageWrapper from "@/components/PageWrapper";
import Image from "next/image";

export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/rockets", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const rockets = await res.json();
  const rocketsPerPage = 10;

  const totalPages =
    rockets.length > 0 ? Math.ceil(rockets.length / rocketsPerPage) : 1;

  const params = Array.from({ length: totalPages }, (_, index) => ({
    page: index.toString(),
  }));

  return params;
}

export async function generateMetadata({ params }) {
  let { page } = await params;
  page = Number(page);
  return {
    title: `Rockets | SpaceX Explorer`,
    description: `Explore all SpaceX rockets on page ${page + 1}`,
  };
}
const rocketsUrl = "https://api.spacexdata.com/v4/rockets/query";

export default async function RocketsPage({ params }) {
  const rocketsPerPage = 10;

  let { page } = await params;

  page = Number(page);

  const res = await fetch(rocketsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {},
      options: {
        pagination: false,
        populate: [],
      },
    }),
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const rockets = data.docs || [];

  const totalPages =
    rockets.length > 0 ? Math.ceil(rockets.length / rocketsPerPage) : 1;

  if (isNaN(page) || page < 0 || page >= totalPages) {
    notFound();
  }

  const indexOfLastRocket = (page + 1) * rocketsPerPage;
  const indexOfFirstRocket = indexOfLastRocket - rocketsPerPage;
  const currentRockets = rockets.slice(indexOfFirstRocket, indexOfLastRocket);

  const handlePageChange = (pageNumber) => {
    if (typeof window !== "undefined") {
      window.location.href = `/rockets/page/${pageNumber}`;
    }
  };

  return (
    <PageWrapper>
      <div className="launches-page">
        <div className="launches-container">
          <h1 className="launches-title">
            🚀 SpaceX Rockets - Page {page + 1} of {totalPages}
          </h1>

          <table className="launches-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Rocket Image</th>
                <th>Rocket Name</th>
                <th>First Flight</th>
                <th>Cost Per Launch (USD)</th>
                <th>Success Rate (%)</th>
                <th>Mass (Kg / Lbs)</th>
                <th>More Info</th>
              </tr>
            </thead>
            <tbody>
              {currentRockets.map((rocket, index) => (
                <tr key={rocket.id}>
                  <td>{indexOfFirstRocket + index + 1}</td>
                  <td>
                    {rocket.flickr_images.length > 0 ? (
                      <Image
                        src={rocket.flickr_images[0]}
                        alt="Rocket"
                        className="launch-image"
                        width={100}
                        height={100}
                        unoptimized
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{rocket.name}</td>
                  <td>{new Date(rocket.first_flight).toDateString()}</td>
                  <td>${rocket.cost_per_launch.toLocaleString()}</td>
                  <td>{rocket.success_rate_pct}%</td>
                  <td>
                    {rocket.mass.kg.toLocaleString()} Kg /{" "}
                    {rocket.mass.lb.toLocaleString()} Lbs
                  </td>
                  <td className="text-center">
                    <Link
                      href={`/rockets/${rocket.id}`}
                      className="details-button"
                    >
                      🔍 More Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/rockets/page"
          />
        </div>
      </div>
    </PageWrapper>
  );
}
