import { UserSocial, SocialType } from 'app/shared/_models/data';

// -------------------
// Twitter
// -------------------

export class TwitterMessage {
    id_str: String;
    created_at: String;
    text?: String;

    user: {
        id_str: String;
        name: String;
        profile_image_url_https: String;
        url: String;
        screen_name: String;
    };
    entities: {
        urls: TWUrlObject[];
        hashtags: TWHashtagObject[];
        user_mentions: TWUserMentionObject[];
        // "video_info": {
        //     "aspect_ratio": [
        //       9,
        //       16
        //     ],
        //     "duration_millis": 10704,
        //     "variants": [
        //       {
        //         "bitrate": 320000,
        //         "content_type": "video/mp4",
        //         "url": "https://video.twimg.com/ext_tw_video/869317980307415040/pu/vid/180x320/FMei8yCw7yc_Z7e-.mp4"
        //       },
        //     ]
        //   }
        media: TWMediaObject[];
    };
    retweeted: Boolean; // The actual user has retweeted
    retweet_count: Number; // Number of retweets
    favorited: Boolean; // The actual user has favorited
    favourites_count: Number;
}


class TWUrlObject {
    expanded_url: String; // "http://blogs.ischool.berkeley.edu/i290-abdt-s12/";
    url: String; // "http://t.co/bfj7zkDJ";
    indices: [Number, Number];
    display_url: String; // "blogs.ischool.berkeley.edu/i290-abdt-s12/";
};

class TWHashtagObject {
    text: String;
    indices: [Number, Number];
};

class TWUserMentionObject {
    name: String;
    id_str: String;
    id: Number;
    indices: [Number, Number];
    screen_name: String;
};

class TWMediaObject {
    id: Number;
    id_str: String;
    indices: [Number, Number];
    media_url: String; // link to the photo
    media_url_https: String; // link to the photo
    url: String; // link to the post
    display_url: String; // link to the post
    expanded_url: String; // link to the post
    type: String; // photo, video, animated_gif
    // sizes: {}
}
