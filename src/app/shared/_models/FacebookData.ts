import { UserSocial, SocialType } from 'app/shared/_models/data';

// -------------------
// Facebook
// -------------------

export class FacebookSocial implements UserSocial {
    social_id?: String;
    bd_id?: String;
    type: SocialType;
    access_token: String;
    expires_at: String;
    email?: String;
    login?: String;
    grantedScopes: String;
    signedRequest: String;
}

export class FacebookProfile {
    id: number;
    name: String;
}

export class FacebookTimelineMsg {
    created_time: String;
    id: String;
    message?: String;
    from: {
        id: String;
        name: String;
    };
    attachment?: String;
    permalink_url?: String;
    media?: String[];
    type: any;
    source: String;
}


export class FacebookAttach {
    description: String;
    media: {
        image: {
            height: number;
            src: String;
            width: number;
        }
    };
    url: String;
    type: String;
}
