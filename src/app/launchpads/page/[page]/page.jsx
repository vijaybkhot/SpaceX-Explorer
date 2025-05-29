export const revalidate = 86400;

import Link from "next/link";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import PageWrapper from "@/components/PageWrapper";
import Image from "next/image";

export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/launchpads", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const launchpads = await res.json();
  const launchpadsPerPage = 10;

  const totalPages =
    launchpads.length > 0
      ? Math.ceil(launchpads.length / launchpadsPerPage)
      : 1;

  const params = Array.from({ length: totalPages }, (_, index) => ({
    page: index.toString(),
  }));

  return params;
}

export async function generateMetadata({ params }) {
  let { page } = await params;
  page = Number(page);
  return {
    title: `Launchpads | SpaceX Explorer`,
    description: `Explore all SpaceX launchpads on page ${page + 1}`,
  };
}

const launchpadsUrl = "https://api.spacexdata.com/v4/launchpads/query";

export default async function LaunchpadsPage({ params }) {
  const launchpadsPerPage = 10;

  let { page } = await params;

  page = Number(page);

  const res = await fetch(launchpadsUrl, {
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
  const launchpads = data.docs || [];

  const totalPages =
    launchpads.length > 0
      ? Math.ceil(launchpads.length / launchpadsPerPage)
      : 1;

  if (isNaN(page) || page < 0 || page >= totalPages) {
    notFound();
  }

  const indexOfLastLaunchpad = (page + 1) * launchpadsPerPage;
  const indexOfFirstLaunchpad = indexOfLastLaunchpad - launchpadsPerPage;
  const currentLaunchpads = launchpads.slice(
    indexOfFirstLaunchpad,
    indexOfLastLaunchpad
  );

  return (
    <PageWrapper>
      <div className="launches-page">
        <div className="launches-container">
          <h1 className="launches-title">
            🚀 SpaceX Launchpads - Page {page + 1} of {totalPages}
          </h1>

          <table className="launches-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Launchpad Image</th>
                <th>Launchpad Name</th>
                <th>Full Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Launch Attempts</th>
                <th>Successes</th>
                <th>More Info</th>
              </tr>
            </thead>
            <tbody>
              {currentLaunchpads.map((launchpad, index) => (
                <tr key={launchpad.id}>
                  <td>{indexOfFirstLaunchpad + index + 1}</td>

                  <td>
                    {launchpad.images?.large?.length > 0 ? (
                      <Image
                        src={launchpad.images.large[0]}
                        alt="Launchpad"
                        className="launch-image"
                        width={100}
                        height={100}
                        unoptimized
                      />
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </td>

                  <td>{launchpad.name}</td>
                  <td>{launchpad.full_name}</td>
                  <td>{`${launchpad.locality}, ${launchpad.region}`}</td>
                  <td>{launchpad.status}</td>
                  <td>{launchpad.launch_attempts}</td>
                  <td>{launchpad.launch_successes}</td>

                  <td className="text-center">
                    <Link
                      href={`/launchpads/${launchpad.id}`}
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
            basePath="/launchpads/page"
          />
        </div>
      </div>
    </PageWrapper>
  );
}
