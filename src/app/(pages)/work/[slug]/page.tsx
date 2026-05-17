type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20">
      <h1 className="text-4xl">Case Study: {slug}</h1>
      <p className="mt-4 text-muted">
        Dynamic work detail route is configured. Content/data integration comes next.
      </p>
    </main>
  );
}