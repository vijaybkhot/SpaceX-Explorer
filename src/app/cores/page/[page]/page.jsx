export const revalidate = 86400;

import Link from "next/link";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import PageWrapper from "@/components/PageWrapper";

export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/cores", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const cores = await res.json();
  const coresPerPage = 10;

  const totalPages =
    cores.length > 0 ? Math.ceil(cores.length / coresPerPage) : 1;

  const params = Array.from({ length: totalPages }, (_, index) => ({
    page: index.toString(),
  }));

  return params;
}

export async function generateMetadata({ params }) {
  let { page } = await params;
  page = Number(page);
  return {
    title: `Cores | SpaceX Explorer`,
    description: `Explore all SpaceX Cores on page ${page + 1}`,
  };
}

const coresUrl = "https://api.spacexdata.com/v4/cores/query";

export default async function CoresPage({ params }) {
  const coresPerPage = 10;

  let { page } = await params;

  page = Number(page);

  const res = await fetch(coresUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {},
      options: {
        pagination: false,
        populate: ["launches"],
      },
    }),
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const cores = data.docs || [];

  const totalPages =
    cores.length > 0 ? Math.ceil(cores.length / coresPerPage) : 1;

  if (isNaN(page) || page < 0 || page >= totalPages) {
    notFound();
  }

  const indexOfLastCore = (page + 1) * coresPerPage;
  const indexOfFirstCore = indexOfLastCore - coresPerPage;
  const currentCores = cores.slice(indexOfFirstCore, indexOfLastCore);

  return (
    <PageWrapper>
      <div className="launches-page">
        <div className="launches-container">
          <h1 className="launches-title">
            🚀 SpaceX Cores - Page {page + 1} of {totalPages}
          </h1>

          <table className="launches-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Core Serial</th>
                <th>Last Update</th>
                <th>Current Status</th>
                <th>Number of Launches</th>
                <th>More Information</th>
              </tr>
            </thead>
            <tbody>
              {currentCores.map((core, index) => (
                <tr key={core.id}>
                  <td>{indexOfFirstCore + index + 1}</td>
                  <td>{core.serial ? core.serial : "Unknown"}</td>
                  <td>{core.last_update ? core.last_update : "N/A"}</td>
                  <td>
                    {core.status !== null
                      ? `${core.status[0].toUpperCase()}${core.status.slice(1)}`
                      : "Unknown"}
                  </td>
                  <td className="text-center">
                    {core.launches.length > 0 ? core.launches.length : 0}
                  </td>
                  <td className="text-center">
                    <Link href={`/cores/${core.id}`} className="details-button">
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
            basePath="/cores/page"
          />
        </div>
      </div>
    </PageWrapper>
  );
}
