import { getData } from "@/utils/api-helpers";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

const ImageModal = dynamic(() => import("@/components/image-modal"));

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const { id } = await params

    const data = await getData(`${process.env.PEXELS_API_URI}/photos/${id}`, "PhotoPage", { next: { revalidate: 60 }, headers: { Authorization: process.env.PEXELS_API_KEY } });

    return {
        title: `${data.alt} | Free Image`,
        description: data.alt,
    }
}


export default async function PhotoPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const data = await getData(`${process.env.PEXELS_API_URI}/photos/${id}`, "PhotoPage", { next: { revalidate: 60 }, headers: { Authorization: process.env.PEXELS_API_KEY } });

    return (
        <ImageModal />
    )
}