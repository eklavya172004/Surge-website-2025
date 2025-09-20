// app/events/[slug]/page.tsx
import EventDetailClient from "../../../components/EventDetailClient";

interface Props {
  params: {
    slug: string;
  };
}

export default function EventPage({ params }: Props) {
  return <EventDetailClient slug={params.slug} />;
}
