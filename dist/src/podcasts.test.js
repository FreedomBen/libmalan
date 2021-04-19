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
const podcasts = require("./podcasts");
const test_config_1 = require("../test/test_config");
const test_helpers_1 = require("../test/test_helpers");
describe('#getPodcast', () => {
    it('Gets a podcast by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const podcast_one = yield test_helpers_1.podcastOne();
        const account = yield test_helpers_1.regularAccount();
        const podcast = (yield podcasts.getPodcast(test_config_1.forSession(account.session), podcast_one.id)).data;
        expect(podcast_one.description).toEqual(podcast.description);
        expect(podcast_one.title).toEqual(podcast.title);
        expect(podcast_one.country_of_origin).toEqual(podcast.country_of_origin);
        expect(podcast_one.image_url).toEqual(podcast.image_url);
        expect(podcast_one.owner_email).toEqual(podcast.owner_email);
        expect(podcast_one.owner_name).toEqual(podcast.owner_name);
    }));
});
describe('#createPodcast', () => {
    it('Creates a new podcast', () => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield test_helpers_1.regularAccount();
        const podcastParams = {
            categories: ["one", "two"],
            description: "Nice description",
            country_of_origin: "US",
            title: "Podcast Title",
            owner_email: 'Buddy@libace.io',
            owner_name: 'Buddy',
            image_url: "image_url",
            explicit: true,
        };
        const newPodcast = yield podcasts.createPodcast(test_config_1.forSession(account.session), podcastParams);
        expect(newPodcast.data.categories).toEqual(["one", "two"]);
        expect(newPodcast.data.description).toMatch(/Nice description/);
        expect(newPodcast.data.title).toMatch(/Podcast Title/);
    }));
    //describe('#updatePodcast', () => {
    //  it('Creates a new podcast', async () => {
    //    const account = await regularAccount()
    //    const newPodcast = await podcasts.createPodcast(forSession(account.session), podcastParams)
    //    expect(newPodcast.data.categories).toEqual(["one", "two"])
    //    expect(newPodcast.data.description).toMatch(/Nice description/)
    //    expect(newPodcast.data.title).toMatch(/Podcast Title/)
    //  });
});
