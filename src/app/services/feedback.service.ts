import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map , catchError} from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';

import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

    submitFeedback(feedback: Feedback): Observable<Feedback> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      }; 
      return this.http.post<Feedback>(baseURL + 'feedback',feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

    }
}
