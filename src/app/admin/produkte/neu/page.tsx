"use client";

import ProductForm from "../ProductForm";

export default function NeuesProduktPage() {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Neues Produkt</h1>
        <p className="admin-page-sub">Erstelle ein neues digitales Produkt mit Stripe-Verknüpfung</p>
      </div>
      <ProductForm />
    </div>
  );
}
