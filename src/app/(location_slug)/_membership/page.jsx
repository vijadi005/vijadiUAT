export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const metadata = await generateMetadataLib({
    location: params.location_slug || 'vaughan',
    category: '',
    page: 'membership'
  });
  return metadata;
}



const page = async ({ params }) => {
  const { location_slug = "vaughan" } = await params;
  redirect(`/${location_slug}/membership`);
};

export default page;
