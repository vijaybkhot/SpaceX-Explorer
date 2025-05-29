export const revalidate = 86400;

import Link from "next/link";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import PageWrapper from "@/components/PageWrapper";
import Image from "next/image";

export async function generateStaticParams() {
  const res = await fetch("https://api.spacexdata.com/v4/ships", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });

  const ships = await res.json();
  const shipsPerPage = 10;

  const totalPages =
    ships.length > 0 ? Math.ceil(ships.length / shipsPerPage) : 1;

  const params = Array.from({ length: totalPages }, (_, index) => ({
    page: index.toString(),
  }));

  return params;
}

export async function generateMetadata({ params }) {
  let { page } = await params;
  page = Number(page);
  return {
    title: `Ships | SpaceX Explorer`,
    description: `Explore all SpaceX ships on page ${page + 1}`,
  };
}

const shipsUrl = "https://api.spacexdata.com/v4/ships/query";

export default async function ShipsPage({ params }) {
  const shipsPerPage = 10;

  let { page } = await params;

  page = Number(page);

  const res = await fetch(shipsUrl, {
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
  const ships = data.docs || [];

  const totalPages =
    ships.length > 0 ? Math.ceil(ships.length / shipsPerPage) : 1;

  if (isNaN(page) || page < 0 || page >= totalPages) {
    notFound();
  }

  const indexOfLastShip = (page + 1) * shipsPerPage;
  const indexOfFirstShip = indexOfLastShip - shipsPerPage;
  const currentShips = ships.slice(indexOfFirstShip, indexOfLastShip);

  return (
    <PageWrapper>
      <div className="launches-page">
        <div className="launches-container">
          <h1 className="launches-title">
            🚢 SpaceX Ships - Page {page + 1} of {totalPages}
          </h1>

          <table className="launches-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Ship Image</th>
                <th>Ship Name</th>
                <th>Year Built</th>
                <th>Roles</th>
                <th>Mass (Kg / Lbs)</th>
                <th>Home Port</th>
                <th>More Info</th>
              </tr>
            </thead>
            <tbody>
              {currentShips.map((ship, index) => (
                <tr key={ship.id}>
                  <td>{indexOfFirstShip + index + 1}</td>

                  <td>
                    {ship.image ? (
                      <Image
                        src={ship.image}
                        alt="Ship"
                        className="launch-image"
                        width={100}
                        height={100}
                        unoptimized
                      />
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </td>

                  <td>{ship.name}</td>
                  <td>{ship.year_built || "N/A"}</td>

                  <td>
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
                  </td>

                  <td>
                    {ship.mass_kg && ship.mass_lbs
                      ? `${ship.mass_kg.toLocaleString()} Kg / ${ship.mass_lbs.toLocaleString()} Lbs`
                      : "N/A"}
                  </td>

                  <td>{ship.home_port || "N/A"}</td>

                  <td className="text-center">
                    <Link href={`/ships/${ship.id}`} className="details-button">
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
            basePath="/ships/page"
          />
        </div>
      </div>
    </PageWrapper>
  );
}
