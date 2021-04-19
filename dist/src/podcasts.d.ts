import { BaseResp } from './utils';
import MalanConfig from './config';
declare type BasePodcastResp = {
    id: string;
    categories: Array<string>;
    country_of_origin: string;
    description: string;
    explicit: boolean;
    image_url: string;
    owner_email: string;
    owner_name: string;
    title: string;
};
declare type PodcastResponse = BaseResp & BasePodcastResp;
interface CreatePodcastParams {
    categories: Array<string>;
    title: string;
    country_of_origin: string;
    description: string;
    owner_email: string;
    owner_name: string;
    image_url?: string;
    explicit?: boolean;
}
declare function createPodcast(c: MalanConfig, params: CreatePodcastParams): Promise<PodcastResponse>;
declare function getPodcast(c: MalanConfig, id: string): Promise<PodcastResponse>;
declare function updatePodcast(c: MalanConfig, id: string, params: CreatePodcastParams): Promise<PodcastResponse>;
declare function deletePodcast(c: MalanConfig, id: string): Promise<PodcastResponse>;
export { PodcastResponse, getPodcast, createPodcast, updatePodcast, deletePodcast, };
