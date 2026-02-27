"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "../ProductForm";

interface Product {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  price: number;
  price_display: string;
  type: string;
  content_markdown: string | null;
  content_file: string | null;
  active: boolean;
  sort_order: number;
}

export default function EditProduktPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Nicht gefunden");
        return r.json();
      })
      .then((data) => setProduct(data.product))
      .catch(() => setError("Produkt nicht gefunden"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div>
        <div className="admin-page-header">
          <h1 className="admin-page-title">Produkt bearbeiten</h1>
          <p className="admin-page-sub">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <div className="admin-page-header">
          <h1 className="admin-page-title">Fehler</h1>
          <p className="admin-page-sub">{error || "Produkt nicht gefunden"}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{product.icon} {product.name}</h1>
        <p className="admin-page-sub">Produkt bearbeiten – ID: {product.id}</p>
      </div>
      <ProductForm
        initial={{
          ...product,
          description: product.description ?? "",
          content_markdown: product.content_markdown ?? "",
        }}
        isEdit
      />
    </div>
  );
}
