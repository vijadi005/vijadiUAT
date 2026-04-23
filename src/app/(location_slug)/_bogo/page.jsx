export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { generateMetadataLib } from "@/lib/sheets";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug || 'vaughan',
    category: '',
    page: 'bogo'
  });
  return metadata;
}

const page = async ({ params }) => {
  const { location_slug = "vaughan" } = await params;
  redirect(`/${location_slug}/bogo`);
};

export default page;
