async function sellerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <div>seller detail page</div>;
}

export default sellerDetailPage;
