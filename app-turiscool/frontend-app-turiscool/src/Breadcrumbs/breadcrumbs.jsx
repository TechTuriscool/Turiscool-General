import React from "react";
import { Link } from "react-router-dom";
import "./breadcrumbs.css";

const Breadcrumbs = () => {
  const breadcrumbs = [
    {
      name: "Home",
      path: "/",
    },
  ];

  // Recoger la ruta actual
  const path = window.location.pathname;
  // Separar las partes de la ruta
  const parts = path.split("/");

  // Recorrer las partes de la ruta y generar breadcrumbs
  parts.forEach((part, index) => {
    if (part) {
      const breadcrumb = {
        name: part.charAt(0).toUpperCase() + part.slice(1),
        path: parts.slice(0, index + 1).join("/"),
      };
      breadcrumbs.push(breadcrumb);
    }
  });

  // Reverse the breadcrumbs array
  const reversedBreadcrumbs = [...breadcrumbs].reverse();

  return (
    <div className="breadcrumbs">
      {reversedBreadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="breadcrumb">
          <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
