

import { DataStoreService } from './data-store.service';
import { Injectable } from '@angular/core';
import { DataSession } from '../_models/data';

@Injectable()
/**
 * Servicio especializado en guardar el estado del usuario
 * */
export class DataSessionService extends DataStoreService {
    // this.data (from parent) is a Session type

    constructor() {
        const session: DataSession = {
            timeline: []
        };
        super('session-data', session);
    }

    // Set the log in data in the session
    save(timeline) {
        super.setData({ timeline: timeline });
    }

    // Update the timeline's session information
    add(timeline) {
        const data = this.data.timeline.concat(timeline);
        super.setData({ timeline: data });
    }

    // Delete the timeline's session information
    removeTimeline() {
        super.setData({ timeline: null });
    }
    // Get the timeline's session information
    getTimeline() {
        return this.data.timeline;
    }



}
