export const revalidate = 86400;

import Link from "next/link";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import PageWrapper from "@/components/PageWrapper";
export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/payloads", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const payloads = await res.json();
  const payloadsPerPage = 10;

  const totalPages =
    payloads.length > 0 ? Math.ceil(payloads.length / payloadsPerPage) : 1;

  const params = Array.from({ length: totalPages }, (element, index) => ({
    page: index.toString(),
  }));

  return params;
}

export async function generateMetadata({ params }) {
  let { page } = await params;
  page = Number(page);
  return {
    title: `Payloads | SpaceX Explorer`,
    description: `Explore all SpaceX payloads on page ${page + 1}`,
  };
}

const payloadsUrl = "https://api.spacexdata.com/v4/payloads/query";

export default async function PayloadsPage({ params }) {
  const payloadsPerPage = 10;

  let { page } = await params;
  page = Number(page);

  const res = await fetch(payloadsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {},
      options: { pagination: false, populate: ["launch"] },
    }),
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const payloads = data.docs || [];

  const totalPages =
    payloads.length > 0 ? Math.ceil(payloads.length / payloadsPerPage) : 1;

  if (isNaN(page) || page < 0 || page >= totalPages) {
    notFound();
  }

  const indexOfLastPayload = (page + 1) * payloadsPerPage;
  const indexOfFirstPayload = indexOfLastPayload - payloadsPerPage;
  const currentPayloads = payloads.slice(
    indexOfFirstPayload,
    indexOfLastPayload
  );

  return (
    <PageWrapper>
      <div className="launches-page">
        <div className="launches-container">
          <h1 className="launches-title">
            🚀 SpaceX Payloads - Page {page + 1} of {totalPages}
          </h1>

          <table className="launches-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Payload Name</th>
                <th>Launch Date</th>
                <th>Payload Type</th>
                <th>Customers</th>
                <th>More Info</th>
              </tr>
            </thead>
            <tbody>
              {currentPayloads.map((payload, index) => (
                <tr key={payload.id}>
                  <td>{indexOfFirstPayload + index + 1}</td>
                  <td>{payload.name}</td>
                  <td>
                    {payload.launch
                      ? new Date(payload.launch.date_utc).toDateString()
                      : "N/A"}
                  </td>
                  <td>{payload.type}</td>
                  <td>
                    {payload.customers.length > 0 ? (
                      payload.customers.length > 1 ? (
                        <ol className="customer-list">
                          {payload.customers.map((customer, i) => (
                            <li key={i}>{customer}</li>
                          ))}
                        </ol>
                      ) : (
                        <span>{payload.customers[0]}</span>
                      )
                    ) : (
                      <span>No customers</span>
                    )}
                  </td>
                  <td className="text-center">
                    <Link
                      href={`/payloads/${payload.id}`}
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
            basePath="/payloads/page"
          />
        </div>
      </div>
    </PageWrapper>
  );
}
