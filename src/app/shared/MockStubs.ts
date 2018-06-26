import {Observable} from 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';

export class MockUserApi {
  getCurrentId() { return 123; }

  getCurrent() { return Observable.from([ {'username' : 'admin'} ]); }

  getCurrentToken() { return {'user' : {'username' : 'admin'}}; }

  getCachedCurrent() { return {'username' : 'admin'}; }
  }

export class MockDatasetApi {
  getDatasets() { return Observable.from([]); }

  getDatablocks() { return Observable.from([]); }

  find() { return Observable.from([]); }

  findById() { return Observable.from([]); }
  }

export class MockMatDialogRef {

}

export class MockMatDialogData {

}

export class MockDatablockApi {
  getDatafiles() { return Observable.from([]); }
  }

export class MockDatasetLifecycleApi {}

export class MockAuthService {}

export class MockLoopBackAuth {

  user = {};

  getUser() { return Observable.from([ {'username' : 'admin'} ]); }

  setUser(user) { this.user = user; }
  }

export class MockLocation {}

export class MockActivatedRoute {
  // stub detail goes here
  snapshot = {queryParams : {returnUrl : '/'}};
  params = Observable.from([ {'id' : 1} ]);
  queryParams = Observable.from([ {'limit' : 10} ]);
}

export class MockRouter {
  navigate = function(url, params) {};
  // jasmine.createSpy('navigate');
  navigateByUrl(url: string) { return url; }
  }

export class MockHttp {}

export class MockJobApi {

  find() {
    return Observable.from([ [ {
      creationTime : '2017-06-19T08:38:14.671Z',
      emailJobInitiator : 'test.user@psi.ch',
      id : '59478d76d7bbe2dd2e619cb6',
      type : 'retrieve'
    } ] ]);
  }
  }

export class MockConfigService {
  getConfigFile() { return Observable.from([ undefined ]); }
  }

export class MockJobHandlerService {}

export class MockParamsService {}

export class MockDatasetService {
  datasetChange: Subject<string> = new Subject<string>();

  // TODO hold datasets and return array of samples
  searchDatasets() { return null; }

  searchDatasetsObservable() { return Observable.from([]); }

  getBlockObservable() { return Observable.from([]); }
  }

export class MockProposalApi {

  // TODO hold datasets and return array of samples
  find(filter?: any) { return Observable.from([]); }
  }

export class MockUserMsgService {

  private subject = new Subject<any>();

  getMessage(): Observable<any> { return this.subject.asObservable(); }

  sendMessage(message: object, delay = 0) {}

  clearMessage() {}
  }

export class MockStore {
  public dispatch(obj) {}

  public select(obj) { return Observable.of([]); }
  public pipe(obj) { return Observable.of(null); }
}


export class MockNotificationService {
  public dispatch(obj) {}

  public select(obj) { return Observable.of([]); }
}