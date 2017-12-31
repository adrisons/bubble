import { UserSocial, SocialType } from 'app/shared/_models/data';

// -------------------
// Facebook
// -------------------

export class FacebookSocial implements UserSocial {
    social_id: String;
    bd_id?: String;
    user_id: String;
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

export class FacebookMessage {
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
    shares?; // Number of shares for the post
    likes?;
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
    target: {
        id: String;
        url: String;
    };
    url: String;
}
