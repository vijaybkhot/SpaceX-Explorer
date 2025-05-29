export const revalidate = 86400;

import Link from "next/link";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import Image from "next/image";

export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/launches", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const launches = await res.json();
  const launchesPerPage = 10;

  const totalPages =
    launches.length > 0 ? Math.ceil(launches.length / launchesPerPage) : 1;

  const params = Array.from({ length: totalPages }, (element, index) => ({
    page: index.toString(),
  }));

  return params;
}

export async function generateMetadata({ params }) {
  let { page } = await params;
  page = Number(page);
  return {
    title: `Launches | SpaceX Explorer`,
    description: `Explore all SpaceX launches on page ${page + 1}`,
  };
}

const launchesUrl = "https://api.spacexdata.com/v4/launches/query";

export default async function LaunchesPage({ params }) {
  const launchesPerPage = 10;

  let { page } = await params;
  page = Number(page);

  const res = await fetch(launchesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {},
      options: { pagination: false, populate: ["launchpad"] },
    }),
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const launches = data.docs || [];

  const totalPages =
    launches.length > 0 ? Math.ceil(launches.length / launchesPerPage) : 1;

  if (isNaN(page) || page < 0 || page >= totalPages) {
    notFound();
  }

  const indexOfLastLaunch = (page + 1) * launchesPerPage;
  const indexOfFirstLaunch = indexOfLastLaunch - launchesPerPage;
  const currentLaunches = launches.slice(indexOfFirstLaunch, indexOfLastLaunch);

  return (
    <PageWrapper>
      <div className="launches-page">
        <div className="launches-container">
          <h1 className="launches-title">
            🚀 SpaceX Launches - Page {page + 1} of {totalPages}
          </h1>

          <table className="launches-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Launch Image</th>
                <th>Launch Name</th>
                <th>Launch Date</th>
                <th>Launch Status</th>
                <th>Details</th>
                <th>Launchpad</th>
                <th>More Info</th>
              </tr>
            </thead>
            <tbody>
              {currentLaunches.map((launch, index) => (
                <tr key={launch.id}>
                  <td>{indexOfFirstLaunch + index + 1}</td>
                  <td>
                    {launch.links?.patch?.small ? (
                      <Image
                        src={launch.links.patch.small}
                        alt="Launch"
                        className="launch-image"
                        width={100}
                        height={100}
                        unoptimized
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{launch.name}</td>
                  <td>{new Date(launch.date_utc).toDateString()}</td>
                  <td>
                    {launch.success ? (
                      <span className="status-success">Successful 🚀</span>
                    ) : (
                      <span className="status-failure">Failed ❌</span>
                    )}
                  </td>
                  <td>{launch.details || "N/A"}</td>
                  <td>{launch.launchpad?.full_name || "N/A"}</td>
                  <td>
                    <Link
                      href={`/launches/${launch.id}`}
                      className="details-button"
                    >
                      🔍 Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/launches/page"
          />
        </div>
      </div>
    </PageWrapper>
  );
}
