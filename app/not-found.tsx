import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shop py-20 text-center">
      <p className="text-7xl">🍉</p>
      <h1 className="mt-4 text-4xl font-extrabold">Uy, esta página se la comieron</h1>
      <p className="mt-2 text-muted">El producto o la sección que buscás no existe o ya no está disponible.</p>
      <Link href="/" className="btn-ghost mt-6">Volver al inicio</Link>
    </div>
  );
}
