"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const episodes = require("./episodes");
const test_config_1 = require("../test/test_config");
const test_helpers_1 = require("../test/test_helpers");
describe('#getEpisode', () => {
    it('Gets a episode by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const podcast_one = yield test_helpers_1.podcastOne();
        const episode_one = yield test_helpers_1.episodeOne();
        const account = yield test_helpers_1.regularAccount();
        const episode = (yield episodes.getEpisode(test_config_1.forSession(account.session), podcast_one.id, episode_one.id)).data;
        expect(episode_one.description).toEqual(episode.description);
        expect(episode_one.length).toEqual(episode.length);
        expect(episode_one.title).toEqual(episode.title);
    }));
});
describe('#createEpisode', () => {
    it('Creates a new episode', () => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield test_helpers_1.regularAccount();
        const podcast_one = yield test_helpers_1.podcastOne();
        const episodeParams = {
            categories: ["one", "two"],
            description: "Nice description",
            pub_date: '2011-05-18T15:01:01Z',
            title: "Episode Title",
            voice: 'Buddy',
        };
        const newEpisode = yield episodes.createEpisode(test_config_1.forSession(account.session), podcast_one.id, episodeParams);
        expect(newEpisode.data.id).toMatch(test_helpers_1.uuidRegex);
        expect(newEpisode.data.categories).toEqual(['one', 'two']);
        expect(newEpisode.data.title).toEqual('Episode Title');
        expect(newEpisode.data.voice).toEqual('Buddy');
    }));
});
describe('#updateEpisode', () => {
    it('Update an episode by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const podcast_one = yield test_helpers_1.podcastOne();
        const episode_one = yield test_helpers_1.episodeOne();
        const account = yield test_helpers_1.regularAccount();
        const episode = (yield episodes.updateEpisode(test_config_1.forSession(account.session), podcast_one.id, episode_one.id, { mp3_key: "OHAI" })).data;
        expect(episode.id).toMatch(test_helpers_1.uuidRegex);
        expect(episode.id).toMatch(episode_one.id);
        expect(episode.mp3_key).toEqual("OHAI");
    }));
});
describe('#deleteEpisode', () => {
    it('Deletes an episode by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield test_helpers_1.regularAccount();
        const podcast_one = yield test_helpers_1.podcastOne();
        const episodeParams = {
            categories: ["one", "two"],
            description: "Nice description",
            pub_date: '2011-05-18T15:01:01Z',
            title: "Episode Title",
            voice: 'Buddy',
        };
        const newEpisode = yield episodes.createEpisode(test_config_1.forSession(account.session), podcast_one.id, episodeParams);
        expect(newEpisode.data.id).toMatch(test_helpers_1.uuidRegex);
        const deleted = yield episodes.deleteEpisode(test_config_1.forSession(account.session), podcast_one.id, newEpisode.data.id);
        expect(deleted.status).toEqual(204);
        expect(deleted.data).toEqual({});
    }));
});
