import { BaseResp } from './utils';
import MalanConfig from './config';
declare type BaseEpisodeResp = {
    id: string;
    podcast_id: string;
    categories: Array<string>;
    description: string;
    length: number;
    mp3_bucket: string;
    mp3_key: string;
    orig_filename: string;
    pub_date: string;
    title: string;
    voice: string;
    wav_bucket: string;
    wav_key: string;
};
declare type EpisodeResponse = BaseResp & BaseEpisodeResp;
interface CreateEpisodeParams {
    categories: Array<string>;
    description: string;
    pub_date: string;
    title: string;
    voice: string;
}
declare function createEpisode(c: MalanConfig, podcast_id: string, params: CreateEpisodeParams): Promise<EpisodeResponse>;
declare function getEpisode(c: MalanConfig, podcast_id: string, id: string): Promise<EpisodeResponse>;
interface UpdateEpisodeParams {
    categories?: Array<string>;
    description?: string;
    length?: number;
    mp3_bucket?: string;
    mp3_key?: string;
    orig_filename?: string;
    pub_date?: string;
    title?: string;
    voice?: string;
    wav_bucket?: string;
    wav_key?: string;
}
declare function updateEpisode(c: MalanConfig, podcast_id: string, id: string, params: UpdateEpisodeParams): Promise<EpisodeResponse>;
declare function deleteEpisode(c: MalanConfig, podcast_id: string, id: string): Promise<EpisodeResponse>;
export { EpisodeResponse, getEpisode, createEpisode, updateEpisode, deleteEpisode, };
