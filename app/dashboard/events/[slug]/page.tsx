// app/events/[slug]/page.tsx
import EventDetailClient from "../../../components/EventDetailClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventPage({ params }: Props) {
  const resolvedParams = await params;
  return <EventDetailClient slug={resolvedParams.slug} />;
}
