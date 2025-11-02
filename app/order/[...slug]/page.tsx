async function OrderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <h1>Order Detail Page</h1>
      <p>Order: {slug}</p>
    </div>
  );
}

export default OrderDetailPage;
