import { getData } from "@/utils/api-helpers";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

const VideoView = dynamic(() => import("@/components/video-view"));

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const { id } = await params

    const data = await getData(`${process.env.PEXELS_API_URI}/videos/videos/${id}`, "VideoPage", { next: { revalidate: 60 }, headers: { Authorization: process.env.PEXELS_API_KEY } });

    return {
        title: `${data.user?.name}'s - Free Stock Video`,
        description: `Watch and download a free stock video by ${data.user?.name}`,
    }
}

export default async function VideoPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const data = await getData(`${process.env.PEXELS_API_URI}/videos/videos/${id}`, "VideoPage", { next: { revalidate: 21600 }, headers: { Authorization: process.env.PEXELS_API_KEY } });

    return (
        <VideoView data={data} />
    )
}