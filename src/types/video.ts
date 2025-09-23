export interface PexelsVideoFile {
    id: number;
    quality: string;
    file_type: string;
    width: number | null;
    height: number | null;
    link: string;
}

export interface PexelsVideoPicture {
    id: number;
    picture: string;
    nr: number;
}

export interface PexelsVideoUser {
    id: number;
    name: string;
    url: string;
}

export interface PexelsVideo {
    id: number;
    width: number;
    height: number;
    url: string;
    image: string;
    duration: number;
    user: PexelsVideoUser;
    video_files: PexelsVideoFile[];
    video_pictures: PexelsVideoPicture[];
}

export interface PexelsVideoSearchResponse {
    page: number;
    per_page: number;
    total_results: number;
    url: string;
    videos: PexelsVideo[];
    next_page?: string;
}
